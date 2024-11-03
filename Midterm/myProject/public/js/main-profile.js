document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const closeSearch = document.getElementById('close-search');
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-btn');

    searchButton.addEventListener('click', toggleSearchBar);
    searchInput.addEventListener('keyup', handleSearchInput);
    closeSearch.addEventListener('click', closeSearchBar);

    // Open modal when post image is clicked
    document.querySelectorAll(".post").forEach(post => {
        post.addEventListener("click", function(event) {
            event.preventDefault();
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

// Open modal when post image is clicked
function openModal(postId) {
    console.log("Opening modal for post", postId);
    
    fetch(`/posts/${postId}/json`)
        .then(response => response.json())
        .then(data => {
            // Populate modal with data
            document.getElementById("modalImage").src = `/storage/${data.image}`;
            document.getElementById("modalImage").setAttribute("data-post-id", postId); //add this
            document.getElementById("modalUserName").textContent = data.user.name;
            document.getElementById("modalUserNameLink").href = `/profile/${data.user.name}`;
            document.getElementById("modalCaption").textContent = data.caption;
            document.getElementById("modalLikes").textContent = `${data.likes_count} likes`;

            const modalImage = document.getElementById("modalImage");
            modalImage.removeEventListener("dblclick", handleImageDoubleClick);
            modalImage.addEventListener("dblclick", handleImageDoubleClick);

            // Set form action dynamically
            const form = document.getElementById("modalCommentForm");
            form.action = `/posts/${postId}/comments`;
            const commentInput = document.querySelector('.modal-comment-input');
            commentInput.setAttribute('data-post-id', postId);

            // Populate comments
            const modalComments = document.getElementById("modalComments");
            modalComments.innerHTML = ""; // Clear previous comments
            data.comments.forEach(comment => {
                const commentElement = document.createElement("p");
                const userLink = document.createElement("a");
                userLink.href = `/profile/${comment.user.name}`;
                userLink.textContent = comment.user.name;
                userLink.style.textDecoration = "none";
                userLink.style.fontWeight = "bold";
                userLink.style.color = "black";

                commentElement.appendChild(userLink);
                commentElement.appendChild(document.createTextNode(`: ${comment.content}`));

                modalComments.appendChild(commentElement);
            });

            // Display modal
            document.getElementById("postModal").style.display = "flex";
        })
        .catch(error => console.error("Error loading post data:", error));
}

document.querySelector('.modal-comment-input').addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default "Enter" behavior (e.g., adding a new line)
        document.getElementById("modalCommentForm").dispatchEvent(new Event('submit')); // Trigger form submission
    }
});

// Handle comment submission via AJAX
document.getElementById("modalCommentForm").addEventListener("submit", function(event) {
    console.log("Input comment triggered");
    event.preventDefault(); // Prevent form reload

    // Get the comment content and post ID
    const postId = document.querySelector('.modal-comment-input').getAttribute('data-post-id');
    const commentContent = event.target.querySelector('.modal-comment-input').value;

    console.log("Comment Content:", commentContent);
    console.log("Post ID:", postId);

    if (!commentContent) {
        console.warn("Comment content is empty");
        return;
    }

    // Send the comment via AJAX
    fetch(`/posts/${postId}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({
            content: commentContent
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Raw response data:", data);
        
        if (data.success) {
            // Clear the input field
            event.target.querySelector('.modal-comment-input').value = '';

            // Append the new comment to the comments section in the modal
            const modalComments = document.getElementById("modalComments");
            const newComment = document.createElement("p");
            newComment.innerHTML = `<strong>${data.user.name}</strong>: ${commentContent}`;
            modalComments.appendChild(newComment);

            // Update the comment count in the overlay
            const overlayCommentCountElement = document.querySelector(`.post-overlay[data-post-id="${postId}"] .comment-icon`);
            if (overlayCommentCountElement) {
                overlayCommentCountElement.innerHTML = `<img src="/icons/comment2.svg" alt="Comments"> ${data.comments_count}`;
            }

            const commentCountElement = document.getElementById(`comment-count-${postId}`);
            if (commentCountElement) {
                commentCountElement.textContent = data.comments_count;
            }

            console.log("Comment added dynamically.");
        } else {
            console.error("Failed to add comment:", data.message);
        }
    })
    .catch(error => console.error("Error:", error));
});


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
            // Update the likes count in the main feed
            const likeCountElement = document.querySelector(`#like-count-${postId}`);
            if (likeCountElement) {
                likeCountElement.textContent = `${data.likes_count}`;
            }


            // Update the overlay like count
            const overlayLikeCountElement = document.querySelector(`.post-overlay[data-post-id="${postId}"] .like-icon`);
            if (overlayLikeCountElement) {
                overlayLikeCountElement.innerHTML = `<img src="/icons/like2.svg" alt="Likes"> ${data.likes_count}`;
            }

            // Update the like count in the modal if it's open and showing the same post
            const modalImage = document.getElementById("modalImage");
            const modalPostId = modalImage.getAttribute('data-post-id');
            if (modalPostId === postId.toString()) {
                const modalLikeCountElement = document.getElementById("modalLikes");
                if (modalLikeCountElement) {
                    modalLikeCountElement.textContent = `${data.likes_count} likes`;
                }
            }

            // Add a quick animation to show the like action visually (optional)
            const image = document.querySelector(`.likeable-image[data-post-id="${postId}"]`);
            if (image) {
                image.classList.add('liked-animation');
                setTimeout(() => {
                    image.classList.remove('liked-animation');
                }, 500);
            }

            // Toggle like icon state
            const likeIcon = document.querySelector(`#like-icon-${postId}`);
            if (likeIcon) {
                likeIcon.classList.toggle('liked');
            }
        })
        .catch(error => console.error('Error:', error));
    }
});
