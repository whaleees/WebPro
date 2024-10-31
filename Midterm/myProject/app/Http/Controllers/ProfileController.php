<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show($username)
    {
        // Find the user by username
        $user = User::where('name', $username)->firstOrFail();
        
        // Return the profile view with the user data
        return view('profile.show', compact('user'));
    }

    public function searchUsers(Request $request)
    {
        $query = $request->input('query');
    
        // Search for users by name or email
        $users = User::where('name', 'LIKE', "%{$query}%")
                     ->orWhere('email', 'LIKE', "%{$query}%")
                     ->get()
                     ->map(function ($user) {
                         return [
                             'name' => $user->name,
                             'email' => $user->email,
                             'profile_image' => $user->profile_image ?? 'default-avatar.png',
                             'username' => $user->name, // Use 'username' if you have this field in the database
                         ];
                     });
    
        // Return only user results in the JSON response
        return response()->json($users);
    }
}
