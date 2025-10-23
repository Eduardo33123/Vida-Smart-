<?php

namespace App\Repositories\Contracts;

use App\Models\Sale;
use Illuminate\Database\Eloquent\Collection;

interface SaleRepositoryInterface
{
    /**
     * Get all sales
     */
    public function getAll(): Collection;

    /**
     * Get sales by seller
     */
    public function getBySeller(int $sellerId): Collection;

    /**
     * Get sales by date range
     */
    public function getByDateRange(string $startDate, string $endDate): Collection;

    /**
     * Get sales statistics
     */
    public function getStatistics(): array;

    /**
     * Create a new sale
     */
    public function create(array $data): Sale;

    /**
     * Find a sale by ID
     */
    public function findById(int $id): ?Sale;

    /**
     * Update a sale
     */
    public function update(int $id, array $data): bool;

    /**
     * Delete a sale
     */
    public function delete(int $id): bool;
}
