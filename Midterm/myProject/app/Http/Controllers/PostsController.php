<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Posts;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class PostsController extends Controller
{
    // Show the post creation form
    public function create()
    {
        return view('posts.create');
    }

    // Store a newly created post in the database
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('uploads', 'public');
        }

        $post = new Posts();
        $post->title = $request->input('title');
        $post->content = $request->input('content');
        $post->image = $imagePath;
        $post->user_id = Auth::id();
        $post->save();

        return redirect()->route('home')->with('success', 'Post created successfully!');
    }

    // Display a list of posts with user data
    public function display()
    {
        $posts = Posts::with('user')->get();  // Eager load the user relationship
        return view('posts.display', ['posts' => $posts]);
    }

    // Show a single post by its ID
    public function show($id)
    {
        $post = Posts::findOrFail($id);
        return view('posts.show', compact('post'));
    }

    // Get comments for a specific post
    public function getComments($postId)
    {
        $post = Posts::find($postId);
        $comments = $post->comments()->with('user')->get();

        return response()->json($comments);
    }

    // Add or remove a like for a specific post
    public function addLike(Posts $post)
    {
        $user = Auth::user();
        $liked = $post->likes()->where('user_id', $user->id)->exists();

        if ($liked) {
            $post->likes()->where('user_id', $user->id)->delete();
            $post->decrement('likes_count');
        } else {
            $post->likes()->create(['user_id' => $user->id]);
            $post->increment('likes_count');
        }

        // return response()->json(['likes_count' => $post->likes()->count()]);
        return response()->json([
            'likes_count' => $post->likes()->count(),
            'liked' => !$liked
        ]);
    }

    // Add a comment to a specific post
    public function addComment(Request $request, Posts $post){
        $comment = $post->comments()->create([
            'user_id' => Auth::id(),
            'content' => $request->content,
            $post->increment('comments_count')
        ]);

        return response()->json([
            'success' => true,
            'user' => $comment->user,
            'content' => $comment->content,
            'comments_count' => $post->comments()->count()
        ]);
    }

    public function showJson($id)
    {
        $post = Posts::with('user', 'comments.user')->findOrFail($id);
        $user = Auth::user();

        return response()->json([
            'image' => $post->image,
            'caption' => $post->content,
            'likes_count' => $post->likes()->count(),
            'is_liked' => $user ? DB::table('likes')
            ->where('user_id', $user->id)
            ->where('post_id', $post->id)
            ->exists() : false,
            'user' => [
                'name' => $post->user->name,
                'avatar' => $post->user->profile_image,
            ],
            'comments' => $post->comments->map(function ($comment) {
                return [
                    'content' => $comment->content,
                    'user' => [
                        'name' => $comment->user->name,
                    ],
                ];
            }),
        ]);
    }
    

}
