let editMode = false;
        let currentSection = 'home';
        const EDIT_PASSWORD = "lelin123"; // Change this to your desired password
        
        // Gallery data storage
        let galleryData = {};
        let galleryDescriptions = {};
        let currentGalleryIndex = -1;
        let pendingImage = null;

        // Profile data storage
        let profileData = {
            name: "Mr.Lelin",
            title: "Senior R&D Executive",
            tagline: '"Innovating Tomorrow\'s Technology Today"',
            description: "Welcome to my professional portfolio. I am a dedicated R&D executive with extensive experience in technology innovation, product development, and strategic planning. My passion lies in transforming innovative ideas into practical solutions that drive business growth and technological advancement."
        };

        function showSection(section) {
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(s => {
                s.classList.remove('active');
            });
            
            // Remove active class from all nav buttons
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected section
            document.getElementById(section + 'Section').classList.add('active');
            
            // Add active class to clicked button
            event.target.classList.add('active');
            
            currentSection = section;
            
            // Hide edit panel when switching sections
            if (editMode) {
                toggleEditMode();
            }
        }

        function toggleEditMode() {
            if (!editMode) {
                // Show password modal before entering edit mode
                showPasswordModal();
            } else {
                // Exit edit mode
                editMode = false;
                document.getElementById('editPanel').classList.remove('active');
            }
        }

        function showPasswordModal() {
            document.getElementById('passwordModal').classList.add('active');
            document.getElementById('passwordInput').focus();
            document.getElementById('errorMessage').classList.remove('show');
        }

        function closePasswordModal() {
            document.getElementById('passwordModal').classList.remove('active');
            document.getElementById('passwordInput').value = '';
            document.getElementById('errorMessage').classList.remove('show');
        }

        function handlePasswordEnter(event) {
            if (event.key === 'Enter') {
                checkPassword();
            }
        }

        function checkPassword() {
            const enteredPassword = document.getElementById('passwordInput').value;
            
            if (enteredPassword === EDIT_PASSWORD) {
                // Correct password - enter edit mode
                closePasswordModal();
                enterEditMode();
                showNotification('Authentication successful! Edit mode activated.', 'success');
            } else {
                // Incorrect password
                document.getElementById('errorMessage').classList.add('show');
                document.getElementById('passwordInput').value = '';
                document.getElementById('passwordInput').focus();
                
                // Shake animation for error
                const modal = document.querySelector('.password-content');
                modal.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    modal.style.animation = '';
                }, 500);
            }
        }

        function enterEditMode() {
            editMode = true;
            const editPanel = document.getElementById('editPanel');
            editPanel.classList.add('active');
            
            // Populate edit fields with current data
            document.getElementById('editName').value = profileData.name;
            document.getElementById('editTitle').value = profileData.title;
            document.getElementById('editTagline').value = profileData.tagline.replace(/"/g, '');
            document.getElementById('editDescription').value = profileData.description;
        }

        function saveChanges() {
            // Get values from edit fields
            profileData.name = document.getElementById('editName').value || profileData.name;
            profileData.title = document.getElementById('editTitle').value || profileData.title;
            profileData.tagline = '"' + (document.getElementById('editTagline').value || profileData.tagline.replace(/"/g, '')) + '"';
            profileData.description = document.getElementById('editDescription').value || profileData.description;
            
            // Update display
            document.getElementById('displayName').textContent = profileData.name;
            document.getElementById('displayTitle').textContent = profileData.title;
            document.getElementById('displayTagline').textContent = profileData.tagline;
            document.getElementById('displayDescription').textContent = profileData.description;
            
            // Hide edit panel
            toggleEditMode();
            
            // Show success message
            showNotification('Changes saved successfully!', 'success');
        }

        function cancelEdit() {
            toggleEditMode();
            showNotification('Changes cancelled', 'info');
        }

        function handleContact(event) {
            event.preventDefault();
            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            event.target.reset();
        }

        function showNotification(message, type) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // Gallery Photo Functions (only accessible in edit mode)
        function editGalleryPhoto(index) {
            if (!editMode) {
                showNotification('Please enter edit mode first!', 'error');
                return;
            }
            
            currentGalleryIndex = index;
            document.getElementById('photoModal').classList.add('active');
            resetPhotoModal();
            
            // If editing existing image, populate description
            if (galleryDescriptions[index]) {
                document.getElementById('imageDescription').value = galleryDescriptions[index];
            }
        }

        function closePhotoModal() {
            document.getElementById('photoModal').classList.remove('active');
            resetPhotoModal();
        }

        function resetPhotoModal() {
            document.getElementById('urlInputContainer').style.display = 'none';
            document.getElementById('imageUrl').value = '';
            document.getElementById('imagePreview').innerHTML = '';
            document.getElementById('confirmBtn').style.display = 'none';
            document.getElementById('imageDescriptionContainer').style.display = 'none';
            document.getElementById('imageDescription').value = '';
            pendingImage = null;
        }

        function triggerFileUpload() {
            document.getElementById('fileInput').click();
        }

        function showUrlInput() {
            document.getElementById('urlInputContainer').style.display = 'block';
            document.getElementById('imageUrl').focus();
        }

        function handleFileUpload(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    showImagePreview(e.target.result);
                    pendingImage = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                showNotification('Please select a valid image file!', 'error');
            }
        }

        function handleUrlEnter(event) {
            if (event.key === 'Enter') {
                loadImageFromUrl();
            }
        }

        function loadImageFromUrl() {
            const url = document.getElementById('imageUrl').value.trim();
            if (url) {
                // Test if image loads
                const img = new Image();
                img.onload = function() {
                    showImagePreview(url);
                    pendingImage = url;
                };
                img.onerror = function() {
                    showNotification('Failed to load image from URL. Please check the link!', 'error');
                };
                img.src = url;
            }
        }

        function showImagePreview(src) {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `<img src="${src}" class="preview-image" alt="Preview">`;
            document.getElementById('confirmBtn').style.display = 'inline-block';
            document.getElementById('imageDescriptionContainer').style.display = 'block';
        }

        function confirmPhoto() {
            if (pendingImage && currentGalleryIndex >= 0) {
                galleryData[currentGalleryIndex] = pendingImage;
                const description = document.getElementById('imageDescription').value.trim();
                if (description) {
                    galleryDescriptions[currentGalleryIndex] = description;
                }
                updateGalleryItem(currentGalleryIndex);
                closePhotoModal();
                showNotification('Photo added successfully!', 'success');
            }
        }

        function updateGalleryItem(index) {
            const galleryItems = document.querySelectorAll('.gallery-item');
            const item = galleryItems[index];
            const description = galleryDescriptions[index] || `Gallery Photo ${index + 1}`;
            
            if (galleryData[index]) {
                item.innerHTML = `
                    <img src="${galleryData[index]}" alt="${description}" title="${description}">
                    <div class="gallery-overlay">
                        <div>${description}</div>
                    </div>
                `;
                item.classList.add('has-image');
            } else {
                // Reset to default state
                const defaultTexts = [
                    'Professional Gallery', 'Achievement Gallery', 'Project Gallery', 'Event Gallery',
                    'Team Gallery', 'Innovation Gallery', 'Conference Gallery', 'Award Gallery'
                ];
                item.innerHTML = `
                    <span>${defaultTexts[index]}</span>
                    <div class="gallery-overlay">
                        🔒 Login to add photos
                    </div>
                `;
                item.classList.remove('has-image');
            }
        }

        // Add CSS for notification animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            showNotification('Welcome to Mr. Lelin\'s Professional Portfolio!', 'info');
            
            // Try to load profile photo, hide if doesn't exist
            const profilePhoto = document.getElementById('profilePhoto');
            const img = new Image();
            img.onload = function() {
                profilePhoto.innerHTML = '<img src="images/Lelin.png" alt="Profile Photo">';
                profilePhoto.classList.add('has-image');
            };
            img.onerror = function() {
                // Keep empty orange circle if no image
                profilePhoto.innerHTML = '';
            };
            img.src = 'images/Lelin.png';
        });
