<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home - Instagram Clone</title>
    <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
    <script defer src="{{ asset('js/main-home.js') }}"></script>
</head>
<body>
    <div class="container">
        <!-- Sidebar -->
        <nav class="sidebar">
            <!-- Navigation items -->
            <ul class="nav-list">
                <li><a href="{{ route('home') }}"><img src="/icons/home.svg" alt="Home Icon">Home</a></li>
                <li id="search-btn">
                    <a href="javascript:void(0);"><img src="/icons/search.svg" alt="Search Icon">Search</a>
                </li>
                <li><a href="{{ route('posts.display') }}"><img src="/icons/explore.svg" alt="Explore Icon">Explore</a></li>
                <li><a href="{{ route('posts.create') }}"><img src="/icons/create.svg" alt="Create Icon">Create</a></li>
                <li><a href="{{ route("profile.show") }}"><img src="/icons/profile.svg" alt="Profile Icon">Profile</a></li>
            </ul>

            <!-- Logout Button -->
            <div class="logout">
                <a href="{{ route('logout') }}"><img src="icons/logout.svg" alt="Logout Icon">Logout</a>
            </div>

            <!-- Hidden search bar initially -->
            <div id="search-bar" class="search-container" style="display: none;">
                <div class="search-bar">
                    <input type="text" id="search-input" placeholder="Search for users, tags, etc.">
                    <button id="close-search">✖</button>
                </div>
                <div id="search-results" class="search-results">
                    <!-- User list will be dynamically populated here by JavaScript -->
                </div>
            </div>
        </nav>

        <!-- Main Content Area -->
        <div class="content">
            @if ($posts->isEmpty())
                <p>No posts available.</p>
            @else
                <div class="posts">
                    @foreach ($posts as $post)
                        <div class="post">
                            <!-- Post Header (Username and Profile Image) -->
                            <div class="post-header">
                                <img class="post-avatar" src="{{ asset('storage/avatars/' . ($user->profile_image ?? 'default-avatar.png')) }}" alt="Profile Image">

                                <div class="post-user-info">
                                    <a href="{{ route('people.profile', ['username' => $post->user->name]) }}"> {{$post->user->name}} </a>
                                    <p>{{ $post->created_at->diffForHumans() }}</p>
                                </div>
                            </div>

                            <!-- Post Image -->
                            @if($post->image)
                                <div class="post-image">
                                    <img src="{{ asset('storage/' . $post->image) }}" alt="{{ $post->title }}">
                                </div>
                            @endif

                            <!-- Post Footer (Caption, Likes, and Comments) -->
                            <div class="post-footer">
                                <div class="post-icons">
                                    <img src="/icons/like.svg" alt="Like Icon" class="icon">
                                    <img src="/icons/comment.svg" alt="Comment Icon" class="icon">
                                </div>
                                <a href="{{ route('people.profile', ['username' => $post->user->name]) }}"> {{$post->user->name}} </a>
                                 {{ $post->content }}</p>
                                <p>{{ $post->likes_count ?? 0 }} likes</p>
                                <p>View all {{ $post->comments->count() }} comments</p>

                                <!-- Add comment input -->
                                <form action="{{ route('comments.store', $post->id) }}" method="POST">
                                    @csrf
                                    <input type="text" placeholder="Add a comment..." name="content" class="comment-input">
                                </form>
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    </div>
</body>
</html>
