<?php
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ProfileController;
use Symfony\Component\HttpKernel\Profiler\Profile;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/posts/create', [PostsController::class, 'create'])->name('posts.create');
Route::post('/posts', [PostsController::class, 'store'])->name('posts.store');
Route::get('/posts/allposts', [PostsController::class, 'display'])->name('posts.display');

Route::get('/auth/login', [AuthController::class, 'displayLogin'])->name('login');
Route::post('/auth/login', [AuthController::class, 'login'])->name('login.submit');

Route::get('/auth/register', [AuthController::class, 'displayRegister'])->name('register');
Route::post('/auth/register', [AuthController::class, 'register']);

Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/posts/create', [PostsController::class, 'create'])->name('posts.create');
    Route::post('/posts', [PostsController::class, 'store'])->name('posts.store');
});

Route::get('/posts/allposts', [PostsController::class, 'display'])->name('posts.display');
Route::get('/posts/{id}', [PostsController::class, 'show'])->name('posts.show');



Route::get('/profile', function () {
    $user = Auth::user();  // Get the authenticated user
    return view('profile', compact('user')); // Pass the user to the view
})->name('profile.show')->middleware('auth');  // Only accessible by logged-in users
Route::get('/profile/{username}', [ProfileController::class, 'show'])->name('people.profile');



Route::post('/like-post', [PostsController::class, 'likePost'])->name('like.post');
Route::get('/comments/{postId}', [PostsController::class, 'getComments'])->name('get.comments');
Route::get('/search-users', [SearchController::class, 'searchUsers']);

Route::post('/posts/{post}/like', [PostsController::class, 'addLike'])->name('posts.like')->middleware('auth');
Route::post('/posts/{post}/comments', [PostsController::class, 'addComment'])->name('posts.comment')->middleware('auth');
Route::get('/posts/{id}/json', [PostsController::class, 'showJson'])->name('posts.showJson');

Route::get('/get-search-history', [SearchController::class, 'getSearchHistory']);
Route::post('/add-search-history', [SearchController::class, 'addSearchHistory']);
Route::delete('/clear-search-history', [SearchController::class, 'clearSearchHistory']);
Route::delete('/delete-search-history-item/{id}', [SearchController::class, 'deleteSearchHistoryItem']);
Route::post('/profile/updateProfilePicture', [ProfileController::class, 'updateProfilePicture'])->middleware('auth');












