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
        Schema::create('shared_inventory', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->integer('quantity')->default(0); // Cantidad que tiene este usuario
            $table->decimal('purchase_price', 10, 2)->nullable(); // Precio de compra individual
            $table->integer('version')->default(1); // Versión del producto
            $table->text('notes')->nullable(); // Notas sobre la división
            $table->timestamps();

            // Índices para mejorar el rendimiento
            $table->index(['product_id', 'user_id']);
            $table->index(['user_id', 'version']);
            $table->unique(['product_id', 'user_id', 'version']); // Un usuario no puede tener la misma versión del mismo producto duplicada
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shared_inventory');
    }
};
