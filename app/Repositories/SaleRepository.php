<?php

namespace App\Repositories;

use App\Models\Sale;
use App\Repositories\Contracts\SaleRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class SaleRepository implements SaleRepositoryInterface
{
    /**
     * Get all sales
     */
    public function getAll(): Collection
    {
        try {
            return Sale::with(['product', 'seller'])->orderBy('created_at', 'desc')->get();
        } catch (\Exception $e) {
            // Si hay error con las relaciones, devolver ventas sin relaciones
            return Sale::orderBy('created_at', 'desc')->get();
        }
    }

    /**
     * Get sales by seller
     */
    public function getBySeller(int $sellerId): Collection
    {
        return Sale::with(['product', 'seller'])
            ->where('seller_id', $sellerId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Find a sale by ID
     */
    public function findById(int $saleId): ?Sale
    {
        return Sale::with(['product', 'seller'])->find($saleId);
    }

    /**
     * Get sales by date range
     */
    public function getByDateRange(string $startDate, string $endDate): Collection
    {
        return Sale::with(['product', 'seller'])
            ->whereBetween('sale_date', [$startDate, $endDate])
            ->orderBy('sale_date', 'desc')
            ->get();
    }

    /**
     * Get sales statistics
     */
    public function getStatistics(): array
    {
        $totalSales = Sale::count();
        $totalRevenue = Sale::sum('total_amount');
        $totalCommission = Sale::sum('commission');
        $totalProductsSold = Sale::sum('quantity_sold');
        $totalAdditionalExpenses = Sale::sum('additional_expenses');

        $todaySales = Sale::whereDate('sale_date', today())->count();
        $todayRevenue = Sale::whereDate('sale_date', today())->sum('total_amount');

        $thisMonthSales = Sale::whereMonth('sale_date', now()->month)
            ->whereYear('sale_date', now()->year)
            ->count();
        $thisMonthRevenue = Sale::whereMonth('sale_date', now()->month)
            ->whereYear('sale_date', now()->year)
            ->sum('total_amount');

        return [
            'total_sales' => $totalSales,
            'total_revenue' => $totalRevenue,
            'total_commission' => $totalCommission,
            'total_additional_expenses' => $totalAdditionalExpenses,
            'today_sales' => $todaySales,
            'today_revenue' => $todayRevenue,
            'this_month_sales' => $thisMonthSales,
            'this_month_revenue' => $thisMonthRevenue,
        ];
    }

    /**
     * Create a new sale
     */
    public function create(array $data): Sale
    {
        return Sale::create($data);
    }


    /**
     * Update a sale
     */
    public function update(int $id, array $data): bool
    {
        $sale = Sale::find($id);
        if (!$sale) {
            return false;
        }

        return $sale->update($data);
    }

    /**
     * Delete a sale
     */
    public function delete(int $id): bool
    {
        $sale = Sale::find($id);
        if (!$sale) {
            return false;
        }

        return $sale->delete();
    }
}
