<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class ComponentListingJoin
{
  // joins an aggregated view of a component's listings so price/stock can be
  // filtered or sorted on at the SQL level. Multiple listings per product
  // (once more sources are added) are collapsed: cheapest non-out-of-stock
  // price wins, and stock status is the best available across all sources.
  // Exposes listing_agg.listing_price / listing_agg.listing_stock_status /
  // listing_agg.listing_stock_quantity columns on the returned query.
  public static function apply(Builder $query): Builder
  {
    $table = $query->getModel()->getTable();

    $listingAgg = DB::table('listings')
      ->select('product_code')
      ->selectRaw('MIN(CASE WHEN stock_status != "out_of_stock" THEN price END) as listing_price')
      ->selectRaw("CASE
          WHEN SUM(stock_status = 'in_stock') > 0 THEN 'in_stock'
          WHEN SUM(stock_status = 'orderable') > 0 THEN 'orderable'
          ELSE 'out_of_stock'
        END as listing_stock_status")
      ->selectRaw('MAX(stock_quantity) as listing_stock_quantity')
      ->where('component_type', $table)
      ->groupBy('product_code');

    return $query
      ->select("{$table}.*")
      ->leftJoinSub($listingAgg, 'listing_agg', function ($join) use ($table) {
        $join->on('listing_agg.product_code', '=', "{$table}.product_code");
      });
  }
}
