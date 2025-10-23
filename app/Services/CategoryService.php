<?php

namespace App\Services;

use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Services\Contracts\CategoryServiceInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class CategoryService implements CategoryServiceInterface
{
    protected CategoryRepositoryInterface $categoryRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    /**
     * Get all categories
     */
    public function getAllCategories(): Collection
    {
        return $this->categoryRepository->getAll();
    }

    /**
     * Get only active categories
     */
    public function getActiveCategories(): Collection
    {
        return $this->categoryRepository->getActive();
    }

    /**
     * Get root categories (no parent)
     */
    public function getRootCategories(): Collection
    {
        return $this->categoryRepository->getRootCategories();
    }

    /**
     * Get subcategories of a specific parent
     */
    public function getSubcategories(int $parentId): Collection
    {
        return $this->categoryRepository->getSubcategories($parentId);
    }

    /**
     * Get category by ID
     */
    public function getCategoryById(int $id): ?Category
    {
        return $this->categoryRepository->findById($id);
    }

    /**
     * Create a new category
     */
    public function createCategory(array $data): Category
    {
        $validatedData = $this->validateCategoryData($data);
        
        return $this->categoryRepository->create($validatedData);
    }

    /**
     * Update category
     */
    public function updateCategory(int $id, array $data): Category
    {
        $validatedData = $this->validateCategoryData($data, $id);
        
        $updated = $this->categoryRepository->update($id, $validatedData);
        
        if (!$updated) {
            throw new \Exception('Category not found or could not be updated');
        }

        return $this->categoryRepository->findById($id);
    }

    /**
     * Delete category
     */
    public function deleteCategory(int $id): bool
    {
        return $this->categoryRepository->delete($id);
    }

    /**
     * Validate category data
     */
    public function validateCategoryData(array $data, ?int $excludeId = null): array
    {
        $rules = [
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'parent_id' => 'nullable|integer|exists:categories,id',
            'icono' => 'required|string|max:10',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ];

        // Prevent self-reference
        if (isset($data['parent_id']) && $excludeId && $data['parent_id'] == $excludeId) {
            throw new \Exception('Una categoría no puede ser padre de sí misma');
        }

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $validator->validated();
    }

    /**
     * Get categories with their children (hierarchical)
     */
    public function getHierarchicalCategories(): Collection
    {
        return $this->categoryRepository->getHierarchical();
    }

    /**
     * Get categories for select dropdown
     */
    public function getCategoriesForSelect(): Collection
    {
        return $this->categoryRepository->getForSelect();
    }

    /**
     * Get category tree (nested structure)
     */
    public function getCategoryTree(): Collection
    {
        return $this->categoryRepository->getCategoryTree();
    }

    /**
     * Get category statistics
     */
    public function getCategoryStatistics(): array
    {
        $categories = $this->getAllCategories();
        
        return [
            'total_categories' => $categories->count(),
            'root_categories' => $categories->where('parent_id', null)->count(),
            'subcategories' => $categories->where('parent_id', '!=', null)->count(),
            'active_categories' => $categories->where('is_active', true)->count(),
            'inactive_categories' => $categories->where('is_active', false)->count(),
        ];
    }
}
