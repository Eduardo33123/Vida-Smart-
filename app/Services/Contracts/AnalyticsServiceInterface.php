<?php

namespace App\Services\Contracts;

interface AnalyticsServiceInterface
{
    public function getAnalyticsData();
    public function getSalesStatistics();
    public function getProductAnalytics();
    public function getSellerAnalytics();
    public function getColorAnalytics();
    public function getDateRangeAnalytics($startDate = null, $endDate = null);
    public function getAllSales();
}
