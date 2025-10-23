<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductVersionStock;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ProductVersionStockService
{
    /**
     * Get version stocks for a product
     */
    public function getVersionStocks(int $productId): Collection
    {
        return ProductVersionStock::where('product_id', $productId)
            ->orderBy('version', 'asc')
            ->get();
    }

    /**
     * Get stock for a specific version
     */
    public function getVersionStock(int $productId, int $version): ?ProductVersionStock
    {
        return ProductVersionStock::where('product_id', $productId)
            ->where('version', $version)
            ->first();
    }

    /**
     * Add stock to a specific version
     */
    public function addStockToVersion(int $productId, int $version, int $quantity, ?float $purchasePrice = null): ProductVersionStock
    {
        return DB::transaction(function () use ($productId, $version, $quantity, $purchasePrice) {
            $versionStock = ProductVersionStock::where('product_id', $productId)
                ->where('version', $version)
                ->first();

            if ($versionStock) {
                // Update existing version
                $versionStock->increment('stock_quantity', $quantity);
                if ($purchasePrice !== null) {
                    $versionStock->update(['purchase_price' => $purchasePrice]);
                }
            } else {
                // Create new version
                $versionStock = ProductVersionStock::create([
                    'product_id' => $productId,
                    'version' => $version,
                    'stock_quantity' => $quantity,
                    'purchase_price' => $purchasePrice,
                ]);
            }

            // Update main product stock
            $product = Product::find($productId);
            if ($product) {
                $product->increment('stock', $quantity);
            }

            return $versionStock;
        });
    }

    /**
     * Remove stock from a specific version
     */
    public function removeStockFromVersion(int $productId, int $version, int $quantity): bool
    {
        return DB::transaction(function () use ($productId, $version, $quantity) {
            $versionStock = ProductVersionStock::where('product_id', $productId)
                ->where('version', $version)
                ->first();

            if (!$versionStock || $versionStock->stock_quantity < $quantity) {
                return false;
            }

            $versionStock->decrement('stock_quantity', $quantity);

            // Update main product stock
            $product = Product::find($productId);
            if ($product) {
                $product->decrement('stock', $quantity);
            }

            return true;
        });
    }

    /**
     * Get the version with available stock (FIFO - First In, First Out)
     */
    public function getAvailableVersionForSale(int $productId, int $quantity): ?int
    {
        $versionStock = ProductVersionStock::where('product_id', $productId)
            ->where('stock_quantity', '>=', $quantity)
            ->orderBy('version', 'asc')
            ->first();

        return $versionStock ? $versionStock->version : null;
    }

    /**
     * Get all versions with stock for a product
     */
    public function getVersionsWithStock(int $productId): Collection
    {
        return ProductVersionStock::where('product_id', $productId)
            ->where('stock_quantity', '>', 0)
            ->orderBy('version', 'asc')
            ->get();
    }

    /**
     * Initialize version stock for existing products
     */
    public function initializeVersionStockForProduct(int $productId): void
    {
        $product = Product::find($productId);
        if (!$product) {
            return;
        }

        // Check if version stock already exists
        $existingVersionStock = ProductVersionStock::where('product_id', $productId)->exists();

        if (!$existingVersionStock && $product->stock > 0) {
            // Create initial version stock
            ProductVersionStock::create([
                'product_id' => $productId,
                'version' => $product->version ?? 1,
                'stock_quantity' => $product->stock,
                'purchase_price' => $product->purchase_price,
            ]);
        }
    }
}