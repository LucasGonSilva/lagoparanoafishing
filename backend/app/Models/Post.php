<?php

namespace App\Models;

use App\Models\Concerns\HasSlug;
use App\Support\Dates;
use App\Support\Media;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasSlug;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'body',
        'image_path',
        'published_at',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'active' => 'boolean',
        ];
    }

    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'body' => $this->body,
            'image_path' => $this->image_path,
            'image_url' => Media::url($this->image_path),
            'published_at' => Dates::iso($this->published_at),
            'active' => $this->active,
            'updated_at' => Dates::iso($this->updated_at),
        ];
    }
}
