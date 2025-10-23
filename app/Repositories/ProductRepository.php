<?php

namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ProductRepository implements ProductRepositoryInterface
{
    protected Product $model;

    public function __construct(Product $model)
    {
        $this->model = $model;
    }

    /**
     * Get all products
     */
    public function getAll(): Collection
    {
        return $this->model->all();
    }

    /**
     * Find product by ID
     */
    public function findById(int $id): ?Product
    {
        return $this->model->find($id);
    }

    /**
     * Create a new product
     */
    public function create(array $data): Product
    {
        return $this->model->create($data);
    }

    /**
     * Update product by ID
     */
    public function update(int $id, array $data): bool
    {
        $product = $this->findById($id);

        if (!$product) {
            return false;
        }

        return $product->update($data);
    }

    /**
     * Delete product by ID
     */
    public function delete(int $id): bool
    {
        $product = $this->findById($id);

        if (!$product) {
            return false;
        }

        return $product->delete();
    }


    /**
     * Get products with low stock
     */
    public function getLowStockProducts(int $threshold = 5): Collection
    {
        return $this->model->where('stock', '>', 0)
            ->where('stock', '<=', $threshold)
            ->get();
    }

    /**
     * Get products out of stock
     */
    public function getOutOfStockProducts(): Collection
    {
        return $this->model->where('stock', 0)->get();
    }
}
