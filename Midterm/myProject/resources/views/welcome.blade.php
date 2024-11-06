<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home - Instagram Clone</title>
    <link rel="stylesheet" href="{{ asset('/css/styles.css') }}">
    <script defer src="{{ asset('/js/main-home.js') }}"></script>
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
                <a href="{{ route('logout') }}"><img class="logo" id="logo" src="icons/logout.svg" alt="Logout Icon"><span>Logout</span></a>
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
        <div class="content">
            @if ($posts->isEmpty())
                <p>No posts available.</p>
            @else
                <div class="posts">
                    @foreach ($posts as $post)
                        <div class="post">
                            <!-- Post Header (Username and Profile Image) -->
                            <div class="post-header">
                                <img class="post-avatar" src="{{ asset('storage/avatars/' . ($post->user->profile_image ?? 'default-avatar.png')) }}" alt="Profile Image">

                                <div class="post-user-info">
                                    <a href="{{ route('people.profile', ['username' => $post->user->name]) }}"> {{$post->user->name}} </a>
                                    <p>{{ $post->created_at->diffForHumans() }}</p>
                                </div>
                            </div>

                            <!-- Post Image -->
                            @if($post->image)
                                <div class="post-image">
                                    <img src="{{ asset('storage/' . $post->image) }}" alt="{{ $post->title }}" class="likeable-image" data-post-id="{{ $post->id }}">
                                </div>
                            @endif

                            <!-- Post Footer (Caption, Likes, and Comments) -->
                            <div class="post-footer">
                            <div class="post-icons">
                                <img src="/icons/like.svg" alt="Like Icon" class="icon like-button" data-post-id="{{ $post->id }}" id="like-icon-{{ $post->id }}">
                                <img src="/icons/comment.svg" alt="Comment Icon" class="icon comment-button" data-post-id="{{ $post->id }}" id="comment-icon-{{ $post->id }}">
                            </div>
                             
                            <p><span id="like-count-{{ $post->id }}">{{ $post->likes_count ?? 0 }}</span> likes</p>
                            <p><a href="{{ route('people.profile', ['username' => $post->user->name]) }}">{{ $post->user->name }}</a> {{ $post->content }}</p>
                            <!-- <div class="comment" data-post-id="{{ $post->id }}" onclick="openModal('{{ $post->id }}')"><p>View all <span id="comment-count-{{ $post->id }}">{{ $post->comments->count() }}</span> comments</p></div> -->

                            <div class="comment" data-post-id="{{ $post->id }}" onclick="openModal('{{ $post->id }}')">
                                <p>View all <span id="comment-count-{{ $post->id }}">{{ $post->comments->count() }}</span> comments</p>
                            </div>

                            <!-- Add comment input with data-post-id for targeting -->
                            <form action="{{ route('posts.comment', $post->id) }}" method="POST">
                                @csrf
                                <input type="text" placeholder="Add a comment..." name="content" class="comment-input" data-post-id="{{ $post->id }}">
                            </form>
                        </div>


                        </div>
                    @endforeach
                </div>
            @endif
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
                            <img src="{{ asset('storage/avatars/' . ($post->user->profile_image ?? 'default-avatar.png')) }}" alt="Profile Image" class="user-avatar-modal">
                            <a href="#" id="modalUserNameLink">
                                <span id="modalUserName"></span>
                            </a>
                        </div>
                    </div>
                    <p id="modalCaption" class="modal-caption"></p>
                    <p id="modalLikes" class="modal-likes"></p>
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
    </div>
</body>
</html>
