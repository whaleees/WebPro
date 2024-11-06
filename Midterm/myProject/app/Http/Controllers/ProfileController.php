<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show($username)
    {
        // Find the user by username
        $user = User::where('name', $username)->firstOrFail();
        
        // Return the profile view with the user data
        return view('profile.show', compact('user'));
    }

    public function updateProfilePicture(Request $request){
        $request->validate([
            'profile_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Fetch the user directly
        $user = User::find(Auth::id());
        // $user = Auth::user();

        // Check if the user is found and valid
        if ($user) {
            // Delete the old profile picture if it exists and isn't the default avatar
            if ($user->profile_image && $user->profile_image !== 'default-avatar.png') {
                Storage::disk('public')->delete('avatars' . $user->profile_image);
            }

            // Store the new profile picture
            $path = $request->file('profile_image')->store('avatars', 'public');
            $user->profile_image = basename($path);
            $user->save();

            return response()->json(['success' => true, 'message' => 'Profile picture updated successfully!']);
        }

        return response()->json(['success' => true, 'message' => 'Profile picture updated successfully!']);
    }

}
