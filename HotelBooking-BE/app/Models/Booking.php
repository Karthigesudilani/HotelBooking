<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
        'user_email',
        'check_in',
        'check_out',
        'number_of_nights',
        'number_of_guests',
        'coordination_fee',
        'service_and_tax_fee',
        'total_fee',
        'status',
        'guest_title',
        'guest_name',
        'guest_email',
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}



