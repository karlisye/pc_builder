<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Process\Process;

class AdminController extends Controller
{
  public function scrape(Request $request): StreamedResponse
  {
    $category = $request->input('category');

    // -T for no TTY to run the command non-interactively
    return response()->stream(function () use ($category) {
      $process = new Process([
        'docker',
        'compose',
        'exec',
        '-T',
        'scraper',
        'python3',
        '-u',
        'main.py',
        $category
      ]);

      // timeout for a full scrape ~30min
      $process->setTimeout(1800);
      $process->start();

      // streaming the result
      foreach ($process as $type => $data) {
        echo $data;
        // sends data from php to web server
        ob_flush();
        // sends data from web server to the browser
        flush();
      }
    }, 200, [
      'Content-Type' => 'text/event-stream',
      'Cache-Control' => 'no-cache',
      'X-Accel-Buffering' => 'no', // needed for nginx
    ]);
  }
}
