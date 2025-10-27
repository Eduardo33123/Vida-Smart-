<?php

namespace App\Providers;

use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Repositories\ProductRepository;
use App\Services\Contracts\ProductServiceInterface;
use App\Services\ProductService;
use App\Repositories\Contracts\ProviderRepositoryInterface;
use App\Repositories\ProviderRepository;
use App\Services\Contracts\ProviderServiceInterface;
use App\Services\ProviderService;
use App\Repositories\Contracts\CurrencyRepositoryInterface;
use App\Repositories\CurrencyRepository;
use App\Services\Contracts\CurrencyServiceInterface;
use App\Services\CurrencyService;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Repositories\CategoryRepository;
use App\Services\Contracts\CategoryServiceInterface;
use App\Services\CategoryService;
use App\Repositories\Contracts\SaleRepositoryInterface;
use App\Repositories\SaleRepository;
use App\Services\Contracts\SaleServiceInterface;
use App\Services\SaleService;
use App\Repositories\Contracts\AnalyticsRepositoryInterface;
use App\Repositories\AnalyticsRepository;
use App\Services\Contracts\AnalyticsServiceInterface;
use App\Services\AnalyticsService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Repository bindings
        $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
        $this->app->bind(ProviderRepositoryInterface::class, ProviderRepository::class);
        $this->app->bind(CurrencyRepositoryInterface::class, CurrencyRepository::class);
        $this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);
        $this->app->bind(SaleRepositoryInterface::class, SaleRepository::class);
        $this->app->bind(AnalyticsRepositoryInterface::class, AnalyticsRepository::class);

        // Service bindings
        $this->app->bind(ProductServiceInterface::class, ProductService::class);
        $this->app->bind(ProviderServiceInterface::class, ProviderService::class);
        $this->app->bind(CurrencyServiceInterface::class, CurrencyService::class);
        $this->app->bind(CategoryServiceInterface::class, CategoryService::class);
        $this->app->bind(SaleServiceInterface::class, SaleService::class);
        $this->app->bind(AnalyticsServiceInterface::class, AnalyticsService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}