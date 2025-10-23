<?php

namespace App\Repositories;

use App\Repositories\Contracts\AnalyticsRepositoryInterface;
use App\Models\Sale;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AnalyticsRepository implements AnalyticsRepositoryInterface
{
    public function getTotalSales()
    {
        return Sale::count();
    }

    public function getTotalRevenue()
    {
        return Sale::sum('total_amount') ?? 0;
    }

    public function getTotalCommissions()
    {
        return Sale::sum('commission') ?? 0;
    }

    public function getTotalCosts()
    {
        return Sale::join('products', 'sales.product_id', '=', 'products.id')
            ->sum(DB::raw('sales.quantity_sold * products.purchase_price')) ?? 0;
    }

    public function getNetProfit()
    {
        $totalRevenue = $this->getTotalRevenue();
        $totalCosts = $this->getTotalCosts();
        $totalCommissions = $this->getTotalCommissions();
        
        return $totalRevenue - $totalCosts - $totalCommissions;
    }

    public function getSalesByProduct()
    {
        return Sale::select(
                'products.name as product_name',
                'products.id as product_id',
                DB::raw('SUM(sales.quantity_sold) as total_quantity'),
                DB::raw('SUM(sales.total_amount) as total_revenue'),
                DB::raw('COUNT(sales.id) as total_sales')
            )
            ->join('products', 'sales.product_id', '=', 'products.id')
            ->groupBy('products.id', 'products.name')
            ->orderBy('total_quantity', 'desc')
            ->get();
    }

    public function getSalesBySeller()
    {
        return Sale::select(
                'users.name as seller_name',
                'users.id as seller_id',
                DB::raw('SUM(sales.quantity_sold) as total_quantity'),
                DB::raw('SUM(sales.total_amount) as total_revenue'),
                DB::raw('SUM(sales.commission) as total_commission'),
                DB::raw('COUNT(sales.id) as total_sales')
            )
            ->join('users', 'sales.seller_id', '=', 'users.id')
            ->groupBy('users.id', 'users.name')
            ->orderBy('total_revenue', 'desc')
            ->get();
    }

    public function getSalesByColor()
    {
        return Sale::select(
                'color',
                DB::raw('SUM(quantity_sold) as total_quantity'),
                DB::raw('SUM(total_amount) as total_revenue'),
                DB::raw('COUNT(id) as total_sales')
            )
            ->whereNotNull('color')
            ->where('color', '!=', '')
            ->groupBy('color')
            ->orderBy('total_quantity', 'desc')
            ->get();
    }

    public function getSalesByDateRange($startDate = null, $endDate = null)
    {
        $query = Sale::query();
        
        if ($startDate) {
            $query->whereDate('sale_date', '>=', $startDate);
        }
        
        if ($endDate) {
            $query->whereDate('sale_date', '<=', $endDate);
        }
        
        return $query->get();
    }

    public function getTopSellingProducts($limit = 10)
    {
        return Sale::select(
                'products.name as product_name',
                'products.id as product_id',
                DB::raw('SUM(sales.quantity_sold) as total_quantity'),
                DB::raw('SUM(sales.total_amount) as total_revenue')
            )
            ->join('products', 'sales.product_id', '=', 'products.id')
            ->groupBy('products.id', 'products.name')
            ->orderBy('total_quantity', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getSalesStatistics()
    {
        return [
            'total_sales' => $this->getTotalSales(),
            'total_revenue' => $this->getTotalRevenue(),
            'total_commissions' => $this->getTotalCommissions(),
            'total_costs' => $this->getTotalCosts(),
            'net_profit' => $this->getNetProfit(),
            'sales_by_product' => $this->getSalesByProduct(),
            'sales_by_seller' => $this->getSalesBySeller(),
            'sales_by_color' => $this->getSalesByColor(),
            'top_products' => $this->getTopSellingProducts(5),
        ];
    }

    public function getAllSales()
    {
        return Sale::with(['product', 'seller'])
            ->orderBy('sale_date', 'desc')
            ->get();
    }
}
