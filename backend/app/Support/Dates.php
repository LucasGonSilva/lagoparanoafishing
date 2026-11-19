<?php

namespace App\Support;

use Illuminate\Support\Carbon;

class Dates
{
    public static function iso(mixed $value): ?string
    {
        if (! $value) {
            return null;
        }

        return Carbon::parse($value)
            ->timezone(config('app.timezone'))
            ->format('Y-m-d\TH:i:sP');
    }
}
