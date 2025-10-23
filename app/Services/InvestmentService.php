<?php

namespace App\Services;

use App\Models\Investment;
use App\Models\Product;
use App\Repositories\Contracts\InvestmentRepositoryInterface;
use App\Services\Contracts\InvestmentServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;

class InvestmentService implements InvestmentServiceInterface
{
    protected $investmentRepository;

    public function __construct(InvestmentRepositoryInterface $investmentRepository)
    {
        $this->investmentRepository = $investmentRepository;
    }

    /**
     * Get all investments
     */
    public function getAllInvestments(): Collection
    {
        return $this->investmentRepository->getAll();
    }

    /**
     * Get investment by ID
     */
    public function getInvestmentById(int $id): ?Investment
    {
        return $this->investmentRepository->getById($id);
    }

    /**
     * Create a new investment
     */
    public function createInvestment(array $data): Investment
    {
        $validatedData = $this->validateInvestmentData($data);
        return $this->investmentRepository->create($validatedData);
    }

    /**
     * Update an investment
     */
    public function updateInvestment(int $id, array $data): bool
    {
        $validatedData = $this->validateInvestmentData($data, $id);
        return $this->investmentRepository->update($id, $validatedData);
    }

    /**
     * Delete an investment
     */
    public function deleteInvestment(int $id): bool
    {
        return $this->investmentRepository->delete($id);
    }

    /**
     * Get investments by product ID
     */
    public function getInvestmentsByProductId(int $productId): Collection
    {
        return $this->investmentRepository->getByProductId($productId);
    }

    /**
     * Get investment statistics
     */
    public function getInvestmentStatistics(): array
    {
        return $this->investmentRepository->getInvestmentStatistics();
    }

    /**
     * Validate investment data
     */
    public function validateInvestmentData(array $data, ?int $excludeId = null): array
    {
        $rules = [
            'provider_id' => 'nullable|integer|exists:providers,id',
            'quantity_added' => 'required|integer|min:1',
            'unit_cost' => 'required|numeric|min:0',
            'total_cost' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
            'investment_date' => 'required|date',
        ];

        // If creating a new product, validate product fields
        if (isset($data['newProduct']) && ($data['newProduct'] == 1 || $data['newProduct'] === true)) {
            $rules = array_merge($rules, [
                'name' => 'required|string|max:255',
                'category_id' => 'required|integer|exists:categories,id',
                'currency_id' => 'required|integer|exists:currencies,id',
                'price' => 'required|numeric|min:0',
                'description' => 'nullable|string',
                'image' => 'nullable|url',
            ]);
        } else {
            // If using existing product, validate product_id
            $rules['product_id'] = 'required|integer|exists:products,id';
        }

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $validator->validated();
    }

    /**
     * Process investment and update product stock
     */
    public function processInvestment(array $data): Investment
    {
        Log::info('InvestmentService::processInvestment - Datos recibidos:', $data);

        return DB::transaction(function () use ($data) {
            // Check if we need to create a new product
            if (isset($data['newProduct']) && ($data['newProduct'] == 1 || $data['newProduct'] === true)) {
                Log::info('Creando producto nuevo');
                // Create new product first
                $productData = [
                    'name' => $data['name'],
                    'category_id' => $data['category_id'],
                    'currency_id' => $data['currency_id'],
                    'price' => $data['price'],
                    'purchase_price' => $data['unit_cost'],
                    'stock' => $data['quantity_added'],
                    'description' => $data['description'] ?? '',
                    'image' => $data['image'] ?? '',
                ];

                $product = Product::create($productData);
                $data['product_id'] = $product->id;
            }

            // Validate the investment data
            $validatedData = $this->validateInvestmentData($data);

            // Create the investment record
            $investment = $this->investmentRepository->create($validatedData);

            // Update the product stock (only if not a new product)
            if (!isset($data['newProduct']) || ($data['newProduct'] != 1 && $data['newProduct'] !== true)) {
                $product = Product::find($validatedData['product_id']);
                if ($product) {
                    $product->increment('stock', $validatedData['quantity_added']);

                    // Update purchase price if provided and different from current
                    if (isset($validatedData['unit_cost']) && $validatedData['unit_cost'] > 0) {
                        $product->update(['purchase_price' => $validatedData['unit_cost']]);
                    }
                }
            }

            return $investment->load(['product.category', 'product.currency', 'provider']);
        });
    }
}