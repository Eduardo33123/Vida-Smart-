<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'category_id',
        'currency_id',
        'provider_id',
        'price',
        'purchase_price',
        'stock',
        'version',
        'version_purchase_price',
        'description',
        'image',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'purchase_price' => 'decimal:2',
        'version_purchase_price' => 'decimal:2',
        'stock' => 'integer',
        'version' => 'integer',
        'category_id' => 'integer',
        'currency_id' => 'integer',
        'provider_id' => 'integer',
    ];

    /**
     * Get the category that belongs to this product
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the currency that belongs to this product
     */
    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    /**
     * Get the provider that belongs to this product
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

    /**
     * Get the version stocks for this product
     */
    public function versionStocks(): HasMany
    {
        return $this->hasMany(ProductVersionStock::class);
    }

    /**
     * Get the category name for this product
     */
    public function getCategoryNameAttribute()
    {
        return $this->category ? $this->category->nombre : 'Sin categoría';
    }

    /**
     * Get the formatted price with currency
     */
    public function getFormattedPriceAttribute()
    {
        $currency = $this->currency;
        if ($currency) {
            return $currency->symbol . ' ' . number_format($this->price, 2);
        }
        return '$' . number_format($this->price, 2);
    }

    /**
     * Get the formatted purchase price with currency
     */
    public function getFormattedPurchasePriceAttribute()
    {
        if (!$this->purchase_price) {
            return 'No especificado';
        }

        $currency = $this->currency;
        if ($currency) {
            return $currency->symbol . ' ' . number_format($this->purchase_price, 2);
        }
        return '$' . number_format($this->purchase_price, 2);
    }

    /**
     * Get the stock status for this product
     */
    public function getStockStatusAttribute()
    {
        if ($this->stock === 0) {
            return 'Sin Stock';
        } elseif ($this->stock <= 5) {
            return 'Stock Bajo';
        } else {
            return 'En Stock';
        }
    }

    /**
     * Check if product is in stock
     */
    public function isInStock()
    {
        return $this->stock > 0;
    }

    /**
     * Check if product has low stock
     */
    public function hasLowStock()
    {
        return $this->stock > 0 && $this->stock <= 5;
    }
}
