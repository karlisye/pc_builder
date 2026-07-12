<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PrivacyPolicyUpdatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $url)
    {
    }

    public function build(): self
    {
        // Bilingual body — we don't store a per-user locale preference, so
        // this deliberately doesn't rely on app()->getLocale() (which would
        // just be the queue worker's default locale, not the recipient's).
        return $this->subject('Izmaiņas privātuma politikā / Privacy Policy Update')
            ->view('emails.privacy-policy-updated')
            ->with(['url' => $this->url]);
    }
}
