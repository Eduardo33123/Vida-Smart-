<?php

namespace App\Services;

use App\Models\SharedInventory;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SharedInventoryService
{
    /**
     * Get shared inventory for a specific user
     */
    public function getUserInventory(int $userId): Collection
    {
        return SharedInventory::with(['product.category', 'product.currency'])
            ->where('user_id', $userId)
            ->where('quantity', '>', 0)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get all shared inventory (for admin view)
     */
    public function getAllSharedInventory(): Collection
    {
        return SharedInventory::with(['product.category', 'product.currency', 'user'])
            ->where('quantity', '>', 0)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Add products to shared inventory (when partners buy together)
     */
    public function addSharedPurchase(array $data): array
    {
        Log::info('=== SERVICIO addSharedPurchase ===');
        Log::info('Datos recibidos:', $data);

        return DB::transaction(function () use ($data) {
            $results = [];
            $totalQuantityToAssign = array_sum(array_column($data['partners'], 'quantity'));

            // NO tocar el stock del producto principal - inventario compartido es independiente

            foreach ($data['partners'] as $partner) {
                Log::info('Procesando socio:', $partner);
                // Buscar si ya existe un registro para este usuario, producto y versión
                $existing = SharedInventory::where('product_id', $data['product_id'])
                    ->where('user_id', $partner['user_id'])
                    ->where('version', $data['version'] ?? 1)
                    ->first();

                if ($existing) {
                    Log::info('Registro existente encontrado, incrementando...');
                    // Si existe, incrementar la cantidad
                    $existing->increment('quantity', $partner['quantity']);
                    $existing->update([
                        'purchase_price' => $partner['purchase_price'],
                        'notes' => $data['notes'] ?? $existing->notes,
                    ]);
                    $results[] = $existing;
                    Log::info('Registro actualizado:', $existing->toArray());
                } else {
                    Log::info('Creando nuevo registro...');
                    // Si no existe, crear nuevo registro
                    $sharedInventory = SharedInventory::create([
                        'product_id' => $data['product_id'],
                        'user_id' => $partner['user_id'],
                        'version' => $data['version'] ?? 1,
                        'quantity' => $partner['quantity'],
                        'purchase_price' => $partner['purchase_price'],
                        'notes' => $data['notes'] ?? null,
                    ]);
                    $results[] = $sharedInventory;
                    Log::info('Nuevo registro creado:', $sharedInventory->toArray());
                }
            }

            Log::info('Resultados finales:', $results);
            return $results;
        });
    }

    /**
     * Remove quantity from user's shared inventory (when they make a sale)
     */
    public function removeFromUserInventory(int $userId, int $productId, int $quantity, int $version = 1): bool
    {
        return DB::transaction(function () use ($userId, $productId, $quantity, $version) {
            $sharedInventory = SharedInventory::where('user_id', $userId)
                ->where('product_id', $productId)
                ->where('version', $version)
                ->first();

            if (!$sharedInventory || $sharedInventory->quantity < $quantity) {
                return false;
            }

            $sharedInventory->decrement('quantity', $quantity);
            return true;
        });
    }

    /**
     * Get shared inventory statistics for a user
     */
    public function getUserInventoryStats(int $userId): array
    {
        $inventory = $this->getUserInventory($userId);
        $user = User::find($userId);

        $totalProducts = $inventory->count();
        $totalQuantity = $inventory->sum('quantity');
        $totalValue = $inventory->sum(function ($item) {
            return $item->quantity * ($item->purchase_price ?? 0);
        });

        return [
            'total_products' => $totalProducts,
            'total_quantity' => $totalQuantity,
            'total_value' => $totalValue,
            'formatted_total_value' => '$' . number_format($totalValue, 2),
            'user_name' => $user ? $user->name : 'Usuario desconocido',
            'user_id' => $userId,
        ];
    }

    /**
     * Get shared inventory statistics for all users
     */
    public function getAllInventoryStats(): array
    {
        $inventory = $this->getAllSharedInventory();

        $totalProducts = $inventory->count();
        $totalQuantity = $inventory->sum('quantity');
        $totalValue = $inventory->sum(function ($item) {
            return $item->quantity * ($item->purchase_price ?? 0);
        });

        // Group by user
        $userStats = $inventory->groupBy('user_id')->map(function ($userInventory) {
            return [
                'user_name' => $userInventory->first()->user->name,
                'total_products' => $userInventory->count(),
                'total_quantity' => $userInventory->sum('quantity'),
                'total_value' => $userInventory->sum(function ($item) {
                    return $item->quantity * ($item->purchase_price ?? 0);
                }),
            ];
        });

        return [
            'total_products' => $totalProducts,
            'total_quantity' => $totalQuantity,
            'total_value' => $totalValue,
            'formatted_total_value' => '$' . number_format($totalValue, 2),
            'user_stats' => $userStats,
        ];
    }

    /**
     * Check if user has enough inventory for a sale
     */
    public function checkUserInventory(int $userId, int $productId, int $quantity, int $version = 1): bool
    {
        $sharedInventory = SharedInventory::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('version', $version)
            ->first();

        return $sharedInventory && $sharedInventory->quantity >= $quantity;
    }

    /**
     * Get available users for shared purchases
     */
    public function getAvailableUsers(): Collection
    {
        return User::select('id', 'name')->get();
    }

    /**
     * Get user's inventory for a specific product and version
     */
    public function getUserProductInventory(int $userId, int $productId, int $version = 1): ?SharedInventory
    {
        return SharedInventory::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('version', $version)
            ->first();
    }

    /**
     * Get available stock for shared purchase (total stock minus already shared)
     * Shared inventory reduces the main product stock
     */
    public function getAvailableStockForSharedPurchase(int $productId): int
    {
        $product = Product::find($productId);
        if (!$product) {
            Log::info('Producto no encontrado', ['product_id' => $productId]);
            return 0;
        }

        // Get total quantity already in shared inventory for this product
        $sharedQuantity = SharedInventory::where('product_id', $productId)
            ->sum('quantity');

        Log::info('DEBUG - Consulta shared_quantity', [
            'product_id' => $productId,
            'shared_inventory_records' => SharedInventory::where('product_id', $productId)->get(['id', 'user_id', 'quantity'])->toArray(),
            'shared_quantity_sum' => $sharedQuantity
        ]);

        // Available stock = total product stock - already shared quantity
        // This ensures we don't over-assign products
        $availableStock = $product->stock - $sharedQuantity;

        Log::info('Cálculo de stock disponible', [
            'product_id' => $productId,
            'product_name' => $product->name,
            'total_stock' => $product->stock,
            'shared_quantity' => $sharedQuantity,
            'available_stock' => $availableStock,
            'note' => 'Shared inventory reduces main product stock'
        ]);

        return max(0, $availableStock); // Ensure we don't return negative numbers
    }

    /**
     * Get products with available stock for shared purchase
     */
    public function getProductsWithAvailableStock(): Collection
    {
        $products = Product::with(['category', 'currency'])->get();

        Log::info('Productos encontrados para filtrar', [
            'total_products' => $products->count(),
            'products' => $products->pluck('name', 'id')->toArray()
        ]);

        $filteredProducts = $products->filter(function ($product) {
            $availableStock = $this->getAvailableStockForSharedPurchase($product->id);

            // Only include products that have stock available for sharing (greater than 0)
            if ($availableStock > 0) {
                // Add the available stock property to the product
                $product->setAttribute('available_for_shared', $availableStock);
                Log::info('Producto incluido en filtro', [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'total_stock' => $product->stock,
                    'available_stock' => $availableStock
                ]);
                return true;
            } else {
                Log::info('Producto excluido del filtro', [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'total_stock' => $product->stock,
                    'available_stock' => $availableStock
                ]);
                return false;
            }
        });

        Log::info('Productos filtrados finales', [
            'filtered_count' => $filteredProducts->count(),
            'filtered_products' => $filteredProducts->pluck('name', 'id')->toArray()
        ]);

        // Forzar que se devuelva como un array con índices secuenciales
        return $filteredProducts->values();
    }
}
