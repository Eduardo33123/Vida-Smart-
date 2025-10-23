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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nombre del producto
            $table->string('sku')->unique(); // Código único del producto
            $table->unsignedBigInteger('category_id'); // Categoría del producto
            $table->decimal('price', 10, 2); // Precio de venta
            $table->integer('stock')->default(0); // Cantidad disponible
            $table->text('description')->nullable(); // Descripción del producto
            $table->string('image')->nullable(); // URL de la imagen
            $table->timestamps();

            // Índices para mejorar el rendimiento
            $table->index('category_id');
            $table->index('sku');
            $table->index('stock');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
