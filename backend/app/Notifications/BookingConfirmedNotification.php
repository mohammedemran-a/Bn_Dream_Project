<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class BookingConfirmedNotification extends Notification
{
    use Queueable;

    public $booking;

    public function __construct($booking)
    {
        $this->booking = $booking;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'تم تأكيد الحجز',
            'message' => 'تم تأكيد الحجز الخاص بك',
            'booking_id' => $this->booking->id,
            'status' => $this->booking->status,
        ];
    }
}
