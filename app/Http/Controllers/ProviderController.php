<?php

namespace App\Http\Controllers;

use App\Services\Contracts\ProviderServiceInterface;
use App\Services\Contracts\CurrencyServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\ValidationException;

class ProviderController extends Controller
{
    protected ProviderServiceInterface $providerService;
    protected CurrencyServiceInterface $currencyService;

    public function __construct(
        ProviderServiceInterface $providerService,
        CurrencyServiceInterface $currencyService
    ) {
        $this->providerService = $providerService;
        $this->currencyService = $currencyService;
    }

    /**
     * Display a listing of providers
     */
    public function index(): Response
    {
        $providers = $this->providerService->getAllProviders();
        $currencies = $this->currencyService->getActiveCurrencies();

        return Inertia::render('Proveedores', [
            'providers' => $providers,
            'currencies' => $currencies,
        ]);
    }

    /**
     * Show the form for creating a new provider
     */
    public function create(): Response
    {
        $currencies = $this->currencyService->getActiveCurrencies();

        return Inertia::render('ProviderCreate', [
            'currencies' => $currencies,
        ]);
    }

    /**
     * Store a newly created provider
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $provider = $this->providerService->createProvider($request->all());

            return redirect()->route('proveedores')
                ->with('success', 'Proveedor creado exitosamente');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Error al crear el proveedor: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified provider
     */
    public function show(int $id): Response
    {
        $provider = $this->providerService->getProviderById($id);
        
        if (!$provider) {
            abort(404, 'Proveedor no encontrado');
        }

        // Obtener todas las ventas de productos de este proveedor
        $sales = \App\Models\Sale::with(['product', 'seller'])
            ->whereHas('product', function($query) use ($id) {
                $query->where('provider_id', $id);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        // Calcular estadísticas de ventas
        $totalSales = $sales->count();
        $totalRevenue = $sales->sum('total_amount');
        $totalQuantity = $sales->sum('quantity_sold');
        
        // Calcular ganancias totales (precio de venta - precio de compra)
        $totalProfit = 0;
        foreach ($sales as $sale) {
            if ($sale->product && $sale->product->purchase_price) {
                $profitPerUnit = $sale->sale_price - $sale->product->purchase_price;
                $totalProfit += $profitPerUnit * $sale->quantity_sold;
            }
        }

        $salesStats = [
            'total_sales' => $totalSales,
            'total_revenue' => $totalRevenue,
            'total_quantity' => $totalQuantity,
            'total_profit' => $totalProfit,
        ];

        return Inertia::render('ProviderShow', [
            'provider' => $provider,
            'sales' => $sales,
            'salesStats' => $salesStats,
        ]);
    }

    /**
     * Show the form for editing the specified provider
     */
    public function edit(int $id): Response
    {
        $provider = $this->providerService->getProviderById($id);
        $currencies = $this->currencyService->getActiveCurrencies();

        if (!$provider) {
            abort(404, 'Proveedor no encontrado');
        }

        return Inertia::render('ProviderEdit', [
            'provider' => $provider,
            'currencies' => $currencies,
        ]);
    }

    /**
     * Update the specified provider
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        try {
            $provider = $this->providerService->updateProvider($id, $request->all());

            return redirect()->route('proveedores')
                ->with('success', 'Proveedor actualizado exitosamente');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Error al actualizar el proveedor: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified provider
     */
    public function destroy(int $id): RedirectResponse
    {
        try {
            $deleted = $this->providerService->deleteProvider($id);

            if (!$deleted) {
                return back()->with('error', 'Proveedor no encontrado');
            }

            return redirect()->route('proveedores')
                ->with('success', 'Proveedor eliminado exitosamente');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al eliminar el proveedor: ' . $e->getMessage());
        }
    }
}
