<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::query()->where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'E-mail ou senha não conferem.',
            ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('painel')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $this->profile($user),
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $this->profile($request->user()),
        ]);
    }

    public function logout(Request $request)
    {
        $token = $request->user()->currentAccessToken();

        if ($token) {
            $token->delete();
        }

        return response()->noContent();
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:180', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'current_password' => ['nullable', 'string'],
        ]);

        $changingSecret = $request->filled('password') || $data['email'] !== $user->email;

        if ($changingSecret) {
            if (! $request->filled('current_password') || ! Hash::check($request->input('current_password'), $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => 'A senha atual não confere.',
                ]);
            }
        }

        $user->name = $data['name'];
        $user->email = $data['email'];

        if ($request->filled('password')) {
            $user->password = $data['password'];
        }

        $user->save();

        return response()->json([
            'user' => $this->profile($user),
        ]);
    }

    public function index()
    {
        return response()->json([
            'data' => User::query()
                ->orderBy('name')
                ->get(['id', 'name', 'email'])
                ->map(fn (User $user) => $this->profile($user))
                ->values(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:180', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'email_verified_at' => now(),
        ]);

        return response()->json([
            'data' => $this->profile($user),
        ], 201);
    }

    public function destroy(Request $request, int $id)
    {
        if ($request->user()->id === $id) {
            throw ValidationException::withMessages([
                'user' => 'Você não pode remover o próprio acesso.',
            ]);
        }

        if (User::query()->count() <= 1) {
            throw ValidationException::withMessages([
                'user' => 'O grupo precisa manter pelo menos um acesso.',
            ]);
        }

        $user = User::query()->findOrFail($id);
        $user->tokens()->delete();
        $user->delete();

        return response()->noContent();
    }

    private function profile(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ];
    }
}
