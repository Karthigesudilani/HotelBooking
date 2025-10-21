<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = [
            [
                'room_number' => '101',
                'room_name' => 'Standard Room',
                'description' => 'Comfortable standard room with essential amenities for a pleasant stay.',
                'number_of_guests' => 2,
                'price_per_night' => 80.00,
                'service_and_tax_fee' => 12.00,
                'image' => 'standard-room.jpg'
            ],
            [
                'room_number' => '201',
                'room_name' => 'Deluxe Room',
                'description' => 'Spacious deluxe room with premium amenities and city view.',
                'number_of_guests' => 2,
                'price_per_night' => 120.00,
                'service_and_tax_fee' => 18.00,
                'image' => 'deluxe-room.jpg'
            ],
            [
                'room_number' => '301',
                'room_name' => 'Family Suite',
                'description' => 'Large family suite with separate living area, perfect for families.',
                'number_of_guests' => 4,
                'price_per_night' => 160.00,
                'service_and_tax_fee' => 24.00,
                'image' => 'family-suite.jpg'
            ]
        ];

        foreach ($rooms as $roomData) {
            Room::create($roomData);
        }
    }
}
