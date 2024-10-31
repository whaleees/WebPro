document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const closeSearch = document.getElementById('close-search');
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-btn');

    searchButton.addEventListener('click', toggleSearchBar);
    searchInput.addEventListener('keyup', handleSearchInput);
    closeSearch.addEventListener('click', closeSearchBar);

    document.addEventListener("DOMContentLoaded", function() {
        // Select all posts and attach click events
        const posts = document.querySelectorAll('.grid-item');
        const modal = document.getElementById('postModal');
        const modalContent = document.getElementById('modal-post-content');
        const closeModal = document.querySelector('.close');
    
        posts.forEach(post => {
            post.addEventListener('click', function() {
                const postId = this.dataset.postId; // Get the post ID from data attribute
    
                // Fetch post details (you can replace with an AJAX request if needed)
                fetch(`/posts/${postId}`)
                    .then(response => response.json())
                    .then(data => {
                        // Populate modal with post content
                        modalContent.innerHTML = `
                            <h2>${data.title}</h2>
                            <img src="/storage/${data.image}" alt="${data.title}" />
                            <p>${data.content}</p>
                        `;
    
                        // Show the modal
                        modal.style.display = "block";
                    })
                    .catch(error => console.error('Error fetching post data:', error));
            });
        });
    
        // Close the modal when clicking the "x"
        closeModal.addEventListener('click', function() {
            modal.style.display = "none";
        });
    
        // Close modal when clicking outside of it
        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
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
});
