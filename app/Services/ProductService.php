<?php

namespace App\Services;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Services\Contracts\ProductServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ProductService implements ProductServiceInterface
{
    protected ProductRepositoryInterface $productRepository;

    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    /**
     * Get all products
     */
    public function getAllProducts(): Collection
    {
        return $this->productRepository->getAll();
    }

    /**
     * Get product by ID
     */
    public function getProductById(int $id): ?Product
    {
        return $this->productRepository->findById($id);
    }

    /**
     * Create a new product
     */
    public function createProduct(array $data): Product
    {
        $validatedData = $this->validateProductData($data);

        return $this->productRepository->create($validatedData);
    }

    /**
     * Update product
     */
    public function updateProduct(int $id, array $data): Product
    {
        $validatedData = $this->validateProductData($data, $id);

        $updated = $this->productRepository->update($id, $validatedData);

        if (!$updated) {
            throw new \Exception('Product not found or could not be updated');
        }

        return $this->productRepository->findById($id);
    }

    /**
     * Delete product
     */
    public function deleteProduct(int $id): bool
    {
        return $this->productRepository->delete($id);
    }

    /**
     * Validate product data
     */
    public function validateProductData(array $data, ?int $excludeId = null): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'category_id' => 'required|integer|exists:categories,id',
            'currency_id' => 'required|integer|exists:currencies,id',
            'provider_id' => 'nullable|integer|exists:providers,id',
            'price' => 'required|numeric|min:0',
            'purchase_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|url',
        ];

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $validator->validated();
    }

    /**
     * Get inventory statistics
     */
    public function getInventoryStatistics(): array
    {
        $allProducts = $this->productRepository->getAll();
        $lowStockProducts = $this->productRepository->getLowStockProducts();
        $outOfStockProducts = $this->productRepository->getOutOfStockProducts();

        return [
            'total_products' => $allProducts->count(),
            'in_stock' => $allProducts->where('stock', '>', 5)->count(),
            'low_stock' => $lowStockProducts->count(),
            'out_of_stock' => $outOfStockProducts->count(),
            'total_value' => $allProducts->sum(function ($product) {
                return $product->price * $product->stock;
            }),
        ];
    }

}