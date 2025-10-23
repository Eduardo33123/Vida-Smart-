<?php

namespace App\Services\Contracts;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

interface ProductServiceInterface
{
    /**
     * Get all products
     */
    public function getAllProducts(): Collection;

    /**
     * Get product by ID
     */
    public function getProductById(int $id): ?Product;

    /**
     * Create a new product
     */
    public function createProduct(array $data): Product;

    /**
     * Update product
     */
    public function updateProduct(int $id, array $data): Product;

    /**
     * Delete product
     */
    public function deleteProduct(int $id): bool;

    /**
     * Validate product data
     */
    public function validateProductData(array $data, ?int $excludeId = null): array;

    /**
     * Get inventory statistics
     */
    public function getInventoryStatistics(): array;

}
