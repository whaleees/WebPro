<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Posts;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class PostsController extends Controller
{
    
    public function create(){
        return view('posts.create');
    }
    
    public function store(Request $request)
    {
        // Validate the form data
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Ensure it’s an image file
        ]);
    
        // Handle the image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imageFile = $request->file('image');
            
            // Save the image in the 'public/uploads' directory
            $imagePath = $imageFile->store('uploads', 'public');
        }
    
        // Create a new post
        $post = new Posts();
        $post->title = $request->input('title');
        $post->content = $request->input('content');
        $post->image = $imagePath; // Save the image path in the database
        $post->user_id = Auth::id(); // Assuming the user is authenticated
    
        // Save the post to the database
        $post->save();
    
        // Redirect back with a success message
        return redirect()->route('home')->with('success', 'Post created successfully!');
    }
    
    
    
    public function display()
{
    $posts = Posts::with('user')->get();  // Eager load the user relationship
    return view('posts.display', ['posts' => $posts]);
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

public function likePost(Request $request)
{
    $post = Posts::find($request->post_id);

    // Use the user ID directly
    $userId = Auth::id();

    // Check if the user has already liked the post
    if ($post->likes()->where('user_id', $userId)->exists()) {
        // If user has already liked, remove like (toggle unlike)
        $post->likes()->where('user_id', $userId)->delete();
    } else {
        // Otherwise, add a new like
        $post->likes()->create([
            'user_id' => $userId,
        ]);
    }

    // Return the updated like count
    return response()->json(['likes_count' => $post->likes()->count()]);
}

public function getComments($postId)
{
    $post = Posts::find($postId);
    $comments = $post->comments()->with('user')->get();

    return response()->json($comments);
}

public function show($id)
{
    $posts = Posts::findOrFail($id); // Ensure the post exists
    return view('posts.show', compact('posts')); // Pass post data to the view
}


}
