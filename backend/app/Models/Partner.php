<?php

namespace App\Models;

use App\Models\Concerns\HasSlug;
use App\Support\Dates;
use App\Support\Media;
use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    use HasSlug;

    protected $fillable = [
        'name',
        'slug',
        'summary',
        'body',
        'url',
        'image_path',
        'position',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'position' => 'integer',
            'active' => 'boolean',
        ];
    }

    public function slugSource(): string
    {
        return 'name';
    }

    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'summary' => $this->summary,
            'body' => $this->body,
            'url' => $this->url,
            'image_path' => $this->image_path,
            'image_url' => Media::url($this->image_path),
            'position' => $this->position,
            'active' => $this->active,
            'updated_at' => Dates::iso($this->updated_at),
        ];
    }
}
