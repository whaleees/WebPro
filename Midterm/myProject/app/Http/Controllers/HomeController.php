<?php

namespace App\Http\Controllers;

use App\Models\Posts; 
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        $posts = Posts::with('user')->orderBy('created_at', 'desc')->get();
        $user = Auth::user();
    
        // Pass the posts to the welcome view
        return view('welcome', [
            'posts' => $posts,
        ]);
    }
}
