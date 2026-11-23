<?php

namespace App\Models;

use App\Models\Concerns\HasSlug;
use App\Support\Dates;
use App\Support\Media;
use Illuminate\Database\Eloquent\Model;

class FishingEvent extends Model
{
    use HasSlug;

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
        'active',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'year' => 'integer',
            'photos' => 'array',
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
            'active' => $this->active,
            'updated_at' => Dates::iso($this->updated_at),
        ];
    }
}
