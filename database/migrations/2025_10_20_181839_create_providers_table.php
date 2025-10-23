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
        Schema::create('providers', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nombre del proveedor
            $table->string('email')->nullable(); // Email del proveedor (opcional)
            $table->unsignedBigInteger('currency_id'); // Moneda preferida
            $table->text('description')->nullable(); // Descripción del proveedor (opcional)
            $table->boolean('is_active')->default(true); // Si está activo
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('currency_id')->references('id')->on('currencies')->onDelete('cascade');

            // Índices
            $table->index('currency_id');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('providers');
    }
};
