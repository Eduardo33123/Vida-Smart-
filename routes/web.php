<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\InvestmentController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SharedInventoryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect()->route('mi-login');
});

Route::get('/mi-login', function () {
    return Inertia::render('MiLogin');
})->name('mi-login');

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rutas personalizadas
    Route::get('/settings', function () {
        return Inertia::render('Settings');
    })->name('settings');

    Route::get('/help', function () {
        return Inertia::render('Help');
    })->name('help');

    // Rutas del Inventario usando Resource Controller
    Route::get('/inventario', [ProductController::class, 'index'])->name('inventario');

    // Rutas de productos usando Resource Controller
    Route::resource('products', ProductController::class)->except(['create']);

    // Ruta para ajustar stock
    Route::post('/products/adjust-stock', [ProductController::class, 'adjustStock'])->name('products.adjust-stock');

    // Ruta adicional para estadísticas
    Route::get('/api/products/statistics', [ProductController::class, 'statistics'])->name('products.statistics');

    // Rutas de Proveedores usando Resource Controller
    Route::get('/proveedores', [ProviderController::class, 'index'])->name('proveedores');
    Route::resource('providers', ProviderController::class)->except(['create']);

    // Rutas de Categorías usando Resource Controller
    Route::get('/categoria', [CategoryController::class, 'index'])->name('categorias');
    Route::resource('categories', CategoryController::class)->except(['create']);

    // Ruta adicional para subcategorías
    Route::get('/api/categories/{parentId}/subcategories', [CategoryController::class, 'getSubcategories'])->name('categories.subcategories');

    // Rutas de Inversión
    Route::get('/inversion', [InvestmentController::class, 'index'])->name('inversion');
    Route::resource('investments', InvestmentController::class)->except(['create', 'edit']);

    // Rutas de Ventas
    Route::get('/vender', [SaleController::class, 'index'])->name('vender');
    Route::resource('sales', SaleController::class)->except(['create']);

    // Rutas de Analytics
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics');

    // Ruta temporal para debug
    Route::get('/debug-products', function () {
        $allProducts = \App\Models\Product::all();
        $productsWithStock = \App\Models\Product::where('stock', '>', 0)->get();

        $debugInfo = [
            'total_products' => $allProducts->count(),
            'products_with_stock' => $productsWithStock->count(),
            'all_products' => $allProducts->map(function ($p) {
                $sharedQty = \App\Models\SharedInventory::where('product_id', $p->id)->sum('quantity');
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'stock' => $p->stock,
                    'shared_quantity' => $sharedQty,
                    'available' => $p->stock - $sharedQty
                ];
            })->toArray(),
            'shared_inventory' => \App\Models\SharedInventory::with('product')->get()->map(function ($si) {
                return [
                    'id' => $si->id,
                    'product_name' => $si->product->name,
                    'user_id' => $si->user_id,
                    'quantity' => $si->quantity
                ];
            })->toArray()
        ];

        return response()->json($debugInfo, 200, [], JSON_PRETTY_PRINT);
    })->name('debug.products');
    Route::get('/analytics/revenue', [AnalyticsController::class, 'revenueDetails'])->name('analytics.revenue');
    Route::get('/analytics/commissions', [AnalyticsController::class, 'commissionsDetails'])->name('analytics.commissions');
    Route::get('/analytics/costs', [AnalyticsController::class, 'costsDetails'])->name('analytics.costs');
    Route::get('/analytics/profit', [AnalyticsController::class, 'profitDetails'])->name('analytics.profit');
    Route::get('/analytics/product/{productId}', [AnalyticsController::class, 'productSalesDetails'])->name('analytics.product');
    Route::get('/analytics/seller/{sellerId}', [AnalyticsController::class, 'sellerSalesDetails'])->name('analytics.seller');

    // Rutas de Inventario Compartido
    Route::get('/shared-inventory', [SharedInventoryController::class, 'index'])->name('shared-inventory.index');
    Route::get('/shared-inventory/admin', [SharedInventoryController::class, 'admin'])->name('shared-inventory.admin');
    Route::post('/shared-inventory', [SharedInventoryController::class, 'store'])->name('shared-inventory.store');
    Route::post('/shared-inventory/remove', [SharedInventoryController::class, 'removeFromInventory'])->name('shared-inventory.remove');
    Route::put('/shared-inventory/{id}', [SharedInventoryController::class, 'update'])->name('shared-inventory.update');
    Route::delete('/shared-inventory/{id}', [SharedInventoryController::class, 'destroy'])->name('shared-inventory.destroy');
});

require __DIR__ . '/auth.php';