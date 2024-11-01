<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{{ asset('/css/display-posts.css') }}">
    <script src="{{ asset('/js/main-post.js') }}"></script>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>All Posts</title>
</head>
<body>
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
                        </div>
                    @endif
                    
                    <!-- <div class="post-content">{{ $post->content }}</div> -->
                </div>

                @endforeach
            </div>
        @endif
    </div>

<!-- Modal for post details -->
<div class="modal" id="postModal" style="display:none;">
    <div class="modal-content">
        <span class="close" onclick="closeModal()">&times;</span>
        <div class="modal-left">
            <img id="modalImage" src="" alt="Post Image">
        </div>
        <div class="modal-right">
            <div class="modal-header">
                <img src="path/to/user-avatar.jpg" alt="User Avatar" class="user-avatar">
                <span id="modalUserName">Username</span>
            </div>
            <div id="modalCaption" class="modal-caption">This is the post caption.</div>
            <div id="modalLikes" class="modal-likes">0 likes</div>
            <div id="modalComments" class="modal-comments">
                <!-- Comments will be dynamically loaded here -->
                <p><strong>User1:</strong> Nice post!</p>
                <p><strong>User2:</strong> Great!</p>
            </div>
            <form id="modalCommentForm" class="modal-comment-form">
                <input type="text" placeholder="Add a comment..." id="modalCommentInput">
                <button type="submit">Post</button>
            </form>
        </div>
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
