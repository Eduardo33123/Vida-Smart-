<?php

namespace App\Http\Controllers;

use App\Services\Contracts\CategoryServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\ValidationException;

class CategoryController extends Controller
{
    protected CategoryServiceInterface $categoryService;

    public function __construct(CategoryServiceInterface $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Display a listing of categories
     */
    public function index(): Response
    {
        $categories = $this->categoryService->getHierarchicalCategories();
        $statistics = $this->categoryService->getCategoryStatistics();
        $allCategories = $this->categoryService->getCategoriesForSelect();

        return Inertia::render('Categorias', [
            'categories' => $categories,
            'statistics' => $statistics,
            'allCategories' => $allCategories,
        ]);
    }

    /**
     * Show the form for creating a new category
     */
    public function create(): Response
    {
        $rootCategories = $this->categoryService->getRootCategories();

        return Inertia::render('CategoryCreate', [
            'rootCategories' => $rootCategories,
        ]);
    }

    /**
     * Store a newly created category
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $category = $this->categoryService->createCategory($request->all());

            return redirect()->route('categorias')
                ->with('success', 'Categoría creada exitosamente');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Error al crear la categoría: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified category
     */
    public function show(int $id): Response
    {
        $category = $this->categoryService->getCategoryById($id);

        if (!$category) {
            abort(404, 'Categoría no encontrada');
        }

        // Cargar relaciones adicionales
        $category->load(['children.children', 'products.currency']);

        return Inertia::render('CategoryShow', [
            'category' => $category,
        ]);
    }

    /**
     * Show the form for editing the specified category
     */
    public function edit(int $id): Response
    {
        $category = $this->categoryService->getCategoryById($id);
        $rootCategories = $this->categoryService->getRootCategories();

        if (!$category) {
            abort(404, 'Categoría no encontrada');
        }

        return Inertia::render('CategoryEdit', [
            'category' => $category,
            'rootCategories' => $rootCategories,
        ]);
    }

    /**
     * Update the specified category
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        try {
            $category = $this->categoryService->updateCategory($id, $request->all());

            return redirect()->route('categorias')
                ->with('success', 'Categoría actualizada exitosamente');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Error al actualizar la categoría: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified category
     */
    public function destroy(int $id): RedirectResponse
    {
        try {
            $deleted = $this->categoryService->deleteCategory($id);

            if (!$deleted) {
                return back()->with('error', 'Categoría no encontrada');
            }

            return redirect()->route('categorias')
                ->with('success', 'Categoría eliminada exitosamente');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al eliminar la categoría: ' . $e->getMessage());
        }
    }

    /**
     * Get subcategories for a parent category (API endpoint)
     */
    public function getSubcategories(int $parentId): array
    {
        $subcategories = $this->categoryService->getSubcategories($parentId);

        return [
            'subcategories' => $subcategories,
        ];
    }
}
