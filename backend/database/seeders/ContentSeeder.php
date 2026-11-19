<?php

namespace Database\Seeders;

use App\Models\ClubRule;
use App\Models\Faq;
use App\Models\FishingEvent;
use App\Models\Post;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Species;
use Illuminate\Database\Seeder;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->settings();
        $this->rules();
        $this->events();
        $this->products();
        $this->species();
        $this->posts();
        $this->faqs();
    }

    private function settings(): void
    {
        $settings = [
            'group_name' => 'Lago Paranoá Fishing',
            'short_name' => 'L.P.F',
            'tagline' => 'Cem por cento pesca.',
            'lede' => 'Grupo de pesca do Lago Paranoá, aberto em 23 de novembro de 2022, às 15:02, por Lucas Rafael Dutra Silva, o Galegão da Pesca. Sem distinção. Sem assunto fora da pescaria.',
            'seo_description' => 'L.P.F — Lago Paranoá Fishing. Grupo de pesca criado em Brasília no dia 23 de novembro de 2022, às 15:02, pelo Galegão da Pesca.',
            'founder_name' => 'Lucas Rafael Dutra Silva',
            'founder_nickname' => 'Galegão da Pesca',
            'founded_date_label' => '23 de novembro de 2022',
            'founded_time_label' => '15:02',
            'city' => 'Brasília — DF',
            'water' => 'Lago Paranoá',
            'about' => <<<'TXT'
O L.P.F começa numa hora exata. Em 23 de novembro de 2022, às 15:02, Lucas Rafael Dutra Silva — conhecido como Galegão da Pesca — abre um grupo para quem pesca o Lago Paranoá.

O combinado cabe numa frase e não muda de dono: aqui se fala de pesca. Não há distinção entre quem chega de barco, de caiaque ou da margem, nem entre quem está começando e quem já conhece o lago de cor. Futebol, religião e política não atravessam a conversa.

O emblema carrega o fim de tarde no Paranoá, a ponte de três arcos e o barco com a equipe. É o retrato do grupo: água, cidade e gente pescando.
TXT,
            'pillars' => "Sem distinção\nSem futebol\nSem religião\nSem política\nSó a pesca",
            'manifesto' => 'O lago é o assunto. O respeito é a regra de quem sobe no barco e de quem fica na margem.',
            'join_text' => <<<'TXT'
A participação é pelo grupo. Quando a administração abre entrada, o link fica publicado nesta página.

Entra quem vem falar de pesca — vara, isca, vento, estrutura, o que comeu e o que escapou. O resto a gente deixa na margem.
TXT,
            'join_note' => 'O link ainda não foi publicado. Assim que estiver no ar, o botão de entrada aparece aqui.',
            'whatsapp_url' => null,
            'instagram_url' => null,
            'contact_email' => null,
        ];

        foreach ($settings as $key => $value) {
            Setting::query()->updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }

    private function rules(): void
    {
        $rules = [
            [
                'O assunto é pesca',
                'Futebol, religião e política não entram. O grupo é de pescaria, do primeiro bom-dia ao último relato do dia.',
            ],
            [
                'Sem distinção',
                'Barco, caiaque, margem, equipamento simples ou completo, iniciante ou rodado: todo mundo é tratado do mesmo jeito.',
            ],
            [
                'Respeito no lago e no grupo',
                'Discordar de isca e de técnica faz parte. Desrespeito, exposição e provocação não.',
            ],
            [
                'O Paranoá tem regra',
                'Licença, limite e o cuidado com o lago vêm antes do peixe. Pescar aqui é também devolver o lugar inteiro.',
            ],
            [
                'Encontro marcado é compromisso',
                'Confirmou, aparece. Se não puder, avisa com tempo para ninguém ficar esperando na rampa.',
            ],
            [
                'O que é da pescaria fica entre quem pesca',
                'Ponto, horário e condição se compartilham com quem está na água. Print, exposição e fofoca ficam de fora.',
            ],
        ];

        foreach ($rules as $index => [$title, $body]) {
            ClubRule::query()->updateOrCreate(
                ['title' => $title],
                ['body' => $body, 'position' => $index + 1, 'active' => true],
            );
        }
    }

    private function events(): void
    {
        FishingEvent::query()->updateOrCreate(
            ['slug' => 'fundacao-do-lpf'],
            [
                'title' => 'Fundação do L.P.F',
                'location' => 'Brasília — DF',
                'summary' => 'O grupo nasce, criado pelo Galegão da Pesca, numa terça-feira às 15:02.',
                'body' => <<<'TXT'
Às 15:02 de 23 de novembro de 2022, Lucas Rafael Dutra Silva cria o L.P.F. Não foi um torneio e não foi anúncio de loja. Foi a abertura de um espaço só de pesca, no Lago Paranoá, sem distinção entre as pessoas e sem conversa de futebol, religião ou política.

Esse horário fica como marco do grupo. Os encontros que vierem depois são publicados aqui pela administração.
TXT,
                'starts_at' => '2022-11-23 15:02:00',
                'ends_at' => null,
                'status' => 'realizado',
                'year' => 2022,
                'active' => true,
            ],
        );
    }

    private function products(): void
    {
        $items = [
            [
                'camiseta-lpf',
                'Camiseta L.P.F',
                'Vestuário',
                'A camiseta do grupo, com o emblema do pôr do sol no Paranoá.',
                "Peça do Lago Paranoá Fishing. Tamanho, cor e valor ficam com a administração: enquanto o preço não for publicado, o pedido é sob consulta.\n\nO desenho é o do emblema — barco, ponte e o fim de tarde no lago.",
            ],
            [
                'bone-lpf',
                'Boné L.P.F',
                'Vestuário',
                'Boné do grupo para a beira do lago e para o barco.',
                "Boné com a marca do L.P.F. A administração publica o valor e o jeito de pedir quando a peça estiver pronta para sair.\n\nAté lá, a ficha fica sob consulta.",
            ],
            [
                'adesivo-do-emblema',
                'Adesivo do emblema',
                'Acessório',
                'O emblema do L.P.F para colar no barco, no caiaque ou na caixa.',
                "Adesivo com o emblema do grupo: L.P.F, o pôr do sol no Paranoá e o desde 2022.\n\nMedida e preço são definidos no painel. Sem preço publicado, a peça segue sob consulta.",
            ],
        ];

        foreach ($items as $index => [$slug, $name, $category, $summary, $body]) {
            Product::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'category' => $category,
                    'summary' => $summary,
                    'body' => $body,
                    'availability' => 'sob_encomenda',
                    'position' => $index + 1,
                    'active' => true,
                ],
            );
        }
    }

    private function species(): void
    {
        $items = [
            [
                'tucunare',
                'Tucunaré',
                'Cichla spp.',
                'O peixe que puxa a conversa no Paranoá. Predador de meia-água, briga curta e resposta boa de superfície no começo e no fim do dia.',
                <<<'TXT'
No Lago Paranoá, o tucunaré é o nome que abre quase todo relato. A pescaria costuma falar do azul e do amarelo, conforme o ponto, a água e a época.

O horário que a galera mais tenta é a primeira luz e o fim de tarde, quando a superfície ainda conversa. Isca de hélice, stick e soft são ponto de partida — o lago muda, e o que funcionou ontem não é lei.

Este texto é referência editável. A administração ajusta quando a pescaria ensina coisa nova.
TXT,
                'Superfície no começo e no fim do dia; meia-água quando o sol está alto.',
                'Primeira luz e fim de tarde',
            ],
            [
                'tilapia',
                'Tilápia',
                'Oreochromis niloticus',
                'Abundante no lago, briguenta na linha fina e presente o ano inteiro.',
                <<<'TXT'
A tilápia sustenta muita pescaria de margem e de barco no Paranoá. Não é troféu de cartaz, mas dá trabalho e responde bem quando a mão está afinada.

Massa, milho e pequenos artificiais entram na conversa, conforme a época e o ponto. O grupo trata o peixe com o mesmo respeito que dá ao tucunaré: soltou ou levou, o relato é de pesca.
TXT,
                'Massa, milho e artificiais pequenos, conforme o ponto.',
                'O ano inteiro',
            ],
            [
                'traira',
                'Traíra',
                'Hoplias malabaricus',
                'Emboscada de beira de estrutura. Gosta de capa, galhada e o fim de tarde.',
                <<<'TXT'
A traíra não passeia no meio do lago à procura de plateia. Ela espera. Estrutura, sombra e o final do dia são o cenário clássico.

Isca viva e artificial de hélices são a conversa de sempre. O ataque é curto e a boquinha pede anzol à altura — detalhe que o grupo gosta de lembrar antes de alguém perder o peixe na beira.
TXT,
                'Isca viva e artificiais com hélice.',
                'Fim de tarde e dias cobertos',
            ],
            [
                'cara',
                'Cará',
                'Cichlidae',
                'Peixe de estrutura, miúdo e esperto. Bom para afinar a mão e para a pescaria de margem.',
                <<<'TXT'
Cará, no Paranoá, é nome de vários ciclídeos de beira. Não cabe uma espécie só no cartaz, e o grupo pode detalhar isso quando quiser.

É pescaria de atenção: estrutura, linha mais leve e o peixe que ensina a criança — e o adulto teimoso — a esperar o toque certo.
TXT,
                'Minhocas, milho e pequenos artificiais.',
                'Dia inteiro, perto de estrutura',
            ],
            [
                'lambari',
                'Lambari',
                'Astyanax spp.',
                'A isca viva de muita pescaria e também o peixe de quem está ensinando alguém a segurar a vara.',
                <<<'TXT'
O lambari sustenta duas conversas no grupo: a isca que vai na traíra e no tucunaré, e a pescaria miúda de quem está chegando.

Não é espécie de foto grande. É espécie de lago vivo. Quem pesca o Paranoá com frequência cruza com ele.
TXT,
                'Massa e milho, em equipamento leve.',
                'Manhã',
            ],
            [
                'bagre-africano',
                'Bagre-africano',
                'Clarias gariepinus',
                'Espécie exótica no Distrito Federal. Quando sobe, o assunto é manejo, não aplauso.',
                <<<'TXT'
O bagre-africano aparece na pesca do Paranoá e não entra na lista como troféu. É espécie exótica, e o papo sério em volta dele é o que fazer quando vem na linha.

A administração pode completar esta ficha com a orientação que o grupo adotar. O espaço está aqui para informação, não para festa.
TXT,
                'Iscas de fundo, em geral no fim do dia e à noite.',
                'Noite',
            ],
        ];

        foreach ($items as $index => $item) {
            [$slug, $name, $scientific, $summary, $body, $bait, $period] = $item;

            Species::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'scientific_name' => $scientific,
                    'summary' => $summary,
                    'body' => $body,
                    'bait' => $bait,
                    'period' => $period,
                    'position' => $index + 1,
                    'active' => true,
                ],
            );
        }
    }

    private function posts(): void
    {
        Post::query()->updateOrCreate(
            ['slug' => '23-de-novembro-15-02'],
            [
                'title' => '23 de novembro, 15:02',
                'excerpt' => 'O L.P.F abre numa terça-feira de novembro, com hora marcada.',
                'body' => <<<'TXT'
Tem grupo que nasce “um dia desses”. O L.P.F nasce às 15:02 de 23 de novembro de 2022.

Lucas Rafael Dutra Silva, o Galegão da Pesca, abre o espaço nessa hora. O motivo cabe no nome e no emblema: Lago Paranoá, pesca, e um barco contra o sol. A ponte de três arcos fica no fundo, como fica na cidade.

A partir daí, o que o grupo combina é público e curto. Cem por cento pesca. Sem distinção entre as pessoas. Sem futebol, sem religião, sem política. O resto é relato de água.
TXT,
                'published_at' => '2022-11-23 15:02:00',
                'active' => true,
            ],
        );

        Post::query()->updateOrCreate(
            ['slug' => 'o-que-este-grupo-nao-e'],
            [
                'title' => 'O que este grupo não é',
                'excerpt' => 'Nem torcida, nem púlpito, nem palanque. A linha é a pesca.',
                'body' => <<<'TXT'
Um grupo de pesca se perde no dia em que abre a porta para tudo. O L.P.F escolhe o contrário.

Não é lugar de escalação, de campanha e de pregação. Quem chega para isso encontra a regra antes do oi. O assunto que fica é o lago: isca, vento, estrutura, peixe que veio e peixe que cortou a linha.

Sem distinção também quer dizer outra coisa. Não importa se a pessoa pesca de barco novo, de caiaque emprestado ou da pedra. O grupo não separa gente por equipamento nem por tempo de vara.
TXT,
                'published_at' => '2022-11-23 16:00:00',
                'active' => true,
            ],
        );
    }

    private function faqs(): void
    {
        $faqs = [
            [
                'O que é o L.P.F?',
                'É o Lago Paranoá Fishing, grupo criado por Lucas Rafael Dutra Silva, o Galegão da Pesca, em 23 de novembro de 2022, às 15:02. O assunto é pesca.',
            ],
            [
                'Preciso ter barco?',
                'Não. Não há distinção entre barco, caiaque e margem.',
            ],
            [
                'Posso falar de futebol, religião ou política?',
                'Não. Esses assuntos ficam de fora.',
            ],
            [
                'Onde o grupo pesca?',
                'No Lago Paranoá, em Brasília.',
            ],
            [
                'Como eu entro?',
                'Pela página Participar, quando a administração publicar o link de entrada.',
            ],
            [
                'Quem cuida deste site?',
                'A administração do L.P.F. Textos, regras, encontros, espécies, fotos e notícias saem do painel.',
            ],
        ];

        foreach ($faqs as $index => [$question, $answer]) {
            Faq::query()->updateOrCreate(
                ['question' => $question],
                ['answer' => $answer, 'position' => $index + 1, 'active' => true],
            );
        }
    }
}
