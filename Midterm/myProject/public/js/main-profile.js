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
});
