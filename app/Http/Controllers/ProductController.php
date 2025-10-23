<?php

namespace App\Http\Controllers;

use App\Services\Contracts\ProductServiceInterface;
use App\Services\ProductVersionStockService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    protected ProductServiceInterface $productService;
    protected ProductVersionStockService $versionStockService;

    public function __construct(ProductServiceInterface $productService, ProductVersionStockService $versionStockService)
    {
        $this->productService = $productService;
        $this->versionStockService = $versionStockService;
    }

    /**
     * Display a listing of products (Inventory page)
     */
    public function index(): Response
    {
        $products = $this->productService->getAllProducts()->load(['category', 'currency', 'provider']);
        $statistics = $this->productService->getInventoryStatistics();

        // Obtener datos para el modal
        $categories = app(\App\Services\Contracts\CategoryServiceInterface::class)->getAllCategories();
        $currencies = app(\App\Services\Contracts\CurrencyServiceInterface::class)->getAllCurrencies();
        $providers = app(\App\Services\Contracts\ProviderServiceInterface::class)->getAllProviders();

        return Inertia::render('Inventario', [
            'products' => $products,
            'statistics' => $statistics,
            'categories' => $categories,
            'currencies' => $currencies,
            'providers' => $providers,
        ]);
    }

    /**
     * Show the form for creating a new product
     */
    public function create(): Response
    {
        return Inertia::render('ProductCreate');
    }

    /**
     * Store a newly created product
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $product = $this->productService->createProduct($request->all());

            return redirect()->route('inventario')
                ->with('success', 'Producto creado exitosamente');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Error al crear el producto: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified product
     */
    public function show(int $id): Response
    {
        $product = $this->productService->getProductById($id);

        if (!$product) {
            abort(404, 'Producto no encontrado');
        }

        // Obtener usuarios para el select de vendedores
        $users = \App\Models\User::select('id', 'name')->get();

        return Inertia::render('ProductShow', [
            'product' => $product,
            'users' => $users,
        ]);
    }

    /**
     * Show the form for editing the specified product
     */
    public function edit(int $id): Response
    {
        $product = $this->productService->getProductById($id);

        if (!$product) {
            abort(404, 'Producto no encontrado');
        }

        // Obtener datos para el formulario
        $categories = app(\App\Services\Contracts\CategoryServiceInterface::class)->getAllCategories();
        $currencies = app(\App\Services\Contracts\CurrencyServiceInterface::class)->getAllCurrencies();
        $providers = app(\App\Services\Contracts\ProviderServiceInterface::class)->getAllProviders();

        return Inertia::render('ProductEdit', [
            'product' => $product,
            'categories' => $categories,
            'currencies' => $currencies,
            'providers' => $providers,
        ]);
    }

    /**
     * Update the specified product
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        try {
            $product = $this->productService->updateProduct($id, $request->all());

            return redirect()->route('products.show', $product->id)
                ->with('success', 'Producto actualizado exitosamente');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Error al actualizar el producto: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Adjust stock for a product
     */
    public function adjustStock(Request $request): RedirectResponse
    {
        try {
            $data = $request->validate([
                'product_id' => 'required|exists:products,id',
                'action' => 'required|in:add,new_version',
                'quantity' => 'required|integer|min:1',
                'new_purchase_price' => 'nullable|numeric|min:0',
            ]);

            // Validación adicional para nueva versión
            if ($data['action'] === 'new_version' && empty($data['new_purchase_price'])) {
                return back()->withErrors(['new_purchase_price' => 'El precio de compra es requerido para crear una nueva versión.'])->withInput();
            }

            $product = $this->productService->getProductById($data['product_id']);

            if (!$product) {
                return back()->with('error', 'Producto no encontrado');
            }

            if ($data['action'] === 'add') {
                // Agregar a la versión actual
                $currentVersion = $product->version ?? 1;
                $this->versionStockService->addStockToVersion(
                    $product->id,
                    $currentVersion,
                    $data['quantity']
                );

                $message = "Se agregaron {$data['quantity']} unidades a la versión {$currentVersion}";
            } else {
                // Crear nueva versión
                $newVersion = ($product->version ?? 1) + 1;
                $this->versionStockService->addStockToVersion(
                    $product->id,
                    $newVersion,
                    $data['quantity'],
                    $data['new_purchase_price']
                );

                // Update product version and purchase price
                $product->version = $newVersion;
                $product->version_purchase_price = $data['new_purchase_price'];
                $product->purchase_price = $data['new_purchase_price'];
                $product->save();

                $message = "Se creó la versión {$newVersion} con {$data['quantity']} unidades";
            }

            return redirect()->route('products.show', $product->id)
                ->with('success', $message);
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Error al ajustar el stock: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified product
     */
    public function destroy(int $id): RedirectResponse
    {
        try {
            $deleted = $this->productService->deleteProduct($id);

            if (!$deleted) {
                return back()->with('error', 'Producto no encontrado');
            }

            return redirect()->route('inventario')
                ->with('success', 'Producto eliminado exitosamente');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al eliminar el producto: ' . $e->getMessage());
        }
    }

    /**
     * Get inventory statistics (API endpoint)
     */
    public function statistics(): array
    {
        return $this->productService->getInventoryStatistics();
    }
}
