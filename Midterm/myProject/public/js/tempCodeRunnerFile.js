    function openModal(postId) {
        console.log("open modal");
        // Fetch post data from server (adjust the URL to your backend endpoint)
        fetch(`/posts/${postId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Populate modal with data
                modalImage.src = `/storage/${data.image}`;
                modalUserName.textContent = data.user.name;
                modalCaption.textContent = data.content;
                modalLikes.textContent = `${data.likes_count} likes`;
                
                // Populate comments
                modalComments.innerHTML = "";
                data.comments.forEach(comment => {
                    const commentElement = document.createElement("p");
                    commentElement.textContent = `${comment.user.name}: ${comment.content}`;
                    modalComments.appendChild(commentElement);
                });

                // Display modal
                postModal.style.display = "block";
            })
            .catch(error => console.error("Error loading post data:", error));
    }
