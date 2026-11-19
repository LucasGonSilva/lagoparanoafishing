<?php

namespace App\Models;

use App\Support\Dates;
use Illuminate\Database\Eloquent\Model;

class ClubRule extends Model
{
    protected $table = 'rules';

    protected $fillable = [
        'title',
        'body',
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
            'body' => $this->body,
            'position' => $this->position,
            'active' => $this->active,
            'updated_at' => Dates::iso($this->updated_at),
        ];
    }
}
