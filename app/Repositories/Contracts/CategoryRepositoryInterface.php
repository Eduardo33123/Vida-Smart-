<?php

namespace App\Repositories\Contracts;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

interface CategoryRepositoryInterface
{
    /**
     * Get all categories
     */
    public function getAll(): Collection;

    /**
     * Get only active categories
     */
    public function getActive(): Collection;

    /**
     * Get root categories (no parent)
     */
    public function getRootCategories(): Collection;

    /**
     * Get subcategories of a specific parent
     */
    public function getSubcategories(int $parentId): Collection;

    /**
     * Find category by ID
     */
    public function findById(int $id): ?Category;

    /**
     * Find category by name
     */
    public function findByName(string $name): ?Category;

    /**
     * Create a new category
     */
    public function create(array $data): Category;

    /**
     * Update category by ID
     */
    public function update(int $id, array $data): bool;

    /**
     * Delete category by ID
     */
    public function delete(int $id): bool;

    /**
     * Get categories with their children (hierarchical)
     */
    public function getHierarchical(): Collection;

    /**
     * Get categories for select dropdown
     */
    public function getForSelect(): Collection;

    /**
     * Get category tree (nested structure)
     */
    public function getCategoryTree(): Collection;
}
