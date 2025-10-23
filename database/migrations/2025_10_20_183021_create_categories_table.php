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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // Nombre de la categoría
            $table->text('descripcion')->nullable(); // Descripción de la categoría
            $table->unsignedBigInteger('parent_id')->nullable(); // Categoría padre (para jerarquía)
            $table->string('icono', 10)->default('📂'); // Icono para la categoría
            $table->boolean('is_active')->default(true); // Si está activa
            $table->integer('sort_order')->default(0); // Orden de visualización
            $table->timestamps();

            // Foreign key constraint para jerarquía
            $table->foreign('parent_id')->references('id')->on('categories')->onDelete('cascade');
            
            // Índices
            $table->index('parent_id');
            $table->index('is_active');
            $table->index('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
