<?php

namespace App\Repositories\Contracts;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

interface ProductRepositoryInterface
{
    /**
     * Get all products
     */
    public function getAll(): Collection;

    /**
     * Find product by ID
     */
    public function findById(int $id): ?Product;

    /**
     * Create a new product
     */
    public function create(array $data): Product;

    /**
     * Update product by ID
     */
    public function update(int $id, array $data): bool;

    /**
     * Delete product by ID
     */
    public function delete(int $id): bool;


    /**
     * Get products with low stock
     */
    public function getLowStockProducts(int $threshold = 5): Collection;

    /**
     * Get products out of stock
     */
    public function getOutOfStockProducts(): Collection;
}
