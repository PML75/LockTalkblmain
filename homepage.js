import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import{getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

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

// Add loading animation to the page
function showLoadingState() {
    const container = document.querySelector('.homepage-container');
    
    // Create loading overlay
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
    
    // Add overlay to container
    container.style.position = 'relative';
    container.appendChild(loadingOverlay);
}

function hideLoadingState() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.remove();
        }, 300);
    }
}

// Show loading state initially
document.addEventListener('DOMContentLoaded', () => {
    showLoadingState();
});

// Function to animate user data appearance
function animateUserDataAppearance() {
    const detailRows = document.querySelectorAll('.detail-row');
    
    detailRows.forEach((row, index) => {
        // Set initial state
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        // Animate with delay based on index
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, 100 + (index * 150));
    });
}

// Check for authenticated user and load their data
onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    
    if (loggedInUserId) {
        console.log("User authenticated:", user?.email);
        
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap) => {
            // Hide loading state
            hideLoadingState();
            
            if (docSnap.exists()) {
                const userData = docSnap.data();
                
                // Update user info
                document.getElementById('loggedUserFName').innerText = userData.firstName || 'N/A';
                document.getElementById('loggedUserLName').innerText = userData.lastName || 'N/A';
                document.getElementById('loggedUserEmail').innerText = userData.email || 'N/A';
                
                // Animate the appearance of user data
                animateUserDataAppearance();
                
                // Update page title with user name
                document.title = `Lock Talk | ${userData.firstName} ${userData.lastName}`;
            } else {
                console.log("No document found matching user ID");
                // Show error message
                const container = document.querySelector('.homepage-container');
                container.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: #dc3545; margin-bottom: 1rem;"></i>
                        <h2>Account Data Not Found</h2>
                        <p>We couldn't retrieve your account information.</p>
                        <button id="logout" class="btn logout-btn" style="margin-top: 1rem;">
                            <i class="fas fa-sign-out-alt"></i> Return to Login
                        </button>
                    </div>
                `;
                
                // Re-attach logout event listener
                document.getElementById('logout').addEventListener('click', handleLogout);
            }
        })
        .catch((error) => {
            // Hide loading state
            hideLoadingState();
            
            console.error("Error getting document:", error);
            
            // Show error message
            const container = document.querySelector('.homepage-container');
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #fd7e14; margin-bottom: 1rem;"></i>
                    <h2>Something Went Wrong</h2>
                    <p>We couldn't load your account information. Please try again later.</p>
                    <button id="logout" class="btn logout-btn" style="margin-top: 1rem;">
                        <i class="fas fa-sign-out-alt"></i> Return to Login
                    </button>
                </div>
            `;
            
            // Re-attach logout event listener
            document.getElementById('logout').addEventListener('click', handleLogout);
        })
    }
    else {
        console.log("User ID not found in local storage");
        
        // Hide loading state
        hideLoadingState();
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    }
})

// Handle logout functionality
function handleLogout() {
    // Show logging out animation
    const button = document.getElementById('logout');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
    button.disabled = true;
    
    // Remove user ID from local storage
    localStorage.removeItem('loggedInUserId');
    
    // Sign out from Firebase Auth
    signOut(auth)
        .then(() => {
            // Add slight delay for better UX
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 800);
        })
        .catch((error) => {
            console.error('Error signing out:', error);
            button.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
            button.disabled = false;
            
            // Show error alert
            alert('Error signing out. Please try again.');
        });
}

// Add event listener to logout button
const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
}