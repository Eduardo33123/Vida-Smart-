<?php

namespace App\Services;

use App\Models\Provider;
use App\Repositories\Contracts\ProviderRepositoryInterface;
use App\Services\Contracts\ProviderServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ProviderService implements ProviderServiceInterface
{
    protected ProviderRepositoryInterface $providerRepository;

    public function __construct(ProviderRepositoryInterface $providerRepository)
    {
        $this->providerRepository = $providerRepository;
    }

    /**
     * Get all providers
     */
    public function getAllProviders(): Collection
    {
        return $this->providerRepository->getAll();
    }

    /**
     * Get only active providers
     */
    public function getActiveProviders(): Collection
    {
        return $this->providerRepository->getActive();
    }

    /**
     * Get provider by ID
     */
    public function getProviderById(int $id): ?Provider
    {
        return $this->providerRepository->findById($id);
    }

    /**
     * Create a new provider
     */
    public function createProvider(array $data): Provider
    {
        $validatedData = $this->validateProviderData($data);
        
        return $this->providerRepository->create($validatedData);
    }

    /**
     * Update provider
     */
    public function updateProvider(int $id, array $data): Provider
    {
        $validatedData = $this->validateProviderData($data, $id);
        
        $updated = $this->providerRepository->update($id, $validatedData);
        
        if (!$updated) {
            throw new \Exception('Provider not found or could not be updated');
        }

        return $this->providerRepository->findById($id);
    }

    /**
     * Delete provider
     */
    public function deleteProvider(int $id): bool
    {
        return $this->providerRepository->delete($id);
    }

    /**
     * Validate provider data
     */
    public function validateProviderData(array $data, ?int $excludeId = null): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'currency_id' => 'required|integer|exists:currencies,id',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ];

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $validator->validated();
    }

    /**
     * Get providers by currency
     */
    public function getProvidersByCurrency(int $currencyId): Collection
    {
        return $this->providerRepository->getByCurrency($currencyId);
    }
}
