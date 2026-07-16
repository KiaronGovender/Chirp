<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'username')) {
                $table->string('username')->unique()->after('name');
            }
        });

        // Backfill existing users with a username based on name if empty
        if (app()->runningInConsole()) {
            try {
                DB::table('users')->whereNull('username')->get()->each(function ($user) {
                    $username = preg_replace('/[^A-Za-z0-9_\-]/', '', strtolower($user->name));
                    $username = substr($username ?: 'user', 0, 50);
                    // Ensure uniqueness by appending id if needed
                    $exists = DB::table('users')->where('username', $username)->exists();
                    if ($exists) {
                        $username = $username.$user->id;
                    }
                    DB::table('users')->where('id', $user->id)->update(['username' => $username]);
                });
            } catch (Exception $e) {
                // best-effort backfill; ignore failures in some environments
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'username')) {
                $table->dropColumn('username');
            }
        });
    }
};
