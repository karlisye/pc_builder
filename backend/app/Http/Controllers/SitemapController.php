<?php

namespace App\Http\Controllers;

use App\Services\CompatibilityService;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SitemapController extends Controller
{
  private readonly string $site;

  public function __construct()
  {
    $this->site = rtrim(config('app.frontend_url'), '/');
  }

  private const STATIC_PATHS = [
    '' => '1.0',
    '/builder' => '0.9',
    '/guide' => '0.5',
    '/guide/auto' => '0.5',
    '/guide/saved' => '0.5',
  ];

  public function __invoke(): Response
  {
    $xml = Cache::remember('sitemap.xml', now()->addHours(12), function () {
      $urls = [];

      foreach (self::STATIC_PATHS as $path => $priority) {
        $urls[] = $this->entry($path, null, $priority);
      }

      foreach (array_keys(CompatibilityService::VALID_TYPES) as $type) {
        $urls[] = $this->entry("/builder/components/{$type}", null, '0.7');
      }

      foreach (CompatibilityService::VALID_TYPES as $type => $modelClass) {
        $modelClass::query()
          ->whereHas('listings', fn($q) => $q->whereIn('stock_status', ['in_stock', 'orderable']))
          ->select('product_code')
          ->withMax('listings', 'scraped_at')
          ->chunk(500, function ($rows) use (&$urls, $type) {
            foreach ($rows as $row) {
              $lastmod = $row->listings_max_scraped_at
                ? \Illuminate\Support\Carbon::parse($row->listings_max_scraped_at)->toAtomString()
                : null;
              $urls[] = $this->entry(
                "/builder/components/{$type}/" . rawurlencode($row->product_code),
                $lastmod,
                '0.6',
              );
            }
          });
      }

      return $this->render($urls);
    });

    return response($xml, 200, ['Content-Type' => 'application/xml']);
  }

  private function entry(string $path, ?string $lastmod, string $priority): string
  {
    $lv = $this->site . $path;
    $en = $this->site . '/en' . $path;

    $alternates =
      '<xhtml:link rel="alternate" hreflang="lv" href="' . e($lv) . '"/>'
      . '<xhtml:link rel="alternate" hreflang="en" href="' . e($en) . '"/>'
      . '<xhtml:link rel="alternate" hreflang="x-default" href="' . e($lv) . '"/>';

    $out = '';
    foreach ([$lv, $en] as $loc) {
      $out .= '<url><loc>' . e($loc) . '</loc>'
        . ($lastmod ? '<lastmod>' . $lastmod . '</lastmod>' : '')
        . $alternates
        . '<priority>' . $priority . '</priority></url>';
    }

    return $out;
  }

  private function render(array $urls): string
  {
    return '<?xml version="1.0" encoding="UTF-8"?>'
      . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
      . implode('', $urls)
      . '</urlset>';
  }
}
