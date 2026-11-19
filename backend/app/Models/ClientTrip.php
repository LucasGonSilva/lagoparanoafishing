<?php

namespace App\Models;

use App\Models\Concerns\HasSlug;
use App\Support\Dates;
use App\Support\Media;
use Illuminate\Database\Eloquent\Model;

class ClientTrip extends Model
{
    use HasSlug;

    protected $fillable = [
        'title',
        'slug',
        'location',
        'fished_on',
        'fish_count',
        'anglers',
        'guide',
        'notes',
        'photos',
        'videos',
        'position',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'fished_on' => 'date',
            'fish_count' => 'integer',
            'photos' => 'array',
            'videos' => 'array',
            'position' => 'integer',
            'active' => 'boolean',
        ];
    }

    public function slugSource(): string
    {
        return 'title';
    }

    public function storedFiles(): array
    {
        return self::filesIn([
            'photos' => $this->photos ?? [],
            'videos' => $this->videos ?? [],
        ]);
    }

    public static function filesIn(array $data): array
    {
        $paths = [];

        foreach ($data['photos'] ?? [] as $path) {
            if (is_string($path) && $path !== '') {
                $paths[] = $path;
            }
        }

        foreach ($data['videos'] ?? [] as $video) {
            if (is_array($video) && ($video['kind'] ?? '') === 'file' && ! empty($video['path'])) {
                $paths[] = $video['path'];
            }
        }

        return $paths;
    }

    public function toApiArray(): array
    {
        $photos = [];
        foreach ($this->photos ?? [] as $path) {
            if (! is_string($path) || $path === '') {
                continue;
            }
            $photos[] = [
                'path' => $path,
                'url' => Media::url($path),
            ];
        }

        $videos = [];
        foreach ($this->videos ?? [] as $video) {
            if (! is_array($video)) {
                continue;
            }
            if (($video['kind'] ?? '') === 'file' && ! empty($video['path'])) {
                $videos[] = [
                    'kind' => 'file',
                    'path' => $video['path'],
                    'url' => Media::url($video['path']),
                ];
                continue;
            }
            if (($video['kind'] ?? '') === 'link' && ! empty($video['url'])) {
                $videos[] = [
                    'kind' => 'link',
                    'url' => $video['url'],
                ];
            }
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'location' => $this->location,
            'fished_on' => $this->fished_on?->toDateString(),
            'fish_count' => $this->fish_count,
            'anglers' => $this->anglers,
            'guide' => $this->guide,
            'notes' => $this->notes,
            'photos' => $photos,
            'videos' => $videos,
            'position' => $this->position,
            'active' => $this->active,
            'updated_at' => Dates::iso($this->updated_at),
        ];
    }
}
