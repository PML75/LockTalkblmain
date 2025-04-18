import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCKwYXg-Au7_vAIZgtXtCfM4smZ04mlHrA",
    authDomain: "login-form-eb5a3.firebaseapp.com",
    projectId: "login-form-eb5a3",
    storageBucket: "login-form-eb5a3.firebasestorage.app",
    messagingSenderId: "633147902051",
    appId: "1:633147902051:web:341fc1e997c69debf19056"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Function to add a loading overlay on the homepage
function showLoadingState() {
    const container = document.querySelector('.homepage-container');
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.style.position = 'absolute';
    loadingOverlay.style.top = '0';
    loadingOverlay.style.left = '0';
    loadingOverlay.style.width = '100%';
    loadingOverlay.style.height = '100%';
    loadingOverlay.style.background = 'rgba(255, 255, 255, 0.8)';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.justifyContent = 'center';
    loadingOverlay.style.alignItems = 'center';
    loadingOverlay.style.zIndex = '999';
    
    loadingOverlay.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #4361ee;"></i>';
    
    // Ensure the container is positioned relatively so the overlay displays correctly
    container.style.position = 'relative';
    container.appendChild(loadingOverlay);
}

// Function to remove the loading overlay
function hideLoadingState() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.remove();
        }, 300);
    }
}

// Optional animation for user data appearance
function animateUserDataAppearance() {
    const detailRows = document.querySelectorAll('.detail-row');
    detailRows.forEach((row, index) => {
        // Set initial state
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        // Animate appearance with delay
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, 100 + (index * 150));
    });
}

// Show loading state as soon as the DOM loads
document.addEventListener('DOMContentLoaded', () => {
    showLoadingState();
});

// Listen for changes in authentication state
onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    
    if (user && loggedInUserId) {
        console.log("User authenticated:", user.email);
        
        // Fetch user data from Firestore (optional, for additional UI personalization)
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap) => {
            hideLoadingState();
            
            if (docSnap.exists()) {
                const userData = docSnap.data();
                
                // Update UI with user details if these elements exist in your HTML
                document.getElementById('loggedUserFName').innerText = userData.firstName || 'N/A';
                document.getElementById('loggedUserLName').innerText = userData.lastName || 'N/A';
                document.getElementById('loggedUserEmail').innerText = userData.email || 'N/A';
                
                // Optionally animate the appearance of user data
                animateUserDataAppearance();
                
                // Update page title with user's name
                document.title = `Lock Talk | ${userData.firstName} ${userData.lastName}`;
            } else {
                console.log("No document found matching the user ID");
                // Optionally display an error message here before the user takes any action
            }
            
            // Attach event listener to the start chatting button
            const startChatButton = document.getElementById('startChat');
            if (startChatButton) {
                startChatButton.addEventListener('click', () => {
                    window.location.href = 'https://main.d7o3j146atvep.amplifyapp.com/';
                });
            }
        })
        .catch((error) => {
            hideLoadingState();
            console.error("Error fetching user document:", error);
            // Optionally, you could still enable the start chatting button even if fetching user data fails
            const startChatButton = document.getElementById('startChat');
            if (startChatButton) {
                startChatButton.addEventListener('click', () => {
                    window.location.href = 'https://main.d7o3j146atvep.amplifyapp.com/';
                });
            }
        });
    } else {
        console.log("User not authenticated or user ID not found in local storage");
        hideLoadingState();
        // Redirect unauthenticated users back to the login page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    }
});

// Logout functionality for users who want to sign out
function handleLogout() {
    const button = document.getElementById('logout');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
    button.disabled = true;
    
    // Remove user ID from local storage
    localStorage.removeItem('loggedInUserId');
    
    // Sign out using Firebase Auth
    signOut(auth)
        .then(() => {
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 800);
        })
        .catch((error) => {
            console.error('Error signing out:', error);
            button.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
            button.disabled = false;
            alert('Error signing out. Please try again.');
        });
}

// Attach logout event listener if the logout button exists
const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
}
