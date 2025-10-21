<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user('api');
        $validated = $request->validate([
            'title' => 'nullable|string|max:50',
            'name' => 'nullable|string|max:255',
            'profile_image' => 'nullable|string',
            'phone_number' => 'nullable|string|max:50',
        ]);
        $user->fill($validated);
        $user->save();
        return response()->json($user);
    }

    public function changePassword(Request $request)
    {
        $user = $request->user('api');
        $data = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6',
        ]);
        if (! Hash::check($data['current_password'], $user->password)) {
            return response()->json(['message' => 'Current password incorrect'], 422);
        }
        $user->password = Hash::make($data['new_password']);
        $user->save();
        return response()->json(['message' => 'Password updated']);
    }
}



