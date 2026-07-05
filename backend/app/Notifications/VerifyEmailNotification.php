<?php

namespace App\Notifications;

use App\Mail\VerifyEmailMail;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class VerifyEmailNotification extends VerifyEmail implements ShouldQueue
{
    use Queueable;

    public function toMail($notifiable): VerifyEmailMail
    {
        return (new VerifyEmailMail($this->verificationUrl($notifiable)))
            ->to($notifiable->getEmailForVerification());
    }
}
