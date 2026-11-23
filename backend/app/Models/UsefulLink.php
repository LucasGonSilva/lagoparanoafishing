<?php

namespace App\Models;

use App\Support\Dates;
use Illuminate\Database\Eloquent\Model;

class UsefulLink extends Model
{
    protected $fillable = [
        'title',
        'details',
        'url',
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

    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'details' => $this->details,
            'url' => $this->url,
            'position' => $this->position,
            'active' => $this->active,
            'updated_at' => Dates::iso($this->updated_at),
        ];
    }
}
