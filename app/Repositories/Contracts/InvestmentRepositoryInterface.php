<?php

namespace App\Repositories\Contracts;

use App\Models\Investment;
use Illuminate\Database\Eloquent\Collection;

interface InvestmentRepositoryInterface
{
    /**
     * Get all investments
     */
    public function getAll(): Collection;

    /**
     * Get investment by ID
     */
    public function getById(int $id): ?Investment;

    /**
     * Create a new investment
     */
    public function create(array $data): Investment;

    /**
     * Update an investment
     */
    public function update(int $id, array $data): bool;

    /**
     * Delete an investment
     */
    public function delete(int $id): bool;

    /**
     * Get investments by product ID
     */
    public function getByProductId(int $productId): Collection;

    /**
     * Get investments by provider ID
     */
    public function getByProviderId(int $providerId): Collection;

    /**
     * Get investments within date range
     */
    public function getByDateRange(string $startDate, string $endDate): Collection;

    /**
     * Get total investment amount
     */
    public function getTotalInvestmentAmount(): float;

    /**
     * Get investment statistics
     */
    public function getInvestmentStatistics(): array;
}
