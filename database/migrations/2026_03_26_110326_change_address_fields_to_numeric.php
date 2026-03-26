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
        Schema::table('addresses', function (Blueprint $table) {
            $table->integer('number')->change();
            $table->string('zip_code')->change(); // Wait, user said zipcode too should be number.
            // Actually, keep strings in DB but validate as numeric?
            // User said: "no number quero que seja numero, zipcode também"
            // If I change DB type to integer, I'll use:
        });

        Schema::table('addresses', function (Blueprint $table) {
            $table->integer('zip_code')->change();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->integer('number')->change();
            $table->integer('zip_code')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->string('number')->change();
            $table->string('zip_code')->change();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->string('number')->change();
            $table->string('zip_code')->change();
        });
    }
};
