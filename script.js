// Enhanced script.js with smooth transitions
const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const signInForm = document.getElementById('signIn');
const signUpForm = document.getElementById('signup');

// Function to show form with animation
function showForm(formToShow, formToHide) {
    // First hide the current form
    formToHide.style.opacity = '0';
    formToHide.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        formToHide.style.display = 'none';
        
        // Then show the other form
        formToShow.style.display = 'block';
        
        // Force a reflow to ensure the transition works
        void formToShow.offsetWidth;
        
        formToShow.style.opacity = '1';
        formToShow.style.transform = 'translateY(0)';
    }, 300);
}

// Set initial styles for smooth transitions
signInForm.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
signUpForm.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

// Show sign up form
signUpButton.addEventListener('click', function() {
    showForm(signUpForm, signInForm);
});

// Show sign in form
signInButton.addEventListener('click', function() {
    showForm(signInForm, signUpForm);
});

// Function to show messages with animation
function showMessage(element) {
    if (element) {
        element.style.display = 'block';
        
        // Force a reflow
        void element.offsetWidth;
        
        element.style.opacity = '1';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            element.style.opacity = '0';
            setTimeout(() => {
                element.style.display = 'none';
            }, 300);
        }, 5000);
    }
}

// Handle input focus effect
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    // Add focus class to parent when input is focused
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    // Remove focus class when input loses focus
    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
    });
});