<?php

namespace App\Models;

use App\Models\Concerns\HasSlug;
use App\Support\Dates;
use App\Support\Media;
use Illuminate\Database\Eloquent\Model;

class Species extends Model
{
    use HasSlug;

    protected $table = 'species';

    protected $fillable = [
        'name',
        'slug',
        'scientific_name',
        'summary',
        'body',
        'bait',
        'period',
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
            'scientific_name' => $this->scientific_name,
            'summary' => $this->summary,
            'body' => $this->body,
            'bait' => $this->bait,
            'period' => $this->period,
            'image_path' => $this->image_path,
            'image_url' => Media::url($this->image_path),
            'position' => $this->position,
            'active' => $this->active,
            'updated_at' => Dates::iso($this->updated_at),
        ];
    }
}
