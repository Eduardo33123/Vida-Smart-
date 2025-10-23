<?php

namespace App\Repositories;

use App\Models\Investment;
use App\Repositories\Contracts\InvestmentRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class InvestmentRepository implements InvestmentRepositoryInterface
{
    protected $model;

    public function __construct(Investment $model)
    {
        $this->model = $model;
    }

    /**
     * Get all investments
     */
    public function getAll(): Collection
    {
        return $this->model->with(['product.category', 'product.currency', 'provider'])
            ->orderBy('investment_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get investment by ID
     */
    public function getById(int $id): ?Investment
    {
        return $this->model->with(['product.category', 'product.currency', 'provider'])->find($id);
    }

    /**
     * Create a new investment
     */
    public function create(array $data): Investment
    {
        return $this->model->create($data);
    }

    /**
     * Update an investment
     */
    public function update(int $id, array $data): bool
    {
        $investment = $this->model->find($id);
        if (!$investment) {
            return false;
        }
        return $investment->update($data);
    }

    /**
     * Delete an investment
     */
    public function delete(int $id): bool
    {
        $investment = $this->model->find($id);
        if (!$investment) {
            return false;
        }
        return $investment->delete();
    }

    /**
     * Get investments by product ID
     */
    public function getByProductId(int $productId): Collection
    {
        return $this->model->with(['product.category', 'product.currency', 'provider'])
            ->where('product_id', $productId)
            ->orderBy('investment_date', 'desc')
            ->get();
    }

    /**
     * Get investments by provider ID
     */
    public function getByProviderId(int $providerId): Collection
    {
        return $this->model->with(['product.category', 'product.currency', 'provider'])
            ->where('provider_id', $providerId)
            ->orderBy('investment_date', 'desc')
            ->get();
    }

    /**
     * Get investments within date range
     */
    public function getByDateRange(string $startDate, string $endDate): Collection
    {
        return $this->model->with(['product.category', 'product.currency', 'provider'])
            ->whereBetween('investment_date', [$startDate, $endDate])
            ->orderBy('investment_date', 'desc')
            ->get();
    }

    /**
     * Get total investment amount
     */
    public function getTotalInvestmentAmount(): float
    {
        return $this->model->sum('total_cost');
    }

    /**
     * Get investment statistics
     */
    public function getInvestmentStatistics(): array
    {
        $totalInvestments = $this->model->count();
        $totalAmount = $this->getTotalInvestmentAmount();
        $totalQuantity = $this->model->sum('quantity_added');

        // Get top 5 products by investment amount
        $topProducts = $this->model->selectRaw('product_id, SUM(total_cost) as total_invested, SUM(quantity_added) as total_quantity')
            ->with('product')
            ->groupBy('product_id')
            ->orderBy('total_invested', 'desc')
            ->limit(5)
            ->get();

        // Get investments by month (last 6 months)
        $monthlyInvestments = $this->model->selectRaw('DATE_FORMAT(investment_date, "%Y-%m") as month, SUM(total_cost) as total')
            ->where('investment_date', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return [
            'total_investments' => $totalInvestments,
            'total_amount' => $totalAmount,
            'total_quantity' => $totalQuantity,
            'top_products' => $topProducts,
            'monthly_investments' => $monthlyInvestments,
        ];
    }
}
