<?php

namespace App\Repositories;

use App\Models\Provider;
use App\Repositories\Contracts\ProviderRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ProviderRepository implements ProviderRepositoryInterface
{
    protected Provider $model;

    public function __construct(Provider $model)
    {
        $this->model = $model;
    }

    /**
     * Get all providers
     */
    public function getAll(): Collection
    {
        return $this->model->with('currency')->get();
    }

    /**
     * Get only active providers
     */
    public function getActive(): Collection
    {
        return $this->model->with('currency')->active()->get();
    }

    /**
     * Find provider by ID
     */
    public function findById(int $id): ?Provider
    {
        return $this->model->with('currency')->find($id);
    }

    /**
     * Find provider by email
     */
    public function findByEmail(string $email): ?Provider
    {
        return $this->model->where('email', $email)->first();
    }

    /**
     * Create a new provider
     */
    public function create(array $data): Provider
    {
        return $this->model->create($data);
    }

    /**
     * Update provider by ID
     */
    public function update(int $id, array $data): bool
    {
        $provider = $this->findById($id);
        
        if (!$provider) {
            return false;
        }

        return $provider->update($data);
    }

    /**
     * Delete provider by ID
     */
    public function delete(int $id): bool
    {
        $provider = $this->findById($id);
        
        if (!$provider) {
            return false;
        }

        return $provider->delete();
    }

    /**
     * Get providers by currency
     */
    public function getByCurrency(int $currencyId): Collection
    {
        return $this->model->with('currency')
                          ->where('currency_id', $currencyId)
                          ->get();
    }
}
