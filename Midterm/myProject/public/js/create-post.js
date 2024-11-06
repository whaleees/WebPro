document.addEventListener("DOMContentLoaded", function() {
    const searchPopup = document.getElementById('search-popup');
    const searchButton = document.getElementById('search-btn');
    const closeSearchButton = document.getElementById('close-search');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('user-results-list');
    const historyList = document.getElementById('history-list');
    const recentLabel = document.getElementById('recent-label');
    const clearHistoryButton = document.getElementById('clear-history');

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