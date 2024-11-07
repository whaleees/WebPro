<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{{ asset('/css/display-posts.css') }}">
    <script src="{{ asset('/js/main-post.js') }}"></script>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <title>All Posts</title>
</head>
<body>
        <nav class="sidebar" id="sidebar">
            <!-- Navigation items -->
            <ul class="nav-list">
                <li><a href="{{ route('home') }}"><img class="logo" id="logo" src="/icons/home.svg" alt="Home Icon"><span>Home</span></a></li>
                <li id="search-btn">
                    <a href="javascript:void(0);"><img src="/icons/search.svg" alt="Search Icon"><span>Search</span></a>
                </li>
                <li><a href="{{ route('posts.display') }}"><img class="logo" id="logo" src="/icons/explore.svg" alt="Explore Icon"><span>Explore</span></a></li>
                <li><a href="{{ route('posts.create') }}"><img class="logo" id="logo" src="/icons/create.svg" alt="Create Icon"><span>Create</span></a></li>
                <li><a href="{{ route("profile.show") }}"><img class="logo" id="logo" src="/icons/profile.svg" alt="Profile Icon"><span>Profile</span></a></li>
            </ul>

            <!-- Logout Button -->
            <div class="logout">
                <a href="{{ route('logout') }}"><img class="logo" id="logo" src="/icons/logout.svg" alt="Logout Icon"><span>Logout</span></a>
            </div>

           <!-- Slide-out Search Popup -->
           <div id="search-popup" class="search-popup">
                <div class="search-header">
                    <h2>Search</h2>
                    <button id="close-search">X</button>
                </div>

                <input type="text" id="search-input" placeholder="Search..."/>
                
                <!-- Search Results/History Container -->
                <div id="search-results" class="search-results">
                    <!-- Dynamically populated search results or history items will go here -->
                    <ul id="user-results-list">
                        <!-- Recent searches will be appended here dynamically -->
                    </ul>
                </div>

                <!-- Search History Section -->
                <div class="search-history">
                    <h3 id="recent-label">Recent</h3>
                    <ul id="history-list">
                        <!-- Recent searches will be appended here dynamically -->
                    </ul>
                    <button id="clear-history">Clear all</button>
                </div>
            </div>
        </nav>

    <div class="content">
        @if ($posts->isEmpty())
            <p>No posts available.</p>
        @else
            <div class="grid">
                @foreach ($posts as $post)
                <div class="grid-item" data-post-id="{{ $post->id }}" onclick="openModal('{{ $post->id }}')">
                    <div class="post-title">{{ $post->title }}</div>
                    
                    @if($post->image)
                        <div class="post-image">
                            <a href="{{ route('posts.show', ['id' => $post->id]) }}">
                                <img src="{{ asset('storage/' . $post->image) }}" alt="{{ $post->title }}">
                            </a>

                            <div class="post-overlay" data-post-id="{{ $post->id }}">
                                <div class="post-info">
                                    <span class="like-icon"><img src="/icons/like2.svg" alt="Likes"> {{ $post->likes_count }}</span>
                                    <span class="comment-icon"><img src="/icons/comment2.svg" alt="Comments"> {{ $post->comments_count }}</span>
                                </div>
                            </div>
                    @endif
                    
                    <!-- <div class="post-content">{{ $post->content }}</div> -->
                </div>

                @endforeach
            </div>
        @endif
    </div>
</body>
</html>
