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
        'active',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'year' => 'integer',
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
            'active' => $this->active,
            'updated_at' => Dates::iso($this->updated_at),
        ];
    }
}
