<?php

namespace App\Http\Controllers;

use App\Services\Contracts\InvestmentServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class InvestmentController extends Controller
{
    protected $investmentService;

    public function __construct(InvestmentServiceInterface $investmentService)
    {
        $this->investmentService = $investmentService;
    }

    /**
     * Display a listing of investments
     */
    public function index(): Response
    {
        $investments = $this->investmentService->getAllInvestments();
        $statistics = $this->investmentService->getInvestmentStatistics();
        $products = \App\Models\Product::with(['category', 'currency'])->get();
        $providers = \App\Models\Provider::active()->get();
        $categories = \App\Models\Category::all();
        $currencies = \App\Models\Currency::active()->get();

        return Inertia::render('Inversion', [
            'investments' => $investments,
            'statistics' => $statistics,
            'products' => $products,
            'providers' => $providers,
            'categories' => $categories,
            'currencies' => $currencies,
        ]);
    }

    /**
     * Store a newly created investment
     */
    public function store(Request $request)
    {
        try {
            Log::info('InvestmentController::store - Datos recibidos:', $request->all());
            Log::info('InvestmentController::store - newProduct específico:', ['newProduct' => $request->input('newProduct')]);
            Log::info('InvestmentController::store - Todos los inputs:', $request->input());
            Log::info('InvestmentController::store - Headers:', $request->headers->all());
            Log::info('InvestmentController::store - Content-Type:', ['content_type' => $request->header('Content-Type')]);
            $investment = $this->investmentService->processInvestment($request->all());

            Log::info('InvestmentController::store - Inversión creada exitosamente:', ['investment_id' => $investment->id]);

            return redirect()->route('inversion')->with('success', 'Inversión registrada exitosamente. Stock actualizado.');
        } catch (\Exception $e) {
            Log::error('InvestmentController::store - Error:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return redirect()->route('inversion')->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified investment
     */
    public function show(int $id): Response
    {
        $investment = $this->investmentService->getInvestmentById($id);

        if (!$investment) {
            abort(404);
        }

        return Inertia::render('InvestmentShow', [
            'investment' => $investment,
        ]);
    }

    /**
     * Update the specified investment
     */
    public function update(Request $request, int $id)
    {
        try {
            $this->investmentService->updateInvestment($id, $request->all());

            return redirect()->back()->with('success', 'Inversión actualizada exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified investment
     */
    public function destroy(int $id)
    {
        try {
            $this->investmentService->deleteInvestment($id);

            return redirect()->back()->with('success', 'Inversión eliminada exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}