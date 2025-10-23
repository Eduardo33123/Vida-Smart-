<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sale extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'product_version',
        'quantity_sold',
        'client_name',
        'color',
        'seller_id',
        'sale_price',
        'commission',
        'additional_expenses',
        'expenses_description',
        'total_amount',
        'notes',
        'sale_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'sale_price' => 'decimal:2',
        'commission' => 'decimal:2',
        'additional_expenses' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'sale_date' => 'date',
    ];

    /**
     * Get the product that was sold.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the seller (user) who made the sale.
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Get formatted sale price attribute.
     */
    public function getFormattedSalePriceAttribute(): string
    {
        return '$' . number_format($this->sale_price, 2);
    }

    /**
     * Get formatted commission attribute.
     */
    public function getFormattedCommissionAttribute(): string
    {
        return '$' . number_format($this->commission, 2);
    }

    /**
     * Get formatted additional expenses attribute.
     */
    public function getFormattedAdditionalExpensesAttribute(): string
    {
        return '$' . number_format($this->additional_expenses, 2);
    }

    /**
     * Get formatted total amount attribute.
     */
    public function getFormattedTotalAmountAttribute(): string
    {
        return '$' . number_format($this->total_amount, 2);
    }
}
