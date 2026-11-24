<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientTrip;
use App\Models\ClubRule;
use App\Models\Faq;
use App\Models\FishingEvent;
use App\Models\GalleryItem;
use App\Models\GroupMember;
use App\Models\Partner;
use App\Models\Post;
use App\Models\Product;
use App\Models\Species;
use App\Models\UsefulLink;
use App\Support\Media;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ContentController extends Controller
{
    public function index(string $type)
    {
        [$model, $order] = $this->meta($type);
        $query = $model::query();

        $this->applyOrder($query, $order);

        return response()->json([
            'data' => $query->get()->map->toApiArray()->values(),
        ]);
    }

    public function store(Request $request, string $type)
    {
        [$model] = $this->meta($type);
        $item = $model::query()->create($this->validated($request, $type, false));

        return response()->json([
            'data' => $item->toApiArray(),
        ], 201);
    }

    public function update(Request $request, string $type, int $id)
    {
        [$model] = $this->meta($type);
        $item = $model::query()->findOrFail($id);
        $previous = $this->storedFiles($type, $item);
        $item->fill($this->validated($request, $type, true));
        $item->save();

        foreach (array_diff($previous, $this->storedFiles($type, $item)) as $path) {
            Media::forget($path);
        }

        return response()->json([
            'data' => $item->fresh()->toApiArray(),
        ]);
    }

    public function destroy(string $type, int $id)
    {
        [$model] = $this->meta($type);
        $item = $model::query()->findOrFail($id);
        foreach ($this->storedFiles($type, $item) as $path) {
            Media::forget($path);
        }
        $item->delete();

        return response()->noContent();
    }

    private function meta(string $type): array
    {
        return match ($type) {
            'rules' => [ClubRule::class, [['position', 'asc'], ['id', 'asc']]],
            'events' => [FishingEvent::class, [['year', 'desc'], ['starts_at', 'desc'], ['id', 'desc']]],
            'products' => [Product::class, [['position', 'asc'], ['id', 'asc']]],
            'species' => [Species::class, [['position', 'asc'], ['id', 'asc']]],
            'posts' => [Post::class, [['published_at', 'desc'], ['id', 'desc']]],
            'gallery' => [GalleryItem::class, [['position', 'asc'], ['id', 'asc']]],
            'faqs' => [Faq::class, [['position', 'asc'], ['id', 'asc']]],
            'clients' => [ClientTrip::class, [['raw', 'fished_on IS NULL'], ['fished_on', 'desc'], ['id', 'desc']]],
            'links' => [UsefulLink::class, [['position', 'asc'], ['id', 'asc']]],
            'partners' => [Partner::class, [['position', 'asc'], ['id', 'asc']]],
            'people' => [GroupMember::class, [['position', 'asc'], ['id', 'asc']]],
            default => abort(404),
        };
    }

    private function validated(Request $request, string $type, bool $updating): array
    {
        $image = ['nullable', 'string', 'max:255', 'regex:/^midia\/[A-Za-z0-9][A-Za-z0-9._-]*$/'];

        $rules = match ($type) {
            'rules' => [
                'title' => ['required', 'string', 'max:160'],
                'body' => ['required', 'string', 'max:5000'],
                'position' => ['nullable', 'integer', 'min:0', 'max:9999'],
                'active' => ['sometimes', 'boolean'],
            ],
            'events' => [
                'title' => ['required', 'string', 'max:160'],
                'slug' => ['nullable', 'string', 'max:180'],
                'location' => ['nullable', 'string', 'max:180'],
                'summary' => ['required', 'string', 'max:400'],
                'body' => ['nullable', 'string', 'max:20000'],
                'starts_at' => ['required', 'date'],
                'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
                'status' => ['required', Rule::in(['agendado', 'realizado', 'cancelado'])],
                'year' => ['required', 'integer', 'min:2000', 'max:2100'],
                'image_path' => $image,
                'photos' => ['nullable', 'array', 'max:30'],
                'photos.*' => ['string', 'max:255', 'regex:/^midia\/[A-Za-z0-9][A-Za-z0-9._-]*$/'],
                'sponsors' => ['nullable', 'array', 'max:20'],
                'sponsors.*.name' => ['required', 'string', 'max:160'],
                'sponsors.*.kind' => ['nullable', Rule::in(FishingEvent::SUPPORT_KINDS)],
                'sponsors.*.image_path' => $image,
                'sponsors.*.url' => ['nullable', 'url', 'max:255'],
                'sponsors.*.url_kind' => ['nullable', Rule::in(FishingEvent::LINK_KINDS)],
                'sponsors.*.note' => ['nullable', 'string', 'max:400'],
                'active' => ['sometimes', 'boolean'],
            ],
            'products' => [
                'name' => ['required', 'string', 'max:160'],
                'slug' => ['nullable', 'string', 'max:180'],
                'category' => ['nullable', 'string', 'max:80'],
                'edition_year' => ['nullable', 'integer', 'min:2000', 'max:2100'],
                'summary' => ['required', 'string', 'max:400'],
                'body' => ['required', 'string', 'max:20000'],
                'price' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
                'availability' => ['required', Rule::in(['disponivel', 'sob_encomenda', 'esgotado'])],
                'link' => ['nullable', 'url', 'max:255'],
                'image_path' => $image,
                'position' => ['nullable', 'integer', 'min:0', 'max:9999'],
                'active' => ['sometimes', 'boolean'],
            ],
            'species' => [
                'name' => ['required', 'string', 'max:120'],
                'slug' => ['nullable', 'string', 'max:180'],
                'scientific_name' => ['nullable', 'string', 'max:180'],
                'summary' => ['required', 'string', 'max:400'],
                'body' => ['required', 'string', 'max:20000'],
                'bait' => ['nullable', 'string', 'max:2000'],
                'period' => ['nullable', 'string', 'max:180'],
                'image_path' => $image,
                'position' => ['nullable', 'integer', 'min:0', 'max:9999'],
                'active' => ['sometimes', 'boolean'],
            ],
            'posts' => [
                'title' => ['required', 'string', 'max:160'],
                'slug' => ['nullable', 'string', 'max:180'],
                'excerpt' => ['required', 'string', 'max:400'],
                'body' => ['required', 'string', 'max:20000'],
                'image_path' => $image,
                'published_at' => ['nullable', 'date'],
                'active' => ['sometimes', 'boolean'],
            ],
            'gallery' => [
                'title' => ['required', 'string', 'max:160'],
                'caption' => ['nullable', 'string', 'max:2000'],
                'image_path' => ['required', 'string', 'max:255', 'regex:/^midia\/[A-Za-z0-9][A-Za-z0-9._-]*$/'],
                'taken_on' => ['nullable', 'date'],
                'position' => ['nullable', 'integer', 'min:0', 'max:9999'],
                'active' => ['sometimes', 'boolean'],
            ],
            'faqs' => [
                'question' => ['required', 'string', 'max:200'],
                'answer' => ['required', 'string', 'max:5000'],
                'position' => ['nullable', 'integer', 'min:0', 'max:9999'],
                'active' => ['sometimes', 'boolean'],
            ],
            'clients' => [
                'title' => ['required', 'string', 'max:160'],
                'slug' => ['nullable', 'string', 'max:180'],
                'location' => ['required', 'string', 'max:180'],
                'fished_on' => ['nullable', 'date'],
                'fish_count' => ['nullable', 'integer', 'min:0', 'max:9999'],
                'anglers' => ['required', 'string', 'max:2000'],
                'guide' => ['nullable', 'string', 'max:160'],
                'notes' => ['nullable', 'string', 'max:20000'],
                'photos' => ['nullable', 'array', 'max:30'],
                'photos.*' => ['string', 'max:255', 'regex:/^midia\/[A-Za-z0-9][A-Za-z0-9._-]*$/'],
                'videos' => ['nullable', 'array', 'max:12'],
                'videos.*.kind' => ['required', Rule::in(['file', 'link'])],
                'videos.*.path' => ['nullable', 'string', 'max:255'],
                'videos.*.url' => ['nullable', 'string', 'max:500'],
                'position' => ['nullable', 'integer', 'min:0', 'max:9999'],
                'active' => ['sometimes', 'boolean'],
            ],
            'links' => [
                'title' => ['required', 'string', 'max:160'],
                'details' => ['nullable', 'string', 'max:5000'],
                'url' => ['required', 'url', 'max:255'],
                'position' => ['nullable', 'integer', 'min:0', 'max:9999'],
                'active' => ['sometimes', 'boolean'],
            ],
            'partners' => [
                'name' => ['required', 'string', 'max:160'],
                'slug' => ['nullable', 'string', 'max:180'],
                'summary' => ['required', 'string', 'max:400'],
                'body' => ['nullable', 'string', 'max:20000'],
                'url' => ['nullable', 'url', 'max:255'],
                'image_path' => $image,
                'position' => ['nullable', 'integer', 'min:0', 'max:9999'],
                'active' => ['sometimes', 'boolean'],
            ],
            'people' => [
                'name' => ['required', 'string', 'max:160'],
                'nickname' => ['nullable', 'string', 'max:160'],
                'role' => ['required', 'string', 'max:80'],
                'note' => ['nullable', 'string', 'max:2000'],
                'position' => ['nullable', 'integer', 'min:0', 'max:9999'],
                'active' => ['sometimes', 'boolean'],
            ],
            default => abort(404),
        };

        $data = $request->validate($rules);

        if (array_key_exists('position', $data) && $data['position'] === null) {
            $data['position'] = 0;
        }

        if (array_key_exists('active', $data)) {
            $data['active'] = $request->boolean('active');
        } elseif (! $updating) {
            $data['active'] = true;
        }

        if ($type === 'posts' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        if ($type === 'people') {
            $data['name'] = trim($data['name']);
            $data['role'] = trim($data['role']);
            $nickname = trim((string) ($data['nickname'] ?? ''));
            $data['nickname'] = $nickname === '' ? null : $nickname;
        }

        if ($type === 'events') {
            $data['photos'] = array_values($data['photos'] ?? []);
            $data['sponsors'] = $this->sponsors($data['sponsors'] ?? []);
        }

        if ($type === 'clients') {
            $data['photos'] = array_values($data['photos'] ?? []);
            $data['videos'] = $this->videos($data['videos'] ?? []);
            if (empty($data['guide'])) {
                $data['guide'] = 'Galegão da Pesca';
            }
        }

        return $data;
    }

    private function sponsors(array $sponsors): array
    {
        $clean = [];

        foreach ($sponsors as $index => $sponsor) {
            if (! is_array($sponsor)) {
                throw ValidationException::withMessages([
                    "sponsors.$index" => 'O patrocinador não veio num formato válido.',
                ]);
            }

            $name = trim((string) ($sponsor['name'] ?? ''));
            if ($name === '') {
                throw ValidationException::withMessages([
                    "sponsors.$index.name" => 'Informe o nome.',
                ]);
            }

            $kind = $sponsor['kind'] ?? 'patrocinadores';
            if (! is_string($kind) || $kind === '') {
                $kind = 'patrocinadores';
            }
            if (! in_array($kind, FishingEvent::SUPPORT_KINDS, true)) {
                throw ValidationException::withMessages([
                    "sponsors.$index.kind" => 'Escolha o tipo: Patrocinadores, Colaboradores, Organizações, Apoiadores ou Realização.',
                ]);
            }

            $path = $sponsor['image_path'] ?? null;
            if ($path === '' || $path === null) {
                $path = null;
            } elseif (! is_string($path) || ! preg_match('/^midia\/[A-Za-z0-9][A-Za-z0-9._-]*$/', $path)) {
                throw ValidationException::withMessages([
                    "sponsors.$index.image_path" => 'A foto do patrocinador não é válida.',
                ]);
            }

            $url = trim((string) ($sponsor['url'] ?? ''));
            if ($url === '') {
                $url = null;
            } else {
                $scheme = parse_url($url, PHP_URL_SCHEME);
                if (! filter_var($url, FILTER_VALIDATE_URL) || ! in_array($scheme, ['http', 'https'], true)) {
                    throw ValidationException::withMessages([
                        "sponsors.$index.url" => 'O endereço precisa começar com http:// ou https://.',
                    ]);
                }
            }

            $urlKind = $sponsor['url_kind'] ?? 'site';
            if (! is_string($urlKind) || $urlKind === '') {
                $urlKind = 'site';
            }
            if (! in_array($urlKind, FishingEvent::LINK_KINDS, true)) {
                throw ValidationException::withMessages([
                    "sponsors.$index.url_kind" => 'Escolha o que é o endereço: site, Instagram, landing page ou outro.',
                ]);
            }

            $note = trim((string) ($sponsor['note'] ?? ''));
            $clean[] = [
                'name' => $name,
                'kind' => $kind,
                'image_path' => $path,
                'url' => $url,
                'url_kind' => $urlKind,
                'note' => $note === '' ? null : $note,
            ];
        }

        return $clean;
    }

    private function videos(array $videos): array
    {
        $clean = [];

        foreach ($videos as $index => $video) {
            if (! is_array($video)) {
                throw ValidationException::withMessages([
                    "videos.$index" => 'O vídeo não veio num formato válido.',
                ]);
            }

            if (($video['kind'] ?? '') === 'file') {
                $path = $video['path'] ?? '';
                if (! is_string($path) || ! preg_match('/^midia\/[A-Za-z0-9][A-Za-z0-9._-]*$/', $path)) {
                    throw ValidationException::withMessages([
                        "videos.$index" => 'Envie o arquivo de vídeo antes de salvar.',
                    ]);
                }
                $clean[] = ['kind' => 'file', 'path' => $path];
                continue;
            }

            $url = $video['url'] ?? '';
            $scheme = is_string($url) ? parse_url($url, PHP_URL_SCHEME) : null;
            if (! is_string($url) || ! filter_var($url, FILTER_VALIDATE_URL) || ! in_array($scheme, ['http', 'https'], true)) {
                throw ValidationException::withMessages([
                    "videos.$index" => 'O link do vídeo precisa começar com http:// ou https://.',
                ]);
            }
            $clean[] = ['kind' => 'link', 'url' => $url];
        }

        return $clean;
    }

    private function storedFiles(string $type, object $item): array
    {
        if ($type === 'clients' || $type === 'events') {
            return $item->storedFiles();
        }

        $path = $item->image_path ?? null;

        return $path ? [$path] : [];
    }

    private function applyOrder(object $query, array $order): void
    {
        foreach ($order as $rule) {
            if ($rule[0] === 'raw') {
                $query->orderByRaw($rule[1]);
                continue;
            }
            $query->orderBy($rule[0], $rule[1]);
        }
    }
}
