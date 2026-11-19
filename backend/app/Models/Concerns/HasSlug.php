<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

trait HasSlug
{
    public static function bootHasSlug(): void
    {
        static::saving(function ($model): void {
            if ($model->exists && ! $model->isDirty('slug') && filled($model->getOriginal('slug'))) {
                return;
            }

            $source = $model->{$model->slugSource()} ?: 'item';
            $raw = filled($model->slug) ? $model->slug : $source;
            $model->slug = static::uniqueSlug((string) $raw, $model->id);
        });
    }

    public function slugSource(): string
    {
        return 'title';
    }

    public static function uniqueSlug(string $raw, mixed $ignoreId = null): string
    {
        $base = Str::slug($raw) ?: 'item';
        $slug = $base;
        $i = 2;

        while (static::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = $base.'-'.$i;
            $i++;
        }

        return $slug;
    }
}
