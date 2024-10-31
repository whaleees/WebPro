<?php

namespace App\Http\Controllers;

use App\Models\Posts;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, $postId)
    {
        $post = Posts::findOrFail($postId);

        // Validate the comment content
        $data = $request->validate([
            'content' => 'required',
        ]);

        // Create the comment and attach it to the post
        $post->comments()->create([
            'user_id' => Auth::id(),
            'content' => $request->input('content'),  // Correct way to access validated content
        ]);

        // Increment the comments count
        $post->increment('comments_count');

        return back();
    }
}
