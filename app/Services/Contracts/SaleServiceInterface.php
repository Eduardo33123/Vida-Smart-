<?php

namespace App\Services\Contracts;

use App\Models\Sale;
use Illuminate\Database\Eloquent\Collection;

interface SaleServiceInterface
{
    /**
     * Get all sales
     */
    public function getAllSales(): Collection;

    /**
     * Get sales by seller
     */
    public function getSalesBySeller(int $sellerId): Collection;

    /**
     * Get sales by product and version
     */
    public function getSalesByProductAndVersion(int $productId, int $version): Collection;

    /**
     * Get sales statistics
     */
    public function getSalesStatistics(): array;

    /**
     * Process a new sale and update inventory
     */
    public function processSale(array $data): Sale;

    /**
     * Validate sale data
     */
    public function validateSaleData(array $data): array;

    /**
     * Get available products for sale
     */
    public function getAvailableProducts(): Collection;

    /**
     * Update a sale and adjust inventory
     */
    public function updateSale(int $saleId, array $data): Sale;

    /**
     * Delete a sale and restore inventory
     */
    public function deleteSale(int $saleId): bool;

    /**
     * Get a sale by ID
     */
    public function getSaleById(int $saleId): ?Sale;
}