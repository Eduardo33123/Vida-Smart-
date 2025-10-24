<?php

namespace App\Http\Controllers;

use App\Services\Contracts\AnalyticsServiceInterface;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    protected $analyticsService;

    public function __construct(AnalyticsServiceInterface $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function index(): Response
    {
        $analyticsData = $this->analyticsService->getAnalyticsData();

        return Inertia::render('Analytics', [
            'analytics' => $analyticsData,
        ]);
    }

    public function revenueDetails(): Response
    {
        $sales = $this->analyticsService->getAllSales();
        $totalRevenue = $this->analyticsService->getSalesStatistics()['total_revenue'];

        return Inertia::render('Analytics/RevenueDetails', [
            'sales' => $sales,
            'totalRevenue' => $totalRevenue,
        ]);
    }

    public function commissionsDetails(): Response
    {
        $allSales = $this->analyticsService->getAllSales();
        $totalCommissions = $this->analyticsService->getSalesStatistics()['total_commissions'];

        return Inertia::render('Analytics/CommissionsDetails', [
            'sales' => $allSales,
            'totalCommissions' => $totalCommissions,
        ]);
    }

    public function costsDetails(): Response
    {
        $sales = $this->analyticsService->getAllSales();
        $totalCosts = $this->analyticsService->getSalesStatistics()['total_costs'];

        return Inertia::render('Analytics/CostsDetails', [
            'sales' => $sales,
            'totalCosts' => $totalCosts,
        ]);
    }

    public function profitDetails(): Response
    {
        $sales = $this->analyticsService->getAllSales();
        $netProfit = $this->analyticsService->getSalesStatistics()['net_profit'];

        return Inertia::render('Analytics/ProfitDetails', [
            'sales' => $sales,
            'netProfit' => $netProfit,
        ]);
    }

    public function productSalesDetails(int $productId)
    {
        $product = \App\Models\Product::with(['category', 'currency', 'provider'])->find($productId);

        if (!$product) {
            return redirect()->route('analytics')->with('error', 'Producto no encontrado');
        }

        $allSales = $this->analyticsService->getAllSales();

        // Calcular estadísticas para este producto específico
        $productSales = $allSales->filter(function ($sale) use ($productId) {
            return (int)$sale->product_id === (int)$productId;
        });

        $totalRevenue = $productSales->sum('total_amount');
        $totalQuantity = $productSales->sum('quantity_sold');
        $totalCommissions = $productSales->sum('commission');
        $totalSales = $productSales->count();
        
        // Calcular costos y ganancia neta
        $productCost = $product->purchase_price ?? 0; // Precio de compra del producto
        $totalCosts = $totalQuantity * $productCost; // Costo total de productos vendidos
        $netProfit = $totalRevenue - $totalCosts - $totalCommissions; // Ganancia neta
        $profitMargin = $totalRevenue > 0 ? ($netProfit / $totalRevenue) * 100 : 0; // Margen de ganancia

        return Inertia::render('Analytics/ProductSalesDetails', [
            'product' => $product,
            'sales' => $allSales, // Pasar todas las ventas
            'productId' => $productId, // Pasar el ID del producto para filtrar en frontend
            'totalRevenue' => $totalRevenue,
            'totalQuantity' => $totalQuantity,
            'totalCommissions' => $totalCommissions,
            'totalSales' => $totalSales,
            'totalCosts' => $totalCosts,
            'netProfit' => $netProfit,
            'profitMargin' => $profitMargin,
        ]);
    }

    public function sellerSalesDetails(int $sellerId)
    {
        $seller = \App\Models\User::find($sellerId);

        if (!$seller) {
            return redirect()->route('analytics')->with('error', 'Vendedor no encontrado');
        }

        $allSales = $this->analyticsService->getAllSales();

        // Calcular estadísticas para este vendedor específico
        $sellerSales = $allSales->filter(function ($sale) use ($sellerId) {
            return (int)$sale->seller_id === (int)$sellerId;
        });

        $totalRevenue = $sellerSales->sum('total_amount');
        $totalQuantity = $sellerSales->sum('quantity_sold');
        $totalCommissions = $sellerSales->sum('commission');
        
        // Calcular costos totales de productos vendidos por este vendedor
        $totalCosts = 0;
        foreach ($sellerSales as $sale) {
            if ($sale->product) {
                $totalCosts += $sale->quantity_sold * ($sale->product->purchase_price ?? 0);
            }
        }
        
        // Calcular ganancia neta
        $netProfit = $totalRevenue - $totalCosts - $totalCommissions;
        $profitMargin = $totalRevenue > 0 ? ($netProfit / $totalRevenue) * 100 : 0;

        return Inertia::render('Analytics/SellerSalesDetails', [
            'seller' => $seller,
            'sales' => $allSales, // Pasar todas las ventas
            'sellerId' => $sellerId, // Pasar el ID del vendedor para filtrar en frontend
            'totalRevenue' => $totalRevenue,
            'totalQuantity' => $totalQuantity,
            'totalCommissions' => $totalCommissions,
            'totalCosts' => $totalCosts,
            'netProfit' => $netProfit,
            'profitMargin' => $profitMargin,
        ]);
    }
}