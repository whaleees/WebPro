<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile - Instagram Clone</title>
    <link rel="stylesheet" href="{{ asset('/css/profile.css') }}">
    <script defer src="{{ asset('/js/main-profile.js') }}"></script>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <!-- Sidebar -->
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

        <!-- Main Content Area -->
        <div class="profile-content">
            @yield('content')
            <!-- Profile Header -->
            <div class="profile-header">
                <div class="profile-pic">
                    <img class="post-avatar" src="{{ asset('/storage/avatars/' . ($user->profile_image ?? 'default-avatar.png')) }}" alt="Profile Image">    
                </div>
                <div class="profile-info">
                    <div class="profile-username">
                        <h2>{{ $user->name }}</h2>
                    </div>
                    <div class="profile-stats">
                        <span>{{ $user->posts_count }} posts</span>
                    </div>
                </div>
            </div>

            <!-- Profile Navigation Tabs (Posts, Saved, Tagged) -->
            <div class="profile-nav">
                <button class="nav-btn">POSTS</button>
            </div>

            <!-- Show Posts or Empty State -->
            @if($user->posts->isEmpty())
                <!-- Empty State (If No Posts) -->
                <div class="empty-state">
                    <p>Share Photos</p>
                    <img src="icons/camera.svg" alt="Camera Icon">
                    <p>When you share photos, they will appear on your profile.</p>
                </div>
            @else
                <!-- Display Posts Grid -->
                <div class="posts-grid">
                @foreach($user->posts as $post)
                    <div class="post" data-post-id="{{ $post->id }}" onclick="openModal('{{ $post->id }}')">
                        <img src="{{ asset('storage/' . $post->image) }}" alt="{{ $post->title }}" class="post-thumbnail">
                        <div class="post-overlay" data-post-id="{{ $post->id }}">
                            <div class="post-info">
                                <span class="like-icon"><img src="/icons/like2.svg" alt="Likes"> {{ $post->likes_count }}</span>
                                <span class="comment-icon"><img src="/icons/comment2.svg" alt="Comments"> {{ $post->comments_count }}</span>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
            @endif
        </div>
    </div>

        <!-- Modal for post details -->
        <div class="modal" id="postModal" style="display:none;">
            <div class="modal-content">
                <span class="close">&times;</span>
                <div class="modal-left">
                    <img id="modalImage" src="" alt="Post Image" class="modalImage">
                </div>
                <div class="modal-right">
                    <div class="post-details">
                        <div class="post-user">
                            <img id="modalUserProfileImage" src="" alt="Profile Image" class="user-avatar-modal">
                            <a href="#" id="modalUserNameLink">
                                <span id="modalUserName"></span>
                            </a>
                        </div>
                    </div>
                    <p id="modalCaption" class="modal-caption"></p>
                    <p id="modalLikes" class="modal-likes"></p>
                    <div class="post-icons-modal">
                        <img alt="Like Icon" data-liked-image="/icons/like2.svg" 
                            id="modalLikeButton" data-unliked-image="/icons/like.svg" class="modal-icon-like-button like-icon">
                        <img src="/icons/comment.svg" alt="Comment Icon" class="modal-icon-comment-button">
                    </div>
                    <div id="modalComments" class="modal-comments"></div>
                    <form id="modalCommentForm" class="modal-comment-form">
                        @csrf
                        <input type="text" placeholder="Add a comment..." name="content" class="modal-comment-input" data-post-id="">
                        <button type="submit">Post</button>
                    </form>
                    </div>
                </div>
            </div>
        </div>
</body>
</html>
