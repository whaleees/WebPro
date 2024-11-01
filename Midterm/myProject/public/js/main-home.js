document.addEventListener("DOMContentLoaded", function () {
    const likeButtons = document.querySelectorAll('.like-button');
    const commentButtons = document.querySelectorAll('.comment-button');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const closeSearch = document.getElementById('close-search');
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-btn');
    const likeableImages = document.querySelectorAll('.likeable-image');

    // Attach event listeners
    likeButtons.forEach(button => button.addEventListener('click', handleLikeButtonClick));
    commentButtons.forEach(button => button.addEventListener('click', handleCommentButtonClick));
    searchButton.addEventListener('click', toggleSearchBar);
    searchInput.addEventListener('keyup', handleSearchInput);
    closeSearch.addEventListener('click', closeSearchBar);
    document.querySelectorAll('.comment-input').forEach(input => {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevents the form from actually submitting
                handleCommentSubmit(this); // Call the function to handle the comment
            }
        });
    });
    likeableImages.forEach(image => {
        image.addEventListener('dblclick', handleImageDoubleClick);
    });

    // Like button click handler
    function handleLikeButtonClick() {
        // console.log("Like button clicked!!!!");
        const postId = this.getAttribute('data-post-id');
        fetch(`/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        })
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            // Update the likes count
            document.querySelector(`#like-count-${postId}`).textContent = `${data.likes_count}`;
            // Toggle 'liked' class for styling
            if (data.liked) {
                this.classList.add('liked');
            } else {
                this.classList.remove('liked');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function handleImageDoubleClick(event) {
        const postId = event.target.getAttribute('data-post-id');
        likePost(postId);  // Call the like function with the post ID
    }

    function likePost(postId) {
        fetch(`/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        })
        .then(response => response.json())
        .then(data => {
            // Update the likes count
            const likeCountElement = document.querySelector(`#like-count-${postId}`);
            if (likeCountElement) {
                likeCountElement.textContent = `${data.likes_count}`;
            }

            // Optionally add a visual feedback like a quick animation (optional)
            const image = document.querySelector(`.likeable-image[data-post-id="${postId}"]`);
            image.classList.add('liked-animation');
            setTimeout(() => {
                image.classList.remove('liked-animation');
            }, 500);

            // Toggle like icon state
            const likeIcon = document.querySelector(`#like-icon-${postId}`);
            if (likeIcon) {
                likeIcon.classList.toggle('liked');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Comment button click handler
    function handleCommentButtonClick() {
        const postId = this.getAttribute('data-post-id');
        const commentInput = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
        
        // Focus on the comment input field
        if (commentInput) {
            commentInput.focus();
        }
    }

    function handleCommentSubmit(inputElement) {
        const postId = inputElement.getAttribute('data-post-id');
        const content = inputElement.value.trim();
    
        if (content === '') return;
    
        fetch(`/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({ content })
        })
        .then(response => response.json())
        .then(data => {
            // console.log('Server response:', data); // Check server response here
    
            const commentCountElement = document.querySelector(`#comment-count-${postId}`);
            if (commentCountElement) {
                commentCountElement.textContent = `${data.comments_count}`; // Update comment count
            } else {
                console.error(`Element with ID #comment-count-${postId} not found.`);
            }
    
            inputElement.value = ''; // Clear the input
        })
        .catch(error => console.error('Error:', error));
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

        document.querySelectorAll(".comment").forEach(function (element) {
            element.addEventListener("click", function () {
                const postId = this.getAttribute("data-post-id");
                openModal(postId);
            });
        });
    
        document.querySelector(".close").addEventListener("click", function() {
            // console.log("close brooow");
            document.getElementById("postModal").style.display = "none";
        });
        
        document.getElementById("postModal").onclick = function(event) {
            // console.log("close brooow");
            if (event.target === document.getElementById("postModal")) {
                document.getElementById("postModal").style.display = "none";
            }
        };
    
        function openModal(postId) {
            console.log("Opening modal for post", postId);
            fetch(`/posts/${postId}/json`)
                .then(response => response.json())
                .then(data => {
                    // Populate modal with data
                    // console.log(data.user.name);
                    document.getElementById("modalImage").src = `/storage/${data.image}`;
                    document.getElementById("modalUserName").textContent = data.user.name;
                    document.getElementById("modalUserNameLink").href = `/profile/${data.user.name}`;
                    document.getElementById("modalCaption").textContent = data.caption;
                    document.getElementById("modalLikes").textContent = `${data.likes_count} likes`;
    
            
        
                    // Populate comments
                    const modalComments = document.getElementById("modalComments");
                    modalComments.innerHTML = ""; // Clear previous comments
                    data.comments.forEach(comment => {
                        const commentElement = document.createElement("p");
                        commentElement.textContent = `${comment.user.name}: ${comment.content}`;
                        modalComments.appendChild(commentElement);
                    });
        
                    // Display modal
                    document.getElementById("postModal").style.display = "flex";
                })
                .catch(error => console.error("Error loading post data:", error));
        }
});
