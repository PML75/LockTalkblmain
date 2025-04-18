// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

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

// Enhanced message function with animation and message type support
function showMessage(message, divId, isSuccess = false) {
   const messageDiv = document.getElementById(divId);
   
   if (!messageDiv) return;
   
   // Add success class if it's a success message
   if (isSuccess) {
       messageDiv.classList.add('success');
   } else {
       messageDiv.classList.remove('success');
   }
   
   messageDiv.style.display = "block";
   messageDiv.innerHTML = message;
   
   // Force a reflow to ensure the transition works
   void messageDiv.offsetWidth;
   
   messageDiv.style.opacity = 1;
   
   // Auto hide after 5 seconds
   setTimeout(function() {
       messageDiv.style.opacity = 0;
       
       // Wait for transition to finish before hiding
       setTimeout(function() {
           messageDiv.style.display = "none";
       }, 300);
   }, 5000);
}

// Add loading state to buttons
function setButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    if (isLoading) {
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        button.disabled = true;
    } else {
        button.innerHTML = buttonId === 'submitSignUp' ? 'Create Account' : 'Sign In';
        button.disabled = false;
    }
}

// Sign Up functionality
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
   event.preventDefault();
   
   // Get form values
   const email = document.getElementById('rEmail').value;
   const password = document.getElementById('rPassword').value;
   const firstName = document.getElementById('fName').value;
   const lastName = document.getElementById('lName').value;
   
   // Validate inputs
   if (!email || !password || !firstName || !lastName) {
       showMessage('Please fill in all fields', 'signUpMessage');
       return;
   }
   
   // Set button to loading state
   setButtonLoading('submitSignUp', true);

   const auth = getAuth();
   const db = getFirestore();

   createUserWithEmailAndPassword(auth, email, password)
   .then((userCredential) => {
       const user = userCredential.user;
       const userData = {
           email: email,
           firstName: firstName,
           lastName: lastName,
           createdAt: new Date().toISOString()
       };
       
       showMessage('Account created successfully!', 'signUpMessage', true);
       
       const docRef = doc(db, "users", user.uid);
       return setDoc(docRef, userData);
   })
   .then(() => {
       // Delay redirect for better UX - allows the user to see the success message
       setTimeout(() => {
           window.location.href = 'index.html';
       }, 1500);
   })
   .catch((error) => {
       const errorCode = error.code;
       
       // Reset button state
       setButtonLoading('submitSignUp', false);
       
       if (errorCode == 'auth/email-already-in-use') {
           showMessage('This email address is already registered', 'signUpMessage');
       } else if (errorCode == 'auth/weak-password') {
           showMessage('Password should be at least 6 characters', 'signUpMessage');
       } else {
           showMessage('Error creating account: ' + error.message, 'signUpMessage');
       }
   });
});

// Sign In functionality
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
   event.preventDefault();
   
   // Get form values
   const email = document.getElementById('email').value;
   const password = document.getElementById('password').value;
   
   // Validate inputs
   if (!email || !password) {
       showMessage('Please enter both email and password', 'signInMessage');
       return;
   }
   
   // Set button to loading state
   setButtonLoading('submitSignIn', true);
   
   const auth = getAuth();

   signInWithEmailAndPassword(auth, email, password)
   .then((userCredential) => {
       showMessage('Login successful!', 'signInMessage', true);
       const user = userCredential.user;
       localStorage.setItem('loggedInUserId', user.uid);
       
       // Delay redirect for better UX
       setTimeout(() => {
           window.location.href = 'homepage.html';
       }, 1000);
   })
   .catch((error) => {
       // Reset button state
       setButtonLoading('submitSignIn', false);
       
       const errorCode = error.code;
       if (errorCode === 'auth/invalid-credential') {
           showMessage('Invalid email or password', 'signInMessage');
       } else if (errorCode === 'auth/user-not-found') {
           showMessage('No account found with this email', 'signInMessage');
       } else if (errorCode === 'auth/too-many-requests') {
           showMessage('Too many failed login attempts. Please try again later', 'signInMessage');
       } else {
           showMessage('Error signing in: ' + error.message, 'signInMessage');
       }
   });
});