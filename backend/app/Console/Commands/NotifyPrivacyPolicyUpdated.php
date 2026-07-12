<?php

namespace App\Console\Commands;

use App\Mail\PrivacyPolicyUpdatedMail;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class NotifyPrivacyPolicyUpdated extends Command
{
  protected $signature = 'policy:notify-update {--force : Skip the confirmation prompt}';

  protected $description = 'Email all users that the privacy policy has changed substantively';

  public function handle(): int
  {
    $total = User::count();

    if ($total === 0) {
      $this->info('No users to notify.');
      return self::SUCCESS;
    }

    if (! $this->option('force') && ! $this->confirm("This will email all {$total} users that the privacy policy has changed. Continue?")) {
      $this->info('Cancelled.');
      return self::SUCCESS;
    }

    $url = config('app.frontend_url') . '/privacy';

    $sent = 0;
    User::query()->chunkById(100, function ($users) use ($url, &$sent) {
      foreach ($users as $user) {
        Mail::to($user->email)->queue(new PrivacyPolicyUpdatedMail($url));
        $sent++;
      }
    });

    $this->info("Queued privacy policy update emails for {$sent} users.");

    return self::SUCCESS;
  }
}
