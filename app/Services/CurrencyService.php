<?php

namespace App\Services;

use App\Models\Currency;
use App\Repositories\Contracts\CurrencyRepositoryInterface;
use App\Services\Contracts\CurrencyServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class CurrencyService implements CurrencyServiceInterface
{
    protected CurrencyRepositoryInterface $currencyRepository;

    public function __construct(CurrencyRepositoryInterface $currencyRepository)
    {
        $this->currencyRepository = $currencyRepository;
    }

    /**
     * Get all currencies
     */
    public function getAllCurrencies(): Collection
    {
        return $this->currencyRepository->getAll();
    }

    /**
     * Get only active currencies
     */
    public function getActiveCurrencies(): Collection
    {
        return $this->currencyRepository->getActive();
    }

    /**
     * Get currency by ID
     */
    public function getCurrencyById(int $id): ?Currency
    {
        return $this->currencyRepository->findById($id);
    }

    /**
     * Create a new currency
     */
    public function createCurrency(array $data): Currency
    {
        $validatedData = $this->validateCurrencyData($data);
        
        return $this->currencyRepository->create($validatedData);
    }

    /**
     * Update currency
     */
    public function updateCurrency(int $id, array $data): Currency
    {
        $validatedData = $this->validateCurrencyData($data, $id);
        
        $updated = $this->currencyRepository->update($id, $validatedData);
        
        if (!$updated) {
            throw new \Exception('Currency not found or could not be updated');
        }

        return $this->currencyRepository->findById($id);
    }

    /**
     * Delete currency
     */
    public function deleteCurrency(int $id): bool
    {
        return $this->currencyRepository->delete($id);
    }

    /**
     * Validate currency data
     */
    public function validateCurrencyData(array $data, ?int $excludeId = null): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'code' => 'required|string|size:3|unique:currencies,code' . ($excludeId ? ",{$excludeId}" : ''),
            'symbol' => 'required|string|max:5',
            'is_active' => 'boolean',
        ];

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $validator->validated();
    }
}
