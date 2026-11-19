<?php

namespace App\Models;

use App\Support\Dates;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    protected $fillable = [
        'question',
        'answer',
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
            'question' => $this->question,
            'answer' => $this->answer,
            'position' => $this->position,
            'active' => $this->active,
            'updated_at' => Dates::iso($this->updated_at),
        ];
    }
}
