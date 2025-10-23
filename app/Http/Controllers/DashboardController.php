<?php

namespace App\Http\Controllers;

use App\Services\Contracts\SaleServiceInterface;
use App\Services\Contracts\AnalyticsServiceInterface;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    protected $saleService;
    protected $analyticsService;

    public function __construct(
        SaleServiceInterface $saleService,
        AnalyticsServiceInterface $analyticsService
    ) {
        $this->saleService = $saleService;
        $this->analyticsService = $analyticsService;
    }

    /**
     * Display the dashboard with recent sales and statistics
     */
    public function index(): Response
    {
        try {
            // Obtener estadísticas generales
            $analytics = $this->analyticsService->getSalesStatistics();

            // Obtener las 10 ventas más recientes con relaciones
            $recentSales = $this->saleService->getAllSales()
                ->load(['product', 'seller'])
                ->sortByDesc('created_at')
                ->take(10);

            // Obtener estadísticas de usuarios
            $totalUsers = User::count();

            // Calcular crecimiento (comparar con el mes anterior)
            $currentMonthSales = $this->saleService->getAllSales()
                ->where('created_at', '>=', now()->startOfMonth())
                ->count();

            $lastMonthSales = $this->saleService->getAllSales()
                ->whereBetween('created_at', [
                    now()->subMonth()->startOfMonth(),
                    now()->subMonth()->endOfMonth()
                ])
                ->count();

            $growthPercentage = $lastMonthSales > 0
                ? round((($currentMonthSales - $lastMonthSales) / $lastMonthSales) * 100, 1)
                : 0;

            // Calcular actividad (ventas en los últimos 7 días)
            $recentActivity = $this->saleService->getAllSales()
                ->where('created_at', '>=', now()->subDays(7))
                ->count();

            return Inertia::render('Dashboard', [
                'analytics' => $analytics,
                'recentSales' => $recentSales,
                'statistics' => [
                    'total_users' => $totalUsers,
                    'total_sales' => $analytics['total_sales'] ?? 0,
                    'total_revenue' => $analytics['total_revenue'] ?? 0,
                    'growth_percentage' => $growthPercentage,
                    'recent_activity' => $recentActivity,
                ]
            ]);
        } catch (\Exception $e) {
            // En caso de error, devolver datos vacíos
            return Inertia::render('Dashboard', [
                'analytics' => [
                    'total_sales' => 0,
                    'total_revenue' => 0,
                    'total_commissions' => 0,
                    'total_costs' => 0,
                    'net_profit' => 0,
                ],
                'recentSales' => collect([]),
                'statistics' => [
                    'total_users' => 0,
                    'total_sales' => 0,
                    'total_revenue' => 0,
                    'growth_percentage' => 0,
                    'recent_activity' => 0,
                ]
            ]);
        }
    }
}
