<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $url)
    {
    }

    public function build(): self
    {
        return $this->subject(__('mail.reset_password_subject'))
            ->view('emails.reset-password')
            ->with(['url' => $this->url]);
    }
}
