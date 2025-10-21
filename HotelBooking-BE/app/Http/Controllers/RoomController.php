<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function show(Room $room)
    {
        return response()->json($room);
    }

    public function search(Request $request)
    {
        $validated = $request->validate([
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'number_of_guests' => 'nullable|integer|min:1',
            'q' => 'nullable|string',
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0',
        ]);

        $query = Room::query();

        if (!empty($validated['number_of_guests'])) {
            $query->where('number_of_guests', '>=', $validated['number_of_guests']);
        }

        if (!empty($validated['q'])) {
            $q = $validated['q'];
            $query->where(function ($sub) use ($q) {
                $sub->where('room_name', 'like', "%$q%")
                    ->orWhere('room_number', 'like', "%$q%")
                    ->orWhere('description', 'like', "%$q%");
            });
        }

        if (isset($validated['min_price'])) {
            $query->where('price_per_night', '>=', $validated['min_price']);
        }
        if (isset($validated['max_price'])) {
            $query->where('price_per_night', '<=', $validated['max_price']);
        }

        // Availability filter: exclude rooms that have overlapping bookings
        $checkIn = $validated['check_in'];
        $checkOut = $validated['check_out'];
        $query->whereDoesntHave('bookings', function ($b) use ($checkIn, $checkOut) {
            $b->where('status', '!=', 'cancelled')
              ->where(function ($ov) use ($checkIn, $checkOut) {
                  $ov->whereBetween('check_in', [$checkIn, $checkOut])
                     ->orWhereBetween('check_out', [$checkIn, $checkOut])
                     ->orWhere(function ($w) use ($checkIn, $checkOut) {
                         $w->where('check_in', '<=', $checkIn)
                           ->where('check_out', '>=', $checkOut);
                     });
              });
        });

        return response()->json($query->paginate(10));
    }
}



