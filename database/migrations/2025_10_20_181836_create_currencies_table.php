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
        Schema::create('currencies', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nombre de la moneda (ej: "Dólar Americano")
            $table->string('code', 3)->unique(); // Código ISO (ej: "USD")
            $table->string('symbol', 5); // Símbolo (ej: "$")
            $table->boolean('is_active')->default(true); // Si está activa
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('currencies');
    }
};
