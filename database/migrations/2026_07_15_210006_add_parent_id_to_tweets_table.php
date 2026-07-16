<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tweets', function (Blueprint $table) {
            if (! Schema::hasColumn('tweets', 'parent_id')) {
                $table->foreignId('parent_id')->nullable()->constrained('tweets')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('tweets', function (Blueprint $table) {
            if (Schema::hasColumn('tweets', 'parent_id')) {
                $table->dropForeign(['parent_id']);
                $table->dropColumn('parent_id');
            }
        });
    }
};
