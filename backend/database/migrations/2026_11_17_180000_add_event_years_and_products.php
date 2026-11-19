<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->unsignedSmallInteger('year')->default(2022)->index()->after('status');
        });

        foreach (DB::table('events')->select('id', 'starts_at')->get() as $event) {
            $year = $event->starts_at ? (int) date('Y', strtotime((string) $event->starts_at)) : 2022;
            DB::table('events')->where('id', $event->id)->update(['year' => $year]);
        }

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category')->nullable();
            $table->string('summary', 400);
            $table->longText('body');
            $table->decimal('price', 10, 2)->nullable();
            $table->string('availability', 30)->default('sob_encomenda');
            $table->string('link')->nullable();
            $table->string('image_path')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        if (DB::table('products')->count() === 0) {
            $now = now();
            DB::table('products')->insert([
                [
                    'name' => 'Camiseta L.P.F',
                    'slug' => 'camiseta-lpf',
                    'category' => 'Vestuário',
                    'summary' => 'A camiseta do grupo, com o emblema do pôr do sol no Paranoá.',
                    'body' => "Peça do Lago Paranoá Fishing. Tamanho, cor e valor ficam com a administração: enquanto o preço não for publicado, o pedido é sob consulta.\n\nO desenho é o do emblema — barco, ponte e o fim de tarde no lago.",
                    'price' => null,
                    'availability' => 'sob_encomenda',
                    'link' => null,
                    'image_path' => null,
                    'position' => 1,
                    'active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'name' => 'Boné L.P.F',
                    'slug' => 'bone-lpf',
                    'category' => 'Vestuário',
                    'summary' => 'Boné do grupo para a beira do lago e para o barco.',
                    'body' => "Boné com a marca do L.P.F. A administração publica o valor e o jeito de pedir quando a peça estiver pronta para sair.\n\nAté lá, a ficha fica sob consulta.",
                    'price' => null,
                    'availability' => 'sob_encomenda',
                    'link' => null,
                    'image_path' => null,
                    'position' => 2,
                    'active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'name' => 'Adesivo do emblema',
                    'slug' => 'adesivo-do-emblema',
                    'category' => 'Acessório',
                    'summary' => 'O emblema do L.P.F para colar no barco, no caiaque ou na caixa.',
                    'body' => "Adesivo com o emblema do grupo: L.P.F, o pôr do sol no Paranoá e o desde 2022.\n\nMedida e preço são definidos no painel. Sem preço publicado, a peça segue sob consulta.",
                    'price' => null,
                    'availability' => 'sob_encomenda',
                    'link' => null,
                    'image_path' => null,
                    'position' => 3,
                    'active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('year');
        });
    }
};
