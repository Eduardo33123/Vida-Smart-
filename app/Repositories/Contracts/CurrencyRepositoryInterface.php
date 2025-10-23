<?php

namespace App\Repositories\Contracts;

use App\Models\Currency;
use Illuminate\Database\Eloquent\Collection;

interface CurrencyRepositoryInterface
{
    /**
     * Get all currencies
     */
    public function getAll(): Collection;

    /**
     * Get only active currencies
     */
    public function getActive(): Collection;

    /**
     * Find currency by ID
     */
    public function findById(int $id): ?Currency;

    /**
     * Find currency by code
     */
    public function findByCode(string $code): ?Currency;

    /**
     * Create a new currency
     */
    public function create(array $data): Currency;

    /**
     * Update currency by ID
     */
    public function update(int $id, array $data): bool;

    /**
     * Delete currency by ID
     */
    public function delete(int $id): bool;
}
