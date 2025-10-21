<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user('api');
        $bookings = Booking::with('room')
            ->where('user_email', $user->email)
            ->orderByDesc('check_in')
            ->paginate(10);
        return response()->json($bookings);
    }

    public function store(Request $request)
    {
        $user = $request->user('api'); // This will be null for public bookings

        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'number_of_guests' => 'required|integer|min:1',
            'title' => 'nullable|string',
            'name' => 'nullable|string',
            'email' => 'required|email',
        ]);

        $room = Room::findOrFail($validated['room_id']);

        if ($validated['number_of_guests'] > $room->number_of_guests) {
            return response()->json(['message' => 'Guest count exceeds room capacity'], 422);
        }

        // Check availability: no overlapping active bookings
        $overlap = Booking::where('room_id', $room->id)
            ->where('status', '!=', 'cancelled')
            ->where(function ($ov) use ($validated) {
                $ov->whereBetween('check_in', [$validated['check_in'], $validated['check_out']])
                   ->orWhereBetween('check_out', [$validated['check_in'], $validated['check_out']])
                   ->orWhere(function ($w) use ($validated) {
                       $w->where('check_in', '<=', $validated['check_in'])
                         ->where('check_out', '>=', $validated['check_out']);
                   });
            })
            ->exists();

        if ($overlap) {
            return response()->json(['message' => 'Room not available for selected dates'], 422);
        }

        $nights = (new \DateTime($validated['check_in']))->diff(new \DateTime($validated['check_out']))->days;
        if ($nights <= 0) {
            return response()->json(['message' => 'Invalid stay duration'], 422);
        }

        $coordinationFee = (float) ($room->service_and_tax_fee ?? 0); // reuse as base fee
        $serviceAndTax = (float) ($room->service_and_tax_fee ?? 0);
        $totalRoom = $nights * (float) $room->price_per_night;
        $total = $totalRoom + $coordinationFee + $serviceAndTax;

        $booking = DB::transaction(function () use ($user, $room, $validated, $nights, $coordinationFee, $serviceAndTax, $total) {
            return Booking::create([
                'room_id' => $room->id,
                'user_email' => $user ? $user->email : $validated['email'],
                'check_in' => $validated['check_in'],
                'check_out' => $validated['check_out'],
                'number_of_nights' => $nights,
                'number_of_guests' => $validated['number_of_guests'],
                'coordination_fee' => $coordinationFee,
                'service_and_tax_fee' => $serviceAndTax,
                'total_fee' => $total,
                'status' => 'confirmed',
                'guest_title' => $validated['title'] ?? null,
                'guest_name' => $validated['name'] ?? null,
                'guest_email' => $validated['email'] ?? null,
            ]);
        });

        return response()->json($booking->load('room'), 201);
    }

    public function cancel(Request $request, Booking $booking)
    {
        $user = $request->user('api');
        if ($booking->user_email !== $user->email) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        if ($booking->status === 'cancelled') {
            return response()->json($booking);
        }
        $booking->status = 'cancelled';
        $booking->save();
        return response()->json($booking);
    }
}



