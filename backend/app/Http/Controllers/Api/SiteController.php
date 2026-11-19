<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientTrip;
use App\Models\ClubRule;
use App\Models\Faq;
use App\Models\FishingEvent;
use App\Models\GalleryItem;
use App\Models\Post;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Species;

class SiteController extends Controller
{
    public function index()
    {
        return response()->json([
            'settings' => Setting::query()->pluck('value', 'key'),
            'rules' => $this->collect(ClubRule::class, [['position', 'asc'], ['id', 'asc']]),
            'events' => $this->collect(FishingEvent::class, [['year', 'desc'], ['starts_at', 'desc'], ['id', 'desc']]),
            'products' => $this->collect(Product::class, [['position', 'asc'], ['id', 'asc']]),
            'species' => $this->collect(Species::class, [['position', 'asc'], ['id', 'asc']]),
            'posts' => $this->collect(Post::class, [['published_at', 'desc'], ['id', 'desc']]),
            'gallery' => $this->collect(GalleryItem::class, [['position', 'asc'], ['id', 'asc']]),
            'clients' => $this->collect(ClientTrip::class, [['raw', 'fished_on IS NULL'], ['fished_on', 'desc'], ['id', 'desc']]),
            'faqs' => $this->collect(Faq::class, [['position', 'asc'], ['id', 'asc']]),
        ]);
    }

    public function event(string $slug)
    {
        return $this->one(FishingEvent::class, $slug);
    }

    public function species(string $slug)
    {
        return $this->one(Species::class, $slug);
    }

    public function post(string $slug)
    {
        return $this->one(Post::class, $slug);
    }

    public function product(string $slug)
    {
        return $this->one(Product::class, $slug);
    }

    public function client(string $slug)
    {
        return $this->one(ClientTrip::class, $slug);
    }

    private function one(string $model, string $slug)
    {
        $item = $model::query()->where('active', true)->where('slug', $slug)->firstOrFail();

        return response()->json([
            'data' => $item->toApiArray(),
        ]);
    }

    private function collect(string $model, array $order)
    {
        $query = $model::query()->where('active', true);

        foreach ($order as $rule) {
            if ($rule[0] === 'raw') {
                $query->orderByRaw($rule[1]);
                continue;
            }
            $query->orderBy($rule[0], $rule[1]);
        }

        return $query->get()->map->toApiArray()->values();
    }
}
