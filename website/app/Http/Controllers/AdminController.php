<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Response as InertiaResponse;

class AdminController extends Controller
{
  public function index(Request $request): InertiaResponse
  {
    return Inertia::render('Admin/Dashboard');
  }

  public function scrape(Request $request): StreamedResponse
  {
    $category = $request->input('category');

    return response()->stream(function () use ($category) {
      $client = new Client();
      $response = $client->post('http://scraper:5000/scrape', [
        'json' => ['category' => $category],
        'stream' => true,
        // timeout for a full scrape ~30min
        'timeout' => 1800,
      ]);

      $body = $response->getBody();
      while (!$body->eof()) {
        echo $body->read(1024);
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
