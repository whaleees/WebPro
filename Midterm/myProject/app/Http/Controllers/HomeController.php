<?php

namespace App\Http\Controllers;

use App\Models\Posts; // Assuming your Post model is called Post
use Illuminate\Http\Request;
use App\Models\User;

class HomeController extends Controller
{
    public function index()
    {
        $posts = Posts::orderBy('created_at', 'desc')->get(); // Order by newest first
    
        // Pass the posts to the welcome view
        return view('welcome', ['posts' => $posts]);
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
