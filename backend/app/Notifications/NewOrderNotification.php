<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;
use App\Models\Order;

class NewOrderNotification extends Notification
{
    use Queueable;

    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function via($notifiable)
    {
        return ['database']; // تخزين في قاعدة البيانات فقط
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'طلب جديد',
            'message' => "تم إنشاء طلب جديد من المستخدم {$this->order->user->name}.",
            'status' => 'قيد المراجعة',
            'order_id' => $this->order->id,
        ];
    }
}
