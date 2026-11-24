<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function show()
    {
        return response()->json([
            'settings' => Setting::query()->pluck('value', 'key'),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'group_name' => ['required', 'string', 'max:120'],
            'short_name' => ['required', 'string', 'max:40'],
            'tagline' => ['nullable', 'string', 'max:180'],
            'lede' => ['nullable', 'string', 'max:800'],
            'seo_description' => ['nullable', 'string', 'max:300'],
            'founder_name' => ['required', 'string', 'max:160'],
            'founder_nickname' => ['required', 'string', 'max:160'],
            'founded_date_label' => ['required', 'string', 'max:80'],
            'founded_time_label' => ['required', 'string', 'max:20'],
            'city' => ['nullable', 'string', 'max:80'],
            'water' => ['nullable', 'string', 'max:80'],
            'about' => ['nullable', 'string', 'max:20000'],
            'pillars' => ['nullable', 'string', 'max:1000'],
            'manifesto' => ['nullable', 'string', 'max:2000'],
            'join_text' => ['nullable', 'string', 'max:5000'],
            'join_note' => ['nullable', 'string', 'max:1000'],
            'member_count' => ['nullable', 'integer', 'min:1', 'max:99999'],
            'whatsapp_url' => ['nullable', 'url', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:180'],
        ]);

        foreach ($data as $key => $value) {
            Setting::query()->updateOrCreate(
                ['key' => $key],
                ['value' => $value],
            );
        }

        return response()->json([
            'settings' => Setting::query()->pluck('value', 'key'),
        ]);
    }
}
