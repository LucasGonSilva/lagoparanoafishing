<?php

namespace App\Models;

use App\Support\Dates;
use Illuminate\Database\Eloquent\Model;

class GroupMember extends Model
{
    protected $fillable = [
        'name',
        'nickname',
        'role',
        'note',
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
            'name' => $this->name,
            'nickname' => $this->nickname,
            'role' => $this->role,
            'note' => $this->note,
            'position' => $this->position,
            'active' => $this->active,
            'updated_at' => Dates::iso($this->updated_at),
        ];
    }
}
