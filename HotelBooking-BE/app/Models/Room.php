<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_number',
        'room_name',
        'description',
        'number_of_guests',
        'price_per_night',
        'service_and_tax_fee',
        'image',
    ];

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}



