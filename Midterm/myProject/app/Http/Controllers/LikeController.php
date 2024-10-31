<?php

namespace App\Http\Controllers;

use App\Models\Posts;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller
{
    public function toggleLike($postId)
    {
        $post = Posts::findOrFail($postId);

        if ($post->likes()->where('user_id', Auth::id())->exists()) {
            // If the user has already liked this post, remove the like
            $post->likes()->where('user_id', Auth::id())->delete();
            $post->decrement('likes_count'); // Decrement the like count
        } else {
            // Otherwise, add a like
            $post->likes()->create([
                'user_id' => Auth::id(),
            ]);
            $post->increment('likes_count'); // Increment the like count
        }

        return back();
    }
}
