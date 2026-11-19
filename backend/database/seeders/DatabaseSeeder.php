<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (User::query()->exists()) {
            return;
        }

        $email = env('ADMIN_EMAIL', 'admin@lpf.local');
        $password = env('ADMIN_PASSWORD');
        if (! is_string($password) || strlen($password) < 8) {
            if (! app()->environment('local')) {
                throw new RuntimeException('Defina ADMIN_PASSWORD no .env antes de semear o administrador.');
            }
            $password = 'LagoParanoa2022';
        }

        $this->call(ContentSeeder::class);

        User::query()->create([
            'name' => env('ADMIN_NAME', 'Administração L.P.F'),
            'email' => $email,
            'password' => $password,
            'email_verified_at' => now(),
        ]);
    }
}
