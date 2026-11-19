<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\Media;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'max:81920'],
        ]);

        $file = $request->file('file');
        $mime = (string) $file->getMimeType();
        $extension = strtolower($file->getClientOriginalExtension());
        $images = ['image/jpeg', 'image/png', 'image/webp'];
        $videos = ['video/mp4', 'video/webm', 'video/quicktime'];
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'webm', 'mov'];

        $kind = null;
        if (in_array($mime, $images, true) || ($mime === 'application/octet-stream' && in_array($extension, ['jpg', 'jpeg', 'png', 'webp'], true))) {
            $kind = 'image';
        } elseif (in_array($mime, $videos, true) || ($mime === 'application/octet-stream' && in_array($extension, ['mp4', 'webm', 'mov'], true))) {
            $kind = 'video';
        }

        if ($kind === null || ! in_array($extension, $allowedExtensions, true)) {
            throw ValidationException::withMessages([
                'file' => 'Envie uma foto JPG, PNG ou WebP, ou um vídeo MP4, WebM ou MOV de até 80 MB.',
            ]);
        }

        $path = $file->store('midia', 'public');

        return response()->json([
            'path' => $path,
            'url' => Media::url($path),
            'kind' => $kind,
        ], 201);
    }
}
