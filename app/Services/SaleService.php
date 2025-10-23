<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Sale;
use App\Repositories\Contracts\SaleRepositoryInterface;
use App\Services\Contracts\SaleServiceInterface;
use App\Services\ProductVersionStockService;
use App\Services\SharedInventoryService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class SaleService implements SaleServiceInterface
{
    public function __construct(
        private SaleRepositoryInterface $saleRepository,
        private ProductVersionStockService $versionStockService,
        private SharedInventoryService $sharedInventoryService
    ) {}

    /**
     * Get all sales
     */
    public function getAllSales(): Collection
    {
        try {
            return $this->saleRepository->getAll();
        } catch (\Exception $e) {
            return collect([]);
        }
    }

    /**
     * Get sales by seller
     */
    public function getSalesBySeller(int $sellerId): Collection
    {
        return $this->saleRepository->getBySeller($sellerId);
    }

    /**
     * Get sales by product
     */
    public function getSalesByProduct(int $productId): Collection
    {
        try {
            return Sale::with(['product', 'seller'])
                ->where('product_id', $productId)
                ->orderBy('created_at', 'desc')
                ->get();
        } catch (\Exception $e) {
            return collect([]);
        }
    }

    /**
     * Get sales by product and version
     */
    public function getSalesByProductAndVersion(int $productId, int $version): Collection
    {
        try {
            return Sale::with(['product', 'seller'])
                ->where('product_id', $productId)
                ->where('product_version', $version)
                ->orderBy('created_at', 'desc')
                ->get();
        } catch (\Exception $e) {
            return collect([]);
        }
    }

    /**
     * Get sales statistics by product
     */
    public function getSalesStatisticsByProduct(int $productId): array
    {
        try {
            $sales = Sale::where('product_id', $productId);

            $totalSales = $sales->count();
            $totalRevenue = $sales->sum('total_amount');
            $totalCommission = $sales->sum('commission');
            $totalAdditionalExpenses = $sales->sum('additional_expenses');
            $totalQuantity = $sales->sum('quantity_sold');

            $todaySales = $sales->whereDate('sale_date', today())->count();
            $todayRevenue = $sales->whereDate('sale_date', today())->sum('total_amount');

            $thisMonthSales = $sales->whereMonth('sale_date', now()->month)
                ->whereYear('sale_date', now()->year)
                ->count();
            $thisMonthRevenue = $sales->whereMonth('sale_date', now()->month)
                ->whereYear('sale_date', now()->year)
                ->sum('total_amount');

            return [
                'total_sales' => $totalSales,
                'total_revenue' => $totalRevenue,
                'total_commission' => $totalCommission,
                'total_additional_expenses' => $totalAdditionalExpenses,
                'total_quantity' => $totalQuantity,
                'today_sales' => $todaySales,
                'today_revenue' => $todayRevenue,
                'this_month_sales' => $thisMonthSales,
                'this_month_revenue' => $thisMonthRevenue,
            ];
        } catch (\Exception $e) {
            return [
                'total_sales' => 0,
                'total_revenue' => 0,
                'total_commission' => 0,
                'total_additional_expenses' => 0,
                'total_quantity' => 0,
                'today_sales' => 0,
                'today_revenue' => 0,
                'this_month_sales' => 0,
                'this_month_revenue' => 0,
            ];
        }
    }

    /**
     * Get product by ID
     */
    public function getProductById(int $productId): ?Product
    {
        try {
            return Product::find($productId);
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get sales statistics
     */
    public function getSalesStatistics(): array
    {
        return $this->saleRepository->getStatistics();
    }

    /**
     * Process a new sale and update inventory
     */
    public function processSale(array $data): Sale
    {
        return DB::transaction(function () use ($data) {
            // Log the incoming data for debugging
            Log::info('Sale data received:', $data);

            // Validate the sale data
            try {
                $validatedData = $this->validateSaleData($data);
                Log::info('Sale data validated successfully:', $validatedData);
            } catch (\Exception $e) {
                Log::error('Sale validation failed:', ['error' => $e->getMessage(), 'data' => $data]);
                throw $e;
            }

            // Check if product has enough stock
            $product = Product::find($validatedData['product_id']);
            if (!$product) {
                throw new \Exception('Producto no encontrado');
            }

            if ($product->stock < $validatedData['quantity_sold']) {
                throw new \Exception('Stock insuficiente. Stock disponible: ' . $product->stock);
            }

            // Initialize version stock if needed
            $this->versionStockService->initializeVersionStockForProduct($product->id);

            // Determine which version to sell from
            if (!isset($validatedData['product_version']) || $validatedData['product_version'] === null) {
                // Use FIFO (First In, First Out) - sell from oldest version first
                $availableVersion = $this->versionStockService->getAvailableVersionForSale($product->id, $validatedData['quantity_sold']);
                if (!$availableVersion) {
                    throw new \Exception('No hay suficiente stock en ninguna versión disponible');
                }
                $validatedData['product_version'] = $availableVersion;
            } else {
                // Check if the specified version has enough stock
                $versionStock = $this->versionStockService->getVersionStock($product->id, $validatedData['product_version']);
                if (!$versionStock || $versionStock->stock_quantity < $validatedData['quantity_sold']) {
                    throw new \Exception('Stock insuficiente en la versión ' . $validatedData['product_version']);
                }
            }

            // Calculate total amount (including additional expenses)
            $validatedData['total_amount'] = ($validatedData['quantity_sold'] * $validatedData['sale_price']) + ($validatedData['additional_expenses'] ?? 0);

            // Create the sale
            $sale = $this->saleRepository->create($validatedData);

            // Update version stock and main product stock
            $this->versionStockService->removeStockFromVersion(
                $product->id,
                $validatedData['product_version'],
                $validatedData['quantity_sold']
            );

            // Update shared inventory for the seller
            $sellerId = $validatedData['seller_id'];
            $success = $this->sharedInventoryService->removeFromUserInventory(
                $sellerId,
                $product->id,
                $validatedData['quantity_sold'],
                $validatedData['product_version']
            );

            if (!$success) {
                Log::warning('No se pudo actualizar el inventario compartido para el vendedor', [
                    'seller_id' => $sellerId,
                    'product_id' => $product->id,
                    'quantity' => $validatedData['quantity_sold'],
                    'version' => $validatedData['product_version']
                ]);
                // No lanzamos excepción aquí porque la venta ya se registró correctamente
                // Solo logueamos la advertencia
            } else {
                Log::info('Inventario compartido actualizado exitosamente', [
                    'seller_id' => $sellerId,
                    'product_id' => $product->id,
                    'quantity_removed' => $validatedData['quantity_sold'],
                    'version' => $validatedData['product_version']
                ]);
            }

            return $sale;
        });
    }

    /**
     * Validate sale data
     */
    public function validateSaleData(array $data): array
    {
        // Clean up empty strings to 0 for commission (cannot be null)
        if (isset($data['commission']) && ($data['commission'] === '' || $data['commission'] === null)) {
            $data['commission'] = 0;
        }
        if (isset($data['color']) && $data['color'] === '') {
            $data['color'] = null;
        }
        if (isset($data['notes']) && $data['notes'] === '') {
            $data['notes'] = null;
        }
        if (isset($data['additional_expenses']) && ($data['additional_expenses'] === '' || $data['additional_expenses'] === null)) {
            $data['additional_expenses'] = 0;
        }
        if (isset($data['expenses_description']) && ($data['expenses_description'] === '' || $data['expenses_description'] === null)) {
            $data['expenses_description'] = null;
        }

        $rules = [
            'product_id' => 'required|integer|exists:products,id',
            'product_version' => 'nullable|integer|min:1',
            'quantity_sold' => 'required|integer|min:1',
            'client_name' => 'required|string|max:255',
            'color' => 'nullable|string|max:100',
            'seller_id' => 'required|integer|exists:users,id',
            'sale_price' => 'required|numeric|min:0',
            'commission' => 'required|numeric|min:0',
            'additional_expenses' => 'nullable|numeric|min:0',
            'expenses_description' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:1000',
            'sale_date' => 'required|date',
        ];

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $validator->validated();
    }

    /**
     * Get available products for sale (products with stock > 0)
     */
    public function getAvailableProducts(): Collection
    {
        try {
            return Product::with(['category', 'currency', 'provider'])
                ->where('stock', '>', 0)
                ->orderBy('name')
                ->get();
        } catch (\Exception $e) {
            // Si hay error con las relaciones, devolver productos sin relaciones
            return Product::where('stock', '>', 0)
                ->orderBy('name')
                ->get();
        }
    }

    /**
     * Update a sale and adjust inventory
     */
    public function updateSale(int $saleId, array $data): Sale
    {
        $sale = $this->saleRepository->findById($saleId);

        if (!$sale) {
            throw new \Exception('Venta no encontrada');
        }

        // Validar datos
        $this->validateSaleData($data);

        return DB::transaction(function () use ($sale, $data) {
            $oldQuantity = $sale->quantity_sold;
            $newQuantity = $data['quantity_sold'];

            // Calcular diferencia en stock
            $quantityDifference = $newQuantity - $oldQuantity;

            // Actualizar stock del producto
            $product = Product::findOrFail($data['product_id']);
            $product->stock -= $quantityDifference;

            if ($product->stock < 0) {
                throw new \Exception('No hay suficiente stock disponible');
            }

            $product->save();

            // Calcular el total actualizado (incluyendo gastos adicionales)
            $totalAmount = ($data['quantity_sold'] * $data['sale_price']) + ($data['additional_expenses'] ?? 0);

            // Actualizar la venta
            $sale->update([
                'product_id' => $data['product_id'],
                'quantity_sold' => $data['quantity_sold'],
                'client_name' => $data['client_name'],
                'color' => $data['color'] ?? null,
                'seller_id' => $data['seller_id'],
                'sale_price' => $data['sale_price'],
                'commission' => $data['commission'] ?? null,
                'additional_expenses' => $data['additional_expenses'] ?? 0,
                'expenses_description' => $data['expenses_description'] ?? null,
                'total_amount' => $totalAmount,
                'notes' => $data['notes'] ?? null,
                'sale_date' => $data['sale_date'],
            ]);

            return $sale->fresh(['product', 'seller']);
        });
    }

    /**
     * Delete a sale and restore inventory
     */
    public function deleteSale(int $saleId): bool
    {
        $sale = $this->saleRepository->findById($saleId);

        if (!$sale) {
            throw new \Exception('Venta no encontrada');
        }

        return DB::transaction(function () use ($sale) {
            // Restaurar stock del producto
            $product = $sale->product;
            $product->stock += $sale->quantity_sold;
            $product->save();

            // Eliminar la venta
            return $sale->delete();
        });
    }

    /**
     * Get a sale by ID
     */
    public function getSaleById(int $saleId): ?Sale
    {
        return $this->saleRepository->findById($saleId);
    }
}
