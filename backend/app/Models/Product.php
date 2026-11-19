<?php

namespace App\Models;

use App\Models\Concerns\HasSlug;
use App\Support\Dates;
use App\Support\Media;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasSlug;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'edition_year',
        'summary',
        'body',
        'price',
        'availability',
        'link',
        'image_path',
        'position',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'edition_year' => 'integer',
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
            'category' => $this->category,
            'edition_year' => $this->edition_year,
            'summary' => $this->summary,
            'body' => $this->body,
            'price' => $this->price,
            'availability' => $this->availability,
            'link' => $this->link,
            'image_path' => $this->image_path,
            'image_url' => Media::url($this->image_path),
            'position' => $this->position,
            'active' => $this->active,
            'updated_at' => Dates::iso($this->updated_at),
        ];
    }
}
