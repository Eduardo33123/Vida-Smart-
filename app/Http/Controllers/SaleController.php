<?php

namespace App\Http\Controllers;

use App\Services\Contracts\SaleServiceInterface;
use App\Services\ProductVersionStockService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    public function __construct(
        private SaleServiceInterface $saleService,
        private ProductVersionStockService $versionStockService
    ) {}

    /**
     * Display a listing of sales
     */
    public function index(Request $request): Response
    {
        try {
            $productId = $request->get('product');
            $version = $request->get('version');
            $userId = $request->get('user');

            if ($productId && $version && $userId) {
                // Filtrar ventas por producto, versión y usuario específicos
                $sales = $this->saleService->getSalesByProductVersionAndUser($productId, $version, $userId);
                $statistics = $this->saleService->getSalesStatisticsByProduct($productId);
                $selectedProduct = $this->saleService->getProductById($productId);
            } elseif ($productId && $version) {
                // Filtrar ventas por producto y versión específica
                $sales = $this->saleService->getSalesByProductAndVersion($productId, $version);
                $statistics = $this->saleService->getSalesStatisticsByProduct($productId);
                $selectedProduct = $this->saleService->getProductById($productId);
            } elseif ($productId && $userId) {
                // Filtrar ventas por producto y usuario específicos
                $sales = $this->saleService->getSalesByProductAndUser($productId, $userId);
                $statistics = $this->saleService->getSalesStatisticsByProduct($productId);
                $selectedProduct = $this->saleService->getProductById($productId);
            } elseif ($productId) {
                // Filtrar ventas por producto específico
                $sales = $this->saleService->getSalesByProduct($productId);
                $statistics = $this->saleService->getSalesStatisticsByProduct($productId);
                $selectedProduct = $this->saleService->getProductById($productId);
            } elseif ($userId) {
                // Filtrar ventas por usuario específico
                $sales = $this->saleService->getSalesByUser($userId);
                $statistics = $this->saleService->getSalesStatistics();
                $selectedProduct = null;
            } elseif ($version) {
                // Filtrar ventas por versión específica
                $sales = $this->saleService->getSalesByVersion($version);
                $statistics = $this->saleService->getSalesStatistics();
                $selectedProduct = null;
            } else {
                // Mostrar todas las ventas
                $sales = $this->saleService->getAllSales();
                $statistics = $this->saleService->getSalesStatistics();
                $selectedProduct = null;
            }

            $products = $this->saleService->getAvailableProducts();
            $users = User::select('id', 'name')->get();

            // Get available versions globally (from all sales)
            $availableVersions = [];
            if ($selectedProduct) {
                // If there's a selected product, get versions for that product
                $versionStocks = $this->versionStockService->getVersionStocks($selectedProduct->id);
                $availableVersions = $versionStocks->pluck('version')->sort()->values()->toArray();
            } else {
                // Get all versions that exist in sales
                $availableVersions = \App\Models\Sale::distinct()
                    ->whereNotNull('product_version')
                    ->pluck('product_version')
                    ->sort()
                    ->values()
                    ->toArray();
            }

            return Inertia::render('Vender', [
                'sales' => $sales,
                'statistics' => $statistics,
                'products' => $products,
                'users' => $users,
                'selectedProduct' => $selectedProduct,
                'isFiltered' => $productId ? true : false,
                'selectedVersion' => $version,
                'availableVersions' => $availableVersions,
                'selectedUser' => $userId ? User::find($userId) : null,
            ]);
        } catch (\Exception $e) {

            // Si hay error, devolver datos vacíos
            return Inertia::render('Vender', [
                'sales' => collect([]),
                'statistics' => [
                    'total_sales' => 0,
                    'total_revenue' => 0,
                    'total_commission' => 0,
                    'total_additional_expenses' => 0,
                ],
                'products' => collect([]),
                'users' => collect([]),
                'selectedProduct' => null,
                'isFiltered' => false,
                'selectedUser' => null,
            ]);
        }
    }

    /**
     * Store a newly created sale
     */
    public function store(Request $request)
    {
        try {
            // Add current user as seller if not provided
            $data = $request->all();
            if (!isset($data['seller_id'])) {
                $data['seller_id'] = Auth::id();
            }

            $sale = $this->saleService->processSale($data);

            // Si es una petición Inertia, devolver respuesta de Inertia
            if ($request->header('X-Inertia')) {
                return back()->with('success', 'Venta registrada exitosamente. Stock actualizado.');
            }

            return redirect()->route('vender')->with('success', 'Venta registrada exitosamente. Stock actualizado.');
        } catch (ValidationException $e) {
            // Si es una petición Inertia, devolver respuesta de Inertia con errores
            if ($request->header('X-Inertia')) {
                return back()->withErrors($e->errors())->withInput();
            }

            return redirect()->route('vender')->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            // Si es una petición Inertia, devolver respuesta de Inertia con error
            if ($request->header('X-Inertia')) {
                return back()->withErrors(['error' => $e->getMessage()])->withInput();
            }

            return redirect()->route('vender')->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified sale
     */
    public function show(int $id): Response
    {
        $sale = $this->saleService->getAllSales()->find($id);

        if (!$sale) {
            abort(404);
        }

        return Inertia::render('SaleShow', [
            'sale' => $sale,
        ]);
    }

    /**
     * Show the form for editing the specified sale
     */
    public function edit(int $id)
    {
        try {
            $sale = $this->saleService->getSaleById($id);
            $products = $this->saleService->getAvailableProducts();
            $users = User::select('id', 'name')->get();

            if (!$sale) {
                return redirect()->route('vender')->with('error', 'Venta no encontrada');
            }

            return Inertia::render('Vender', [
                'sale' => $sale,
                'products' => $products,
                'users' => $users,
                'isEditing' => true,
            ]);
        } catch (\Exception $e) {
            return redirect()->route('vender')->with('error', 'Error al cargar la venta: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified sale
     */
    public function update(Request $request, int $id)
    {
        try {
            $data = $request->all();

            // Convertir campos vacíos a null
            $data['commission'] = $data['commission'] === '' ? null : $data['commission'];
            $data['color'] = $data['color'] === '' ? null : $data['color'];
            $data['notes'] = $data['notes'] === '' ? null : $data['notes'];

            $this->saleService->updateSale($id, $data);

            return redirect()->route('vender')->with('success', 'Venta actualizada exitosamente');
        } catch (\Exception $e) {
            return redirect()->route('vender')->with('error', 'Error al actualizar la venta: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified sale
     */
    public function destroy(int $id)
    {
        try {
            $this->saleService->deleteSale($id);
            return redirect()->route('vender')->with('success', 'Venta eliminada exitosamente');
        } catch (\Exception $e) {
            return redirect()->route('vender')->with('error', 'Error al eliminar la venta: ' . $e->getMessage());
        }
    }
}
