<?php

namespace App\Models\Concerns;

use App\Models\Listing;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait HasListings
{
  private ?Listing $cheapestListingCache = null;
  private bool $cheapestListingResolved = false;

  public function listings(): HasMany
  {
    return $this->hasMany(Listing::class, 'product_code', 'product_code')
      ->where('component_type', $this->getTable());
  }

  // cheapest non-out-of-stock listing, falling back to any listing if none are available
  // memoized per instance since price/stock_status/stock_quantity/url all call this.
  // reuses the eager-loaded `listings` relation when present, to avoid a query per component.
  public function cheapestListing(): ?Listing
  {
    if (! $this->cheapestListingResolved) {
      if ($this->relationLoaded('listings')) {
        $this->cheapestListingCache = $this->listings
          ->whereIn('stock_status', ['in_stock', 'orderable'])
          ->sortBy('price')
          ->first()
          ?? $this->listings->sortBy('price')->first();
      } else {
        $this->cheapestListingCache = $this->listings()
          ->whereIn('stock_status', ['in_stock', 'orderable'])
          ->orderBy('price')
          ->first()
          ?? $this->listings()->orderBy('price')->first();
      }
      $this->cheapestListingResolved = true;
    }

    return $this->cheapestListingCache;
  }

  // virtual attributes kept for backwards compatibility with code that
  // expects price/stock_status/stock_quantity/url directly on the component
  public function getPriceAttribute()
  {
    return $this->cheapestListing()?->price;
  }

  public function getStockStatusAttribute()
  {
    return $this->cheapestListing()?->stock_status ?? 'out_of_stock';
  }

  public function getStockQuantityAttribute()
  {
    return $this->cheapestListing()?->stock_quantity;
  }

  public function getUrlAttribute()
  {
    return $this->cheapestListing()?->url;
  }
}
