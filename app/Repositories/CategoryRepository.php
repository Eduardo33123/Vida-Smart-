<?php

namespace App\Repositories;

use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository implements CategoryRepositoryInterface
{
    protected Category $model;

    public function __construct(Category $model)
    {
        $this->model = $model;
    }

    /**
     * Get all categories
     */
    public function getAll(): Collection
    {
        return $this->model->with(['parent', 'children'])->orderBy('sort_order')->get();
    }

    /**
     * Get only active categories
     */
    public function getActive(): Collection
    {
        return $this->model->active()->with(['parent', 'children'])->orderBy('sort_order')->get();
    }

    /**
     * Get root categories (no parent)
     */
    public function getRootCategories(): Collection
    {
        return $this->model->root()->active()->with('children')->orderBy('sort_order')->get();
    }

    /**
     * Get subcategories of a specific parent
     */
    public function getSubcategories(int $parentId): Collection
    {
        return $this->model->where('parent_id', $parentId)
                          ->active()
                          ->with('parent')
                          ->orderBy('sort_order')
                          ->get();
    }

    /**
     * Find category by ID
     */
    public function findById(int $id): ?Category
    {
        return $this->model->with(['parent', 'children'])->find($id);
    }

    /**
     * Find category by name
     */
    public function findByName(string $name): ?Category
    {
        return $this->model->where('nombre', $name)->first();
    }

    /**
     * Create a new category
     */
    public function create(array $data): Category
    {
        return $this->model->create($data);
    }

    /**
     * Update category by ID
     */
    public function update(int $id, array $data): bool
    {
        $category = $this->findById($id);
        
        if (!$category) {
            return false;
        }

        return $category->update($data);
    }

    /**
     * Delete category by ID
     */
    public function delete(int $id): bool
    {
        $category = $this->findById($id);
        
        if (!$category) {
            return false;
        }

        return $category->delete();
    }

    /**
     * Get categories with their children (hierarchical)
     */
    public function getHierarchical(): Collection
    {
        return $this->model->root()
                          ->active()
                          ->with(['children' => function ($query) {
                              $query->active()->orderBy('sort_order');
                          }])
                          ->orderBy('sort_order')
                          ->get();
    }

    /**
     * Get categories for select dropdown
     */
    public function getForSelect(): Collection
    {
        return $this->model->active()
                          ->orderBy('sort_order')
                          ->get(['id', 'nombre', 'parent_id', 'icono']);
    }

    /**
     * Get category tree (nested structure)
     */
    public function getCategoryTree(): Collection
    {
        return $this->model->root()
                          ->active()
                          ->with(['descendants' => function ($query) {
                              $query->active()->orderBy('sort_order');
                          }])
                          ->orderBy('sort_order')
                          ->get();
    }
}
