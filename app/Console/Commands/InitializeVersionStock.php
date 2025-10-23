<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Services\ProductVersionStockService;
use Illuminate\Console\Command;

class InitializeVersionStock extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'version-stock:initialize';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Initialize version stock for existing products';

    protected ProductVersionStockService $versionStockService;

    public function __construct(ProductVersionStockService $versionStockService)
    {
        parent::__construct();
        $this->versionStockService = $versionStockService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Inicializando stock de versiones para productos existentes...');

        $products = Product::where('stock', '>', 0)->get();
        $count = 0;

        foreach ($products as $product) {
            $this->versionStockService->initializeVersionStockForProduct($product->id);
            $count++;
            $this->line("✓ Producto: {$product->name} (ID: {$product->id})");
        }

        $this->info("✅ Se inicializó el stock de versiones para {$count} productos.");
    }
}