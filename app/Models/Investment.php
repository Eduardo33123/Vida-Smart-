<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Investment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'provider_id',
        'quantity_added',
        'unit_cost',
        'total_cost',
        'notes',
        'investment_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'quantity_added' => 'integer',
        'unit_cost' => 'decimal:2',
        'total_cost' => 'decimal:2',
        'investment_date' => 'date',
    ];

    /**
     * Get the product that belongs to this investment
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the provider that belongs to this investment
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

    /**
     * Get formatted total cost with currency
     */
    public function getFormattedTotalCostAttribute(): string
    {
        if ($this->product && $this->product->currency) {
            return $this->product->currency->symbol . ' ' . number_format($this->total_cost, 2);
        }
        return '$' . number_format($this->total_cost, 2);
    }

    /**
     * Get formatted unit cost with currency
     */
    public function getFormattedUnitCostAttribute(): string
    {
        if ($this->product && $this->product->currency) {
            return $this->product->currency->symbol . ' ' . number_format($this->unit_cost, 2);
        }
        return '$' . number_format($this->unit_cost, 2);
    }
}
