<?php

namespace App\Repositories;

use App\Models\Currency;
use App\Repositories\Contracts\CurrencyRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CurrencyRepository implements CurrencyRepositoryInterface
{
    protected Currency $model;

    public function __construct(Currency $model)
    {
        $this->model = $model;
    }

    /**
     * Get all currencies
     */
    public function getAll(): Collection
    {
        return $this->model->all();
    }

    /**
     * Get only active currencies
     */
    public function getActive(): Collection
    {
        return $this->model->active()->get();
    }

    /**
     * Find currency by ID
     */
    public function findById(int $id): ?Currency
    {
        return $this->model->find($id);
    }

    /**
     * Find currency by code
     */
    public function findByCode(string $code): ?Currency
    {
        return $this->model->where('code', $code)->first();
    }

    /**
     * Create a new currency
     */
    public function create(array $data): Currency
    {
        return $this->model->create($data);
    }

    /**
     * Update currency by ID
     */
    public function update(int $id, array $data): bool
    {
        $currency = $this->findById($id);

        if (!$currency) {
            return false;
        }

        return $currency->update($data);
    }

    /**
     * Delete currency by ID
     */
    public function delete(int $id): bool
    {
        $currency = $this->findById($id);

        if (!$currency) {
            return false;
        }

        return $currency->delete();
    }
}