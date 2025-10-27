<?php

namespace App\Http\Controllers;

use App\Services\SharedInventoryService;
use App\Services\Contracts\ProductServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class SharedInventoryController extends Controller
{
    public function __construct(
        private SharedInventoryService $sharedInventoryService,
        private ProductServiceInterface $productService
    ) {}

    /**
     * Display the shared inventory for the current user
     */
    public function index(Request $request): Response
    {
        $userId = auth()->id();
        $user = auth()->user();
        $filterUserId = $request->get('user_id'); // Obtener filtro de usuario

        Log::info('Usuario logueado:', ['id' => $userId, 'name' => $user->name]);
        Log::info('Filtro de usuario:', ['filter_user_id' => $filterUserId]);

        // Obtener inventario filtrado o de todos los usuarios
        if ($filterUserId) {
            $inventory = $this->sharedInventoryService->getUserInventory($filterUserId);
            $stats = $this->sharedInventoryService->getUserInventoryStats($filterUserId);
        } else {
            $inventory = $this->sharedInventoryService->getAllSharedInventory();
            $stats = $this->sharedInventoryService->getAllInventoryStats();
        }

        $products = $this->sharedInventoryService->getProductsWithAvailableStock();
        $users = $this->sharedInventoryService->getAvailableUsers();

        Log::info('Inventario obtenido:', ['inventory_count' => $inventory->count()]);
        
        // Debug: verificar la estructura del inventario
        if ($inventory->count() > 0) {
            $firstItem = $inventory->first();
            Log::info('DEBUG - Primer item del inventario:', [
                'item_id' => $firstItem->id,
                'user_id' => $firstItem->user_id,
                'user_loaded' => $firstItem->relationLoaded('user'),
                'user_data' => $firstItem->user ? $firstItem->user->toArray() : 'NULL',
                'user_name' => $firstItem->user?->name ?? 'NO NAME'
            ]);
        }
        
        Log::info('Productos disponibles para dividir:', [
            'products_count' => $products->count(),
            'products' => $products->pluck('name', 'id')->toArray()
        ]);

        // Debug adicional: verificar la estructura de los productos
        Log::info('DEBUG - Estructura de productos enviada al frontend:', [
            'products_type' => get_class($products),
            'products_count' => $products->count(),
            'first_product' => $products->first() ? $products->first()->toArray() : null,
            'products_array' => $products->toArray()
        ]);

        // Debug temporal: verificar todos los productos y su stock
        $allProducts = \App\Models\Product::all();
        Log::info('DEBUG - Todos los productos en la base de datos:', [
            'total_products' => $allProducts->count(),
            'products_with_stock' => $allProducts->where('stock', '>', 0)->count(),
            'products_detail' => $allProducts->map(function ($p) {
                $sharedQty = \App\Models\SharedInventory::where('product_id', $p->id)->sum('quantity');
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'stock' => $p->stock,
                    'shared_quantity' => $sharedQty,
                    'available' => $p->stock - $sharedQty
                ];
            })->toArray()
        ]);

        // Debug adicional: verificar si hay productos con stock > 0
        $productsWithStock = \App\Models\Product::where('stock', '>', 0)->get();
        Log::info('DEBUG - Productos con stock > 0:', [
            'count' => $productsWithStock->count(),
            'products' => $productsWithStock->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'stock' => $p->stock
                ];
            })->toArray()
        ]);

        return Inertia::render('SharedInventory', [
            'inventory' => $inventory,
            'statistics' => $stats,
            'products' => $products,
            'users' => $users,
            'currentUserId' => $userId,
            'filterUserId' => $filterUserId, // Pasar el filtro actual
        ]);
    }

    /**
     * Display all shared inventory (admin view)
     */
    public function admin(): Response
    {
        $inventory = $this->sharedInventoryService->getAllSharedInventory();
        $stats = $this->sharedInventoryService->getAllInventoryStats();
        $products = $this->sharedInventoryService->getProductsWithAvailableStock();
        $users = $this->sharedInventoryService->getAvailableUsers();

        return Inertia::render('SharedInventoryAdmin', [
            'inventory' => $inventory,
            'statistics' => $stats,
            'products' => $products,
            'users' => $users,
        ]);
    }

    /**
     * Store a new shared purchase
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            Log::info('=== STORE REQUEST ===');
            Log::info('Request data:', $request->all());

            $data = $request->validate([
                'product_id' => 'required|exists:products,id',
                'partners' => 'required|array|min:1',
                'partners.*.user_id' => 'required|exists:users,id',
                'partners.*.quantity' => 'required|integer|min:1',
                'notes' => 'nullable|string|max:1000',
            ]);

            Log::info('Datos validados:', $data);

            // Obtener información del producto
            $product = $this->productService->getProductById($data['product_id']);
            if (!$product) {
                return back()->with('error', 'Producto no encontrado');
            }

            // Agregar versión y precio automáticamente
            $data['version'] = $product->version ?? 1;
            $data['purchase_price'] = $product->purchase_price ?? 0;

            // Agregar precio a cada socio
            foreach ($data['partners'] as &$partner) {
                $partner['purchase_price'] = $data['purchase_price'];
            }

            // Validar que la cantidad total no exceda el stock disponible para compartir
            $totalQuantity = array_sum(array_column($data['partners'], 'quantity'));
            $availableStock = $this->sharedInventoryService->getAvailableStockForSharedPurchase($data['product_id']);
            if ($totalQuantity > $availableStock) {
                return back()->with('error', "La cantidad total ({$totalQuantity}) excede el stock disponible para dividir ({$availableStock})");
            }

            Log::info('Llamando al servicio...');
            $result = $this->sharedInventoryService->addSharedPurchase($data);
            Log::info('Resultado del servicio:', $result);

            return redirect()->route('shared-inventory.index')
                ->with('success', 'Inventario compartido actualizado exitosamente');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Error al actualizar el inventario compartido: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove quantity from user's inventory (when making a sale)
     */
    public function removeFromInventory(Request $request): RedirectResponse
    {
        try {
            $data = $request->validate([
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1',
                'version' => 'nullable|integer|min:1',
            ]);

            $userId = auth()->id();
            $success = $this->sharedInventoryService->removeFromUserInventory(
                $userId,
                $data['product_id'],
                $data['quantity'],
                $data['version'] ?? 1
            );

            if (!$success) {
                return back()->with('error', 'No tienes suficiente inventario para esta venta');
            }

            return redirect()->route('shared-inventory.index')
                ->with('success', 'Inventario actualizado exitosamente');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Error al actualizar el inventario: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Update the specified shared inventory item
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        try {
            $data = $request->validate([
                'quantity' => 'required|integer|min:0',
                'notes' => 'nullable|string|max:1000',
            ]);

            $sharedInventory = \App\Models\SharedInventory::findOrFail($id);

            // Actualizar la cantidad
            $oldQuantity = $sharedInventory->quantity;
            $sharedInventory->update([
                'quantity' => $data['quantity'],
                'notes' => $data['notes'],
            ]);

            // NO tocar el stock del producto principal - inventario compartido es independiente

            return redirect()->route('shared-inventory.index')
                ->with('success', 'Inventario actualizado exitosamente');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Error al actualizar el inventario: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified shared inventory item
     */
    public function destroy(int $id): RedirectResponse
    {
        try {
            Log::info('Intentando eliminar inventario compartido', ['id' => $id]);

            $sharedInventory = \App\Models\SharedInventory::findOrFail($id);
            Log::info('Inventario encontrado', ['inventory' => $sharedInventory->toArray()]);

            $product = $sharedInventory->product;
            $quantity = $sharedInventory->quantity;

            Log::info('Producto y cantidad', [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'quantity' => $quantity
            ]);

            // Eliminar el registro
            $sharedInventory->delete();
            Log::info('Registro eliminado exitosamente');

            // NO tocar el stock del producto principal - inventario compartido es independiente

            return redirect()->route('shared-inventory.index')
                ->with('success', 'Inventario eliminado exitosamente');
        } catch (\Exception $e) {
            Log::error('Error al eliminar inventario compartido', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Error al eliminar el inventario: ' . $e->getMessage());
        }
    }
}
