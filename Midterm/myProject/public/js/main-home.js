document.addEventListener("DOMContentLoaded", function () {
    const likeButtons = document.querySelectorAll('.like-button');
    const commentButtons = document.querySelectorAll('.comment-button');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const closeSearch = document.getElementById('close-search');
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-btn');

    // Attach event listeners
    likeButtons.forEach(button => button.addEventListener('click', handleLikeButtonClick));
    commentButtons.forEach(button => button.addEventListener('click', handleCommentButtonClick));
    searchButton.addEventListener('click', toggleSearchBar);
    searchInput.addEventListener('keyup', handleSearchInput);
    closeSearch.addEventListener('click', closeSearchBar);

    // Function to handle like button click
    function handleLikeButtonClick() {
        const postId = this.dataset.postId;
        fetch(`/like-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({ post_id: postId })
        })
        .then(response => response.json())
        .then(data => {
            document.querySelector(`#like-count-${postId}`).textContent = `${data.likes_count} likes`;
        })
        .catch(error => console.error('Error:', error));
    }

    // Function to handle comment button click
    function handleCommentButtonClick() {
        const postId = this.dataset.postId;
        const commentSection = document.querySelector(`#comments-${postId}`);
        commentSection.style.display = commentSection.style.display === 'none' || commentSection.style.display === '' ? 'block' : 'none';
    }

    // Toggle search bar visibility
    function toggleSearchBar() {
        searchBar.style.display = searchBar.style.display === 'none' ? 'block' : 'none';
    }

    // Handle search input in real-time
    function handleSearchInput() {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            fetchUserSearchResults(query);
        } else {
            searchResults.innerHTML = ''; // Clear results if input is empty
        }
    }

    // Fetch user search results based on the query
    function fetchUserSearchResults(query) {
        fetch(`/search-users?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                console.log(data); // Debugging line to check data
                displayUserResults(data);
            })
            .catch(error => console.error('Error fetching user search results:', error));
    }

    // Display user results in the search bar
    function displayUserResults(users) {
        searchResults.innerHTML = '';
        if (users.length > 0) {
            users.forEach(user => {
                const userElement = createUserElement(user);
                searchResults.appendChild(userElement);
            });
        } else {
            searchResults.innerHTML = '<p>No users found.</p>';
        }
    }

    // Helper function to create a user element
    function createUserElement(user) {
        const userElement = document.createElement('div');
        userElement.classList.add('user-item');
        userElement.innerHTML = `
            <img src="/storage/avatars/${user.profile_image || 'default-avatar.png'}" alt="${user.name}" class="user-avatar">
            <div class="user-info">
                <a href="/profile/${user.name}">
                    <strong>${user.name}</strong>
                </a>
                <p>${user.email || ''}</p>
            </div>
        `;
        return userElement;
    }

    // Close search bar and clear content
    function closeSearchBar() {
        searchBar.style.display = 'none';
        searchResults.innerHTML = '';
        searchInput.value = '';
    }

    // Helper function to create a post element
    function createPostElement(post) {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <div class="post-header">
                <img class="post-avatar" src="/storage/avatars/default-avatar.png" alt="Profile Image">
                <div class="post-user-info">
                    <a href="/profile/${post.user ? post.user.username : ''}">
                        <strong>${post.user ? post.user.name : 'Unknown User'}</strong>
                    </a>
                    <p>${new Date(post.created_at).toLocaleDateString()}</p>
                </div>
            </div>
            <div class="post-image">
                <img src="/storage/${post.image}" alt="${post.title}">
            </div>
            <div class="post-footer">
                <p><strong>${post.user ? post.user.name : 'Unknown User'}</strong> ${post.content}</p>
                <p>${post.likes_count ?? 0} Likes</p>
                <p>${post.comments_count ?? 0} Comments</p>
                <form action="{{ route('comments.store', $post->id) }}" method="POST">
                    @csrf
                    <input type="text" placeholder="Add a comment..." name="content" class="comment-input">
                </form>
            </div>
        `;
        return postElement;
    }
});
