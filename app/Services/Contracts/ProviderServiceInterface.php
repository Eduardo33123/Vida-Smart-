<?php

namespace App\Services\Contracts;

use App\Models\Provider;
use Illuminate\Database\Eloquent\Collection;

interface ProviderServiceInterface
{
    /**
     * Get all providers
     */
    public function getAllProviders(): Collection;

    /**
     * Get only active providers
     */
    public function getActiveProviders(): Collection;

    /**
     * Get provider by ID
     */
    public function getProviderById(int $id): ?Provider;

    /**
     * Create a new provider
     */
    public function createProvider(array $data): Provider;

    /**
     * Update provider
     */
    public function updateProvider(int $id, array $data): Provider;

    /**
     * Delete provider
     */
    public function deleteProvider(int $id): bool;

    /**
     * Validate provider data
     */
    public function validateProviderData(array $data, ?int $excludeId = null): array;

    /**
     * Get providers by currency
     */
    public function getProvidersByCurrency(int $currencyId): Collection;
}
