document.addEventListener("DOMContentLoaded", function () {
    const likeButtons = document.querySelectorAll('.like-button');
    const commentButtons = document.querySelectorAll('.comment-button');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const closeSearch = document.getElementById('close-search');
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-btn');
    const likeableImages = document.querySelectorAll('.likeable-image');
    const currentPage = window.location.pathname.split('/').pop();

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

    document.querySelectorAll('.nav-list li').forEach(item => {
        const page = item.getAttribute('data-page');
        if (currentPage.includes(page)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
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
            // Update the likes count in the main feed
            const likeCountElement = document.querySelector(`#like-count-${postId}`);
            if (likeCountElement) {
                likeCountElement.textContent = `${data.likes_count}`;
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

            const commentCountElement = document.getElementById(`comment-count-${postId}`);
            let currentCount = parseInt(commentCountElement.textContent, 10);
            commentCountElement.textContent = currentCount + 1;

            console.log("Comment added dynamically.");
        } else {
            console.error("Failed to add comment:", data.message);
        }
    })
    .catch(error => console.error("Error:", error));
});

        

        
});
