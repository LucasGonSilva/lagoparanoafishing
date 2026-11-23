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

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'counts' => [
                'rules' => ClubRule::query()->count(),
                'events' => FishingEvent::query()->count(),
                'products' => Product::query()->count(),
                'species' => Species::query()->count(),
                'posts' => Post::query()->count(),
                'gallery' => GalleryItem::query()->count(),
                'faqs' => Faq::query()->count(),
                'clients' => ClientTrip::query()->count(),
                'links' => UsefulLink::query()->count(),
                'partners' => Partner::query()->count(),
                'people' => GroupMember::query()->count(),
            ],
        ]);
    }
}
