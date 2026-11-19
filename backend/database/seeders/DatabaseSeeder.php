<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (User::query()->exists()) {
            return;
        }

        $this->call(ContentSeeder::class);

        User::query()->create([
            'name' => 'Administração L.P.F',
            'email' => 'admin@lpf.local',
            'password' => 'LagoParanoa2022',
            'email_verified_at' => now(),
        ]);
    }
}
