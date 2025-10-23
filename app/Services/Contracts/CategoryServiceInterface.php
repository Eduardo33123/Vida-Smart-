<?php

namespace App\Services\Contracts;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

interface CategoryServiceInterface
{
    /**
     * Get all categories
     */
    public function getAllCategories(): Collection;

    /**
     * Get only active categories
     */
    public function getActiveCategories(): Collection;

    /**
     * Get root categories (no parent)
     */
    public function getRootCategories(): Collection;

    /**
     * Get subcategories of a specific parent
     */
    public function getSubcategories(int $parentId): Collection;

    /**
     * Get category by ID
     */
    public function getCategoryById(int $id): ?Category;

    /**
     * Create a new category
     */
    public function createCategory(array $data): Category;

    /**
     * Update category
     */
    public function updateCategory(int $id, array $data): Category;

    /**
     * Delete category
     */
    public function deleteCategory(int $id): bool;

    /**
     * Validate category data
     */
    public function validateCategoryData(array $data, ?int $excludeId = null): array;

    /**
     * Get categories with their children (hierarchical)
     */
    public function getHierarchicalCategories(): Collection;

    /**
     * Get categories for select dropdown
     */
    public function getCategoriesForSelect(): Collection;

    /**
     * Get category tree (nested structure)
     */
    public function getCategoryTree(): Collection;

    /**
     * Get category statistics
     */
    public function getCategoryStatistics(): array;
}
