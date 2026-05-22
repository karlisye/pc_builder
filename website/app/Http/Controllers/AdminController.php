<?php

namespace App\Http\Controllers;

use App\Models\ScrapeResult;
use App\Models\ScrapeSession;
use GuzzleHttp\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
    return response()->stream(function () use ($request) {
      $client = new Client();
      $response = $client->post('http://scraper:5000/scrape', [
        'json' => [
          'category' => $request->input('category'),
          'max_errors' => $request->input('max_errors'),
          'page_delay' => $request->input('page_delay'),
        ],
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

  public function store(Request $request): JsonResponse
  {
    $validated = $request->validate([
      'started_at' => 'required|date',
      'finished_at' => 'required|date|after_or_equal:started_at',
      'status' => 'required|in:success,failed',

      'duration' => 'required|integer|min:0',

      'results' => 'required|array|min:1',

      'results.*.category' => 'required|string',
      'results.*.total' => 'required|integer|min:0',
      'results.*.inserted' => 'required|integer|min:0',
      'results.*.skipped' => 'required|integer|min:0',
    ]);

    // run multiple database operations as one. if one fails - nothing is saved
    return DB::transaction(function () use ($validated) {
      $session = ScrapeSession::create([
        'started_at' => $validated['started_at'],
        'finished_at' => $validated['finished_at'],
        'status' => $validated['status'],
        'duration' => $validated['duration'],
      ]);

      foreach ($validated['results'] as $result) {
        ScrapeResult::create([
          'session_id' => $session->id,
          'category' => $result['category'],
          'total' => $result['total'],
          'inserted' => $result['inserted'],
          'skipped' => $result['skipped'],
        ]);
      }

      return response()->json([
        'message' => 'Scrape session stored successfully',
      ]);
    });
  }

  public function fetchHistory(Request $request): JsonResponse
  {
    $history = ScrapeSession::query()->with('results')->paginate(10);
    return response()->json(['historyData' => $history]);
  }
}
