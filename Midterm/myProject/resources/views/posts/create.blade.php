<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Post</title>
    <link rel="stylesheet" href="{{ asset('css/create-posts.css') }}">
    <script defer src="{{ asset('js/create-post.js') }}"></script>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css" rel="stylesheet">
    <script defer src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Crop Modal -->
    <div id="cropModal" class="modal">
        <span class="close">&times;</span>
        <h2>Crop Your Image</h2>
        <div class="crop-container">
            <img id="image" src="" alt="Image to Crop">
        </div>
        <button id="cropButton">Crop & Save</button>
    </div>


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

        <!-- Main Content -->
        <div class="form-container">
            <h1>Create a New Post</h1>
            <p>Feel free to create your post below:</p>

            <!-- Error Display -->
            @if ($errors->any())
                <div>
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <!-- Create Post Form -->
            <form action="{{ route('posts.store') }}" method="post" enctype="multipart/form-data">
                @csrf
                <label for="title">Title:</label>
                <input type="text" name="title" required>

                <label for="content">Content:</label>
                <textarea name="content" rows="5" required></textarea>

                <label for="image">Upload Image:</label>
                <input type="file" id="uploadImage" name="image" accept="image/*" required>

                <button type="submit">Create Post</button>
            </form>
        </div>
    </div>
</body>
</html>
