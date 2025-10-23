<?php

namespace App\Services;

use App\Services\Contracts\AnalyticsServiceInterface;
use App\Repositories\Contracts\AnalyticsRepositoryInterface;

class AnalyticsService implements AnalyticsServiceInterface
{
    protected $analyticsRepository;

    public function __construct(AnalyticsRepositoryInterface $analyticsRepository)
    {
        $this->analyticsRepository = $analyticsRepository;
    }

    public function getAnalyticsData()
    {
        return $this->analyticsRepository->getSalesStatistics();
    }

    public function getSalesStatistics()
    {
        return [
            'total_sales' => $this->analyticsRepository->getTotalSales(),
            'total_revenue' => $this->analyticsRepository->getTotalRevenue(),
            'total_commissions' => $this->analyticsRepository->getTotalCommissions(),
            'total_costs' => $this->analyticsRepository->getTotalCosts(),
            'net_profit' => $this->analyticsRepository->getNetProfit(),
        ];
    }

    public function getProductAnalytics()
    {
        return $this->analyticsRepository->getSalesByProduct();
    }

    public function getSellerAnalytics()
    {
        return $this->analyticsRepository->getSalesBySeller();
    }

    public function getColorAnalytics()
    {
        return $this->analyticsRepository->getSalesByColor();
    }

    public function getDateRangeAnalytics($startDate = null, $endDate = null)
    {
        return $this->analyticsRepository->getSalesByDateRange($startDate, $endDate);
    }

    public function getAllSales()
    {
        return $this->analyticsRepository->getAllSales();
    }
}
