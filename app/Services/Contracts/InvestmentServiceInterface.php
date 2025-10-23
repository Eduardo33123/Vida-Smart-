<?php

namespace App\Services\Contracts;

use App\Models\Investment;
use Illuminate\Database\Eloquent\Collection;

interface InvestmentServiceInterface
{
    /**
     * Get all investments
     */
    public function getAllInvestments(): Collection;

    /**
     * Get investment by ID
     */
    public function getInvestmentById(int $id): ?Investment;

    /**
     * Create a new investment
     */
    public function createInvestment(array $data): Investment;

    /**
     * Update an investment
     */
    public function updateInvestment(int $id, array $data): bool;

    /**
     * Delete an investment
     */
    public function deleteInvestment(int $id): bool;

    /**
     * Get investments by product ID
     */
    public function getInvestmentsByProductId(int $productId): Collection;

    /**
     * Get investment statistics
     */
    public function getInvestmentStatistics(): array;

    /**
     * Validate investment data
     */
    public function validateInvestmentData(array $data, ?int $excludeId = null): array;

    /**
     * Process investment and update product stock
     */
    public function processInvestment(array $data): Investment;
}
