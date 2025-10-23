<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVersionStock extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'product_version_stock';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'version',
        'stock_quantity',
        'purchase_price',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'stock_quantity' => 'integer',
        'purchase_price' => 'decimal:2',
        'version' => 'integer',
    ];

    /**
     * Get the product that owns this version stock
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get formatted purchase price attribute
     */
    public function getFormattedPurchasePriceAttribute(): string
    {
        if (!$this->purchase_price) {
            return 'No especificado';
        }
        return '$' . number_format($this->purchase_price, 2);
    }
}