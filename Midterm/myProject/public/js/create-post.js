document.addEventListener("DOMContentLoaded", function() {
    // Search-related variables
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const closeSearch = document.getElementById('close-search');
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-btn');

    const uploadImage = document.getElementById('uploadImage');
    const cropModal = document.getElementById('cropModal');
    const image = document.getElementById('image');
    const cropButton = document.getElementById('cropButton');
    const cropModalClose = document.querySelector('.close');
    let cropper;
    let originalFileName = '';

    // Show modal and initialize cropper when an image is selected
    uploadImage.addEventListener('change', function(event) {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            originalFileName = file.name; // Capture the original filename
            const reader = new FileReader();
            reader.onload = function(e) {
                image.src = e.target.result;
                cropModal.style.display = 'flex'; // Display modal

                if (cropper) cropper.destroy(); // Destroy previous cropper instance

                cropper = new Cropper(image, {
                    aspectRatio: 1,
                    viewMode: 1,
                    background: false,
                });
            };
            reader.readAsDataURL(file);
        }
    });

    // Crop and save the image
    cropButton.addEventListener('click', function() {
        if (cropper) {
            const canvas = cropper.getCroppedCanvas({
                width: 300,
                height: 300
            });

            canvas.toBlob(blob => {
                const croppedImageUrl = URL.createObjectURL(blob);
                image.src = croppedImageUrl;
                cropModal.style.display = 'none'; // Hide modal after cropping

                // Use original filename for cropped image
                const dataTransfer = new DataTransfer();
                const file = new File([blob], originalFileName, { type: "image/jpeg" });
                dataTransfer.items.add(file);
                uploadImage.files = dataTransfer.files;
            });
        }
    });

    // Close modal on clicking the close button
    cropModalClose.addEventListener('click', function() {
        cropModal.style.display = 'none';
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        uploadImage.value = ''; // Reset the file input if cropping is canceled
    });

    // Search bar functionality
    if (searchButton) {
        searchButton.addEventListener('click', toggleSearchBar);
    }
    if (searchInput) {
        searchInput.addEventListener('keyup', handleSearchInput);
    }
    if (closeSearch) {
        closeSearch.addEventListener('click', closeSearchBar);
    }

    // Function to toggle search bar visibility
    function toggleSearchBar() {
        searchBar.style.display = searchBar.style.display === 'none' ? 'block' : 'none';
    }

    // Real-time search handling
    function handleSearchInput() {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            fetchUserSearchResults(query);
        } else {
            searchResults.innerHTML = ''; // Clear results if input is empty
        }
    }

    // Fetch user search results based on query
    function fetchUserSearchResults(query) {
        fetch(`/search-users?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => displayUserResults(data))
            .catch(error => console.error('Error fetching user search results:', error));
    }

    // Display user results in search bar
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
