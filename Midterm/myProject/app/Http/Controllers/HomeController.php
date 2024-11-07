<?php

namespace App\Http\Controllers;

use App\Models\Posts; 
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $posts = Posts::with('user')
        ->withCount(['likes as is_liked' => function ($query) use ($user) {
            $query->where('user_id', $user->id);
        }])
        ->orderBy('created_at', 'desc')
        ->get();
    
        return view('welcome', [
            'posts' => $posts,
        ]);
    }
    
}
