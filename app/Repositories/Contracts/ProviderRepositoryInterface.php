<?php

namespace App\Repositories\Contracts;

use App\Models\Provider;
use Illuminate\Database\Eloquent\Collection;

interface ProviderRepositoryInterface
{
    /**
     * Get all providers
     */
    public function getAll(): Collection;

    /**
     * Get only active providers
     */
    public function getActive(): Collection;

    /**
     * Find provider by ID
     */
    public function findById(int $id): ?Provider;

    /**
     * Find provider by email
     */
    public function findByEmail(string $email): ?Provider;

    /**
     * Create a new provider
     */
    public function create(array $data): Provider;

    /**
     * Update provider by ID
     */
    public function update(int $id, array $data): bool;

    /**
     * Delete provider by ID
     */
    public function delete(int $id): bool;

    /**
     * Get providers by currency
     */
    public function getByCurrency(int $currencyId): Collection;
}
