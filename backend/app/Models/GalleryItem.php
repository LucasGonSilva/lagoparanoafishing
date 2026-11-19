<?php

namespace App\Models;

use App\Support\Dates;
use App\Support\Media;
use Illuminate\Database\Eloquent\Model;

class GalleryItem extends Model
{
    protected $fillable = [
        'title',
        'caption',
        'image_path',
        'taken_on',
        'position',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'taken_on' => 'date',
            'position' => 'integer',
            'active' => 'boolean',
        ];
    }

    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'caption' => $this->caption,
            'image_path' => $this->image_path,
            'image_url' => Media::url($this->image_path),
            'taken_on' => $this->taken_on?->format('Y-m-d'),
            'position' => $this->position,
            'active' => $this->active,
            'updated_at' => Dates::iso($this->updated_at),
        ];
    }
}
