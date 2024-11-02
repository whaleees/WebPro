<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile - Instagram Clone</title>
    <link rel="stylesheet" href="{{ asset('/css/profile.css') }}">
    <script defer src="{{ asset('/js/main-profile.js') }}"></script>
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
            <!-- Logout Button at the Bottom -->
            <div class="logout">
                <a href="{{ route('logout') }}"><img src="/icons/logout.svg" alt="Logout Icon">Logout</a>
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
                        <div class="post-overlay">
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
                <img id="modalImage" src="" alt="Post Image">
            </div>
            <div class="modal-right">
                <div class="post-details">
                    <div class="post-user">
                        <img src="{{ asset('/storage/avatars/' . ($user->profile_image ?? 'default-avatar.png')) }}" alt="Profile Image" class="user-avatar-modal">
                        <a href="#" id="modalUserNameLink">
                            <span id="modalUserName"></span>
                        </a>
                    </div>
                </div>
                <p id="modalCaption" class="modal-caption"></p>
                <p id="modalLikes" class="modal-likes"></p>
                <div id="modalComments" class="modal-comments"></div>
                <form id="modalCommentForm" class="modal-comment-form">
                    <input type="text" placeholder="Add a comment..." id="modalCommentInput">
                    <button type="submit">Post</button>
                </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
