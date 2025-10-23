<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Eliminar el índice único del SKU primero
            $table->dropUnique(['sku']);
            // Eliminar la columna SKU
            $table->dropColumn('sku');
            // Agregar la columna purchase_price (precio de compra)
            $table->decimal('purchase_price', 10, 2)->nullable()->after('price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Eliminar purchase_price
            $table->dropColumn('purchase_price');
            // Restaurar la columna SKU
            $table->string('sku')->unique()->after('name');
        });
    }
};
