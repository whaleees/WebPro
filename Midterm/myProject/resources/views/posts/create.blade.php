<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Post</title>
    <link rel="stylesheet" href="{{ asset('css/create-posts.css') }}">
    <script defer src="{{ asset('js/create-post.js') }}"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css" rel="stylesheet">
    <script defer src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js"></script>
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
