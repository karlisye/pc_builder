<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class VerifyEmailNotification extends VerifyEmail
{
    protected function buildMailMessage($url): MailMessage
    {
        return (new MailMessage)
            ->subject(__('mail.verify_subject'))
            ->greeting(__('mail.verify_greeting'))
            ->line(__('mail.verify_line'))
            ->action(__('mail.verify_action'), $url)
            ->line(__('mail.verify_footer'));
    }
}
