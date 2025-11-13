<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;

class OrderProcessedNotification extends Notification 
{
    use Queueable;

    public $order;
    public $status;

    public function __construct($order, $status)
    {
        $this->order = $order;
        $this->status = $status;
    }

    public function via($notifiable)
    {
        return ['database']; // يخزن الإشعار في قاعدة البيانات فقط
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'تحديث حالة الطلب',
            'message' => "تم تغيير حالة طلبك الى  {$this->status}",
            'order_id' => $this->order->id,
            'status' => $this->status,
        ];
    }
}
