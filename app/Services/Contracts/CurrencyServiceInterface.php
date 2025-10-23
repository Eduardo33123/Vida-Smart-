<?php

namespace App\Services\Contracts;

use App\Models\Currency;
use Illuminate\Database\Eloquent\Collection;

interface CurrencyServiceInterface
{
    /**
     * Get all currencies
     */
    public function getAllCurrencies(): Collection;

    /**
     * Get only active currencies
     */
    public function getActiveCurrencies(): Collection;

    /**
     * Get currency by ID
     */
    public function getCurrencyById(int $id): ?Currency;

    /**
     * Create a new currency
     */
    public function createCurrency(array $data): Currency;

    /**
     * Update currency
     */
    public function updateCurrency(int $id, array $data): Currency;

    /**
     * Delete currency
     */
    public function deleteCurrency(int $id): bool;

    /**
     * Validate currency data
     */
    public function validateCurrencyData(array $data, ?int $excludeId = null): array;
}
