<?php

namespace App\Http\Controllers;

use App\Models\Build;
use App\Models\ScrapeResult;
use App\Models\ScrapeSession;
use App\Services\BuilderService;
use GuzzleHttp\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
    $query = ScrapeSession::query()->with('results');

    if ($request->input('sort')) {
      match ($request->input('sort')) {
        'date_desc' => $query->orderByDesc('started_at'),
        'date_asc' => $query->orderBy('started_at'),
        default => $query->orderBy('started_at')
      };
    }

    if ($request->input('date_from')) {
      $query->where('started_at', '>=', $request->date_from);
    }
    if ($request->input('date_to')) {
      $query->where('finished_at', '<=', $request->date_to);
    }

    if ($request->input('status')) {
      $query->where('status', $request->status);
    }

    if ($request->input('categories')) {
      $query->whereHas('results', fn($q) => $q->whereIn('category', $request->input('categories')));
    }

    $history = $query->paginate(10);
    return response()->json(['historyData' => $history]);
  }

  public function populate(Request $request): JsonResponse
  {
    $builds = [
      // budget office
      ['budget' => 350,  'preferences' => ['type' => 'office']],
      ['budget' => 500,  'preferences' => ['type' => 'office']],
      ['budget' => 700,  'preferences' => ['type' => 'office']],

      // mid gaming
      ['budget' => 1000, 'preferences' => ['type' => 'gaming']],
      ['budget' => 1200, 'preferences' => ['type' => 'gaming']],
      ['budget' => 1500, 'preferences' => ['type' => 'gaming']],

      // mid gaming with preferences
      ['budget' => 1000, 'preferences' => ['type' => 'gaming', 'gpu' => 'nvidia']],
      ['budget' => 1000, 'preferences' => ['type' => 'gaming', 'gpu' => 'amd']],
      ['budget' => 1000, 'preferences' => ['type' => 'gaming', 'cpu' => 'amd']],
      ['budget' => 1000, 'preferences' => ['type' => 'gaming', 'cpu' => 'intel']],

      // mid streaming
      ['budget' => 1200, 'preferences' => ['type' => 'streaming']],

      // high gaming
      ['budget' => 2000, 'preferences' => ['type' => 'gaming']],
      ['budget' => 3000, 'preferences' => ['type' => 'gaming']],

      // high rendering
      ['budget' => 2000, 'preferences' => ['type' => 'rendering']],
      ['budget' => 3000, 'preferences' => ['type' => 'rendering']],

      // unlimited
      ['budget' => null, 'preferences' => ['type' => 'gaming']],
      ['budget' => null, 'preferences' => ['type' => 'rendering']],
    ];

    $builder = app(BuilderService::class);
    $slots = Build::componentSlots();
    $results = [];

    foreach ($builds as $config) {
      $result = $builder->generate([], $config['budget'], $config['preferences']);

      if (!$result['success']) {
        $results[] = [
          'config' => $config,
          'success' => false,
          'error' => $result['error'],
        ];
        continue;
      }

      // map component dateks_ids to build foreign keys
      $componentFks = [];
      foreach ($result['build'] as $type => $component) {
        $fkColumn = $slots[$type] ?? null;
        if ($fkColumn) {
          $componentFks[$fkColumn] = $component['dateks_id'];
        }
      }

      $type = $config['preferences']['type'] ?? null;
      $budget = $config['budget'] ? "€{$config['budget']}" : 'Unlimited';

      $build = Build::create([
        'user_id'     => $request->user()->id,
        'name'        => ucfirst($type ?? 'General') . " Build - {$budget}",
        'notes'       => null,
        'type'        => $type,
        'total_price' => $result['total_price'],
        'is_public'   => true,
        ...$componentFks,
      ]);

      $results[] = [
        'config'      => $config,
        'success'     => true,
        'build_id'    => $build->id,
        'total_price' => $result['total_price'],
      ];
    }

    $succeeded = collect($results)->where('success', true)->count();
    $failed = collect($results)->where('success', false)->count();

    return response()->json([
      'succeeded' => $succeeded,
      'failed'    => $failed,
      'results'   => $results,
    ]);
  }
}
