<?php

namespace App\Repositories\Contracts;

interface AnalyticsRepositoryInterface
{
    public function getTotalSales();
    public function getTotalRevenue();
    public function getTotalCommissions();
    public function getTotalCosts();
    public function getNetProfit();
    public function getSalesByProduct();
    public function getSalesBySeller();
    public function getSalesByColor();
    public function getSalesByDateRange($startDate = null, $endDate = null);
    public function getTopSellingProducts($limit = 10);
    public function getSalesStatistics();
}
