<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewBookingNotification extends Notification
{
    use Queueable;

    public $booking;

    public function __construct($booking)
    {
        $this->booking = $booking;
    }

    // نستخدم قاعدة البيانات فقط
    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'طلب حجز جديد',
            'message' => 'تم إنشاء حجز جديد من المستخدم ' . $this->booking->user->name,
            'booking_id' => $this->booking->id,
            'status' => $this->booking->status,
        ];
    }
}
