<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DeleteAccountMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $url)
    {
    }

    public function build(): self
    {
        return $this->subject(__('mail.delete_account_subject'))
            ->view('emails.delete-account')
            ->with(['url' => $this->url]);
    }
}
