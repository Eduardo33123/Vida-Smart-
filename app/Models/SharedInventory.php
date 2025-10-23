<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SharedInventory extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'shared_inventory';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'user_id',
        'quantity',
        'purchase_price',
        'version',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'quantity' => 'integer',
        'purchase_price' => 'decimal:2',
        'version' => 'integer',
    ];

    /**
     * Get the product that belongs to this shared inventory
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the user that owns this shared inventory
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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

    /**
     * Get total value of this inventory item
     */
    public function getTotalValueAttribute(): float
    {
        return $this->quantity * ($this->purchase_price ?? 0);
    }

    /**
     * Get formatted total value attribute
     */
    public function getFormattedTotalValueAttribute(): string
    {
        return '$' . number_format($this->total_value, 2);
    }
}
