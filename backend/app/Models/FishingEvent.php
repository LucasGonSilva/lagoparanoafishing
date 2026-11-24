<?php

namespace App\Models;

use App\Models\Concerns\HasSlug;
use App\Support\Dates;
use App\Support\Media;
use Illuminate\Database\Eloquent\Model;

class FishingEvent extends Model
{
    use HasSlug;

    public const SUPPORT_KINDS = [
        'patrocinadores',
        'colaboradores',
        'organizacoes',
        'apoiadores',
        'realizacao',
    ];

    protected $table = 'events';

    protected $fillable = [
        'title',
        'slug',
        'location',
        'summary',
        'body',
        'starts_at',
        'ends_at',
        'status',
        'year',
        'image_path',
        'photos',
        'sponsors',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'year' => 'integer',
            'photos' => 'array',
            'sponsors' => 'array',
            'active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (self $event): void {
            if (! $event->year && $event->starts_at) {
                $event->year = $event->starts_at->timezone(config('app.timezone'))->year;
            }
        });
    }

    public function storedFiles(): array
    {
        $paths = [];
        if (is_string($this->image_path) && $this->image_path !== '') {
            $paths[] = $this->image_path;
        }
        foreach ($this->photos ?? [] as $path) {
            if (is_string($path) && $path !== '') {
                $paths[] = $path;
            }
        }
        foreach ($this->sponsors ?? [] as $sponsor) {
            $path = is_array($sponsor) ? ($sponsor['image_path'] ?? null) : null;
            if (is_string($path) && $path !== '') {
                $paths[] = $path;
            }
        }

        return $paths;
    }

    public function photoList(): array
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

        return $photos;
    }

    public function sponsorList(): array
    {
        $sponsors = [];
        foreach ($this->sponsors ?? [] as $sponsor) {
            if (! is_array($sponsor)) {
                continue;
            }
            $name = trim((string) ($sponsor['name'] ?? ''));
            if ($name === '') {
                continue;
            }
            $path = $sponsor['image_path'] ?? null;
            $path = is_string($path) && $path !== '' ? $path : null;
            $url = $sponsor['url'] ?? null;
            $note = $sponsor['note'] ?? null;
            $kind = $sponsor['kind'] ?? 'patrocinadores';
            if (! is_string($kind) || ! in_array($kind, self::SUPPORT_KINDS, true)) {
                $kind = 'patrocinadores';
            }
            $sponsors[] = [
                'name' => $name,
                'kind' => $kind,
                'image_path' => $path,
                'image_url' => Media::url($path),
                'url' => is_string($url) && $url !== '' ? $url : null,
                'note' => is_string($note) && trim($note) !== '' ? trim($note) : null,
            ];
        }

        return $sponsors;
    }

    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'location' => $this->location,
            'summary' => $this->summary,
            'body' => $this->body,
            'starts_at' => Dates::iso($this->starts_at),
            'ends_at' => Dates::iso($this->ends_at),
            'status' => $this->status,
            'year' => $this->year,
            'image_path' => $this->image_path,
            'image_url' => Media::url($this->image_path),
            'photos' => $this->photoList(),
            'sponsors' => $this->sponsorList(),
            'active' => $this->active,
            'updated_at' => Dates::iso($this->updated_at),
        ];
    }
}
