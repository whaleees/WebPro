document.addEventListener("DOMContentLoaded", function () {
    const likeButtons = document.querySelectorAll('.like-button');
    const commentButtons = document.querySelectorAll('.comment-button');
    const likeableImages = document.querySelectorAll('.likeable-image');
    const currentPage = window.location.pathname.split('/').pop();
    
    const recentLabel = document.getElementById('recent-label');
    const clearHistoryButton = document.getElementById('clear-history');
    const searchPopup = document.getElementById('search-popup');
    const searchButton = document.getElementById('search-btn');
    const closeSearchButton = document.getElementById('close-search');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('user-results-list');
    const historyList = document.getElementById('history-list');
    const modalImage = document.querySelectorAll('.modalImage');

    modalImage.forEach(button => button.addEventListener('dblclick', handleImageDoubleClick));
    
    // Attach event listener once on page load
    document.addEventListener('DOMContentLoaded', () => {
        const modalLikeIcon = document.getElementById("modal-like-icon");
        const modalImage = document.getElementById("modalImage");

        if (modalLikeIcon) {
            modalLikeIcon.addEventListener('click', () => handleLikeButtonClick(modalLikeIcon));
        }
        if (modalImage) {
            modalImage.addEventListener('dblclick', handleImageDoubleClick);
        }
    });

    // Attach event listeners
    likeButtons.forEach(button => button.addEventListener('click', handleLikeButtonClick));
    commentButtons.forEach(button => button.addEventListener('click', handleCommentButtonClick));
    document.querySelectorAll('.comment-input').forEach(input => {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevents the form from actually submitting
                handleCommentSubmit(this); // Call the function to handle the comment
            }
        });
    });

    document.querySelectorAll('.nav-list li').forEach(item => {
        const page = item.getAttribute('data-page');
        if (currentPage.includes(page)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Like button click handler (for both main feed and modal)
    function handleLikeButtonClick() {
        const postId = this.getAttribute('data-post-id');
        likePost(postId, this); // Pass the clicked element to handle animation and icon update
    }

    // Double-click like handler for the modal image
    function handleImageDoubleClick(event) {
        const postId = event.target.getAttribute('data-post-id');
        likePost(postId); // Trigger the like function with postId
    }

    // Main function to handle like action
    function likePost(postId, likeIconElement = null) {
        const likeIcon = likeIconElement || document.querySelector(`#like-icon-${postId}`);
        
        if (likeIcon) {
            triggerLikeAnimation(likeIcon);
        }

        fetch(`/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        })
        .then(response => response.json())
        .then(data => {
            // Update all like counts across the main feed
            document.querySelectorAll(`.like-count[data-post-id="${postId}"]`).forEach(countElement => {
                countElement.textContent = `${data.likes_count} `;
            });

            // Update the like count in the modal if it's open and showing the same post
            const modalImage = document.getElementById("modalImage");
            const modalPostId = modalImage.getAttribute('data-post-id');
            if (modalPostId === postId.toString()) {
                const modalLikeCountElement = document.getElementById("modalLikes");
                const modalLikeIcon = document.getElementById("modal-like-icon");
                if (modalLikeCountElement) {
                    modalLikeCountElement.textContent = `${data.likes_count} likes`;
                }

                if (modalLikeIcon) {
                    modalLikeIcon.classList.toggle('liked', data.liked);
                    modalLikeIcon.src = data.liked ? modalLikeIcon.getAttribute('data-liked-image') : modalLikeIcon.getAttribute('data-unliked-image');
                }
            }

            // Update the like icon state in both main feed and modal
            document.querySelectorAll(`.like-icon[data-post-id="${postId}"]`).forEach(icon => {
                icon.classList.toggle('liked', data.liked);
                icon.src = data.liked ? icon.getAttribute('data-liked-image') : icon.getAttribute('data-unliked-image');
            });
        })
        .catch(error => console.error('Error:', error));
    }


    // Helper function to add the heart pop animation
    function triggerLikeAnimation(iconElement) {
        iconElement.classList.add('heart-pop-animation');
        setTimeout(() => {
            iconElement.classList.remove('heart-pop-animation');
        }, 400); // Match to CSS animation duration
    }

    // Attach event listeners for like buttons and double-click on modal image
    document.querySelectorAll('.like-button, .modal-icon-like-button').forEach(button => {
        button.addEventListener('click', handleLikeButtonClick);
    });

    document.querySelectorAll('.likeable-image').forEach(image => {
        image.addEventListener('dblclick', handleImageDoubleClick);
    });

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
                document.getElementById("modalUserProfileImage").src = `/storage/avatars/${data.user.avatar ?? 'default-avatar.png'}`;

                
                const modalLikeButton = document.getElementById("modalLikeButton");
                // const modalLikeButton = document.querySelector('.modal-icon-like-button');
                modalLikeButton.src = data.is_liked ? '/icons/like2.svg' : '/icons/like.svg';
                modalLikeButton.setAttribute("data-post-id", postId); // Set the correct postId for the button
                
                modalLikeButton.addEventListener("click", handleLikeButtonClick);         
                
                // Set form action dynamically
                const modalCommentButton = document.querySelector(".modal-icon-comment-button");
                const form = document.getElementById("modalCommentForm");
                form.action = `/posts/${postId}/comments`;
                const commentInput = document.querySelector('.modal-comment-input');
                commentInput.setAttribute('data-post-id', postId);
                modalCommentButton.addEventListener("click", function() {
                    commentInput.focus();
                });

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

    // Open search popup
    function openSearchPopup() {
        searchPopup.classList.remove('slide-in');
        searchPopup.classList.add('slide-out');
        sidebar.classList.add('collapsed');
        fetchSearchHistory(); // Fetch and display search history
    }

    // Close search popup
    function closeSearchPopup() {
        searchPopup.classList.add('slide-in');
        searchPopup.classList.remove('slide-out');
        sidebar.classList.remove('collapsed');
        searchResults.innerHTML = ''; // Clear search results
        searchInput.value = ''; // Clear search input
    }

    // Event listeners
    searchButton.addEventListener("click", openSearchPopup);
    closeSearchButton.addEventListener("click", closeSearchPopup);
    searchInput.addEventListener('input', handleSearchInput);

    // Handle search input in real-time
    function handleSearchInput() {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            recentLabel.style.display = 'none'; // Hide "Recent" label
            clearHistoryButton.style.display = 'none';
            historyList.style.display = 'none';
            fetchUserSearchResults(query);
        } else {
            recentLabel.style.display = 'block'; // Show "Recent" label
            clearHistoryButton.style.display = 'block';
            historyList.style.display = 'block';
            fetchSearchHistory(); // Show recent search history
            searchResults.innerHTML = ''; // Clear search results if input is empty
        }
    }

    // Fetch user search results based on the query
    function fetchUserSearchResults(query) {
        fetch(`/search-users?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            // .then(data => displayUserResults(data))
            .then(data => {
                // console.log(data); 
                displayUserResults(data);
            })
            .catch(error => console.error('Error fetching user search results:', error));
    }

    // Display user search results
    function displayUserResults(users) {
        searchResults.innerHTML = '';
        if (users.length > 0) {
            users.forEach(user => {
                const userElement = createUserElement(user);
                userElement.addEventListener('click', () => {
                    console.log(user.id);
                    saveSearchHistory(user.id);
                    closeSearchPopup();
                })
                searchResults.appendChild(userElement);
            });
        } else {
            searchResults.innerHTML = '<p>No users found.</p>';
        }
    }

    // Create user element
    function createUserElement(user) {
        const userElement = document.createElement('div');
        userElement.classList.add('user-item');
        userElement.style.cursor = 'pointer'; // Set cursor to indicate it's clickable
        userElement.addEventListener('click', () => {
            window.location.href = `/profile/${user.name}`; // Redirect to the user's profile
        });

        userElement.innerHTML = `
            <img src="/storage/avatars/${user.profile_image || 'default-avatar.png'}" alt="${user.name}" class="user-avatar">
            <div class="user-info">
                <strong>${user.name}</strong>
                <p>${user.email || ''}</p>
            </div>
        `;

        return userElement;
    }

    // Display search history
    function displayHistory(historyItems) {
        historyList.innerHTML = '';
        if (historyItems.length > 0) {
            historyItems.forEach(item => {
                const user = item.searched_user; // Access searched_user directly
                const li = document.createElement('li');
                li.classList.add('history-item');
                li.style.cursor = 'pointer';
                li.addEventListener('click', () => {
                    window.location.href = `/profile/${user.name}`
                    console.log(user.id);
                    saveSearchHistory(user.id);
                });
                li.innerHTML = `
                    <img src="/storage/avatars/${user.profile_image || 'default-avatar.png'}" alt="${user.name}" class="user-avatar">
                    <div class="user-info">
                        <a href="/profile/${user.name}">
                            <strong>${user.name}</strong>
                        </a>
                    </div>
                `;
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('remove-btn');
                deleteButton.textContent = 'X';
                deleteButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    event.stopImmediatePropagation(); // Ensure event doesn't propagate
                    deleteHistoryItem(item.id);
                });

                // Append the delete button to the list item
                li.appendChild(deleteButton);
                historyList.appendChild(li);
            });
        } else {
            historyList.innerHTML = '<p>No recent searches.</p>';
        }
    }

    // Fetch search history
    function fetchSearchHistory() {
        fetch('/get-search-history')
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                displayHistory(data);
            })
            .catch(error => console.error('Error fetching search history:', error));
    }

    // Save search history (adjusted for searched_user_id)
    function saveSearchHistory(searchedUserId) {
        fetch('/add-search-history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({ searched_user_id: searchedUserId })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Search history saved:', data);
            fetchSearchHistory();
        })
        .catch(error => console.error('Error saving search history:', error));
    }

    // Clear all search history on button click
    document.getElementById('clear-history').addEventListener('click', function() {
        fetch('/clear-search-history', {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        })
        .then(() => {
            historyList.innerHTML = ''; // Clear frontend display
        })
        .catch(error => console.error('Error clearing search history:', error));
    });

    // Function to delete a specific search history item by its ID
    function deleteHistoryItem(id) {
        fetch(`/delete-search-history-item/${id}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Deleted history item:', data);
            fetchSearchHistory(); // Refresh the history list after deletion
        })
        .catch(error => console.error('Error deleting search history item:', error));
    }

});
