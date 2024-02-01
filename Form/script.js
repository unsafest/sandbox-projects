document.querySelector('#form').addEventListener('submit', function (e) { 
    let inputs = document.querySelectorAll('input');
    let email = document.querySelector('#email');
    let password = document.querySelector('#password');
    let confirmPassword = document.querySelector('#confirm_password');
    let isValid = true;
    
    // Generic validation
    inputs.forEach(input => { 
        if (!input.checkValidity()) {
            input.classList.add('touched');
            document.querySelector('#' + input.id + '_error').textContent = "* This field is required"
            isValid = false;
        } else {
            document.querySelector('#' + input.id + '_error').textContent = "";
        }
    });

    // Email-specific validation
    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email.value)) {
        email.classList.add('touched');
        document.querySelector('#email_error').textContent = "* Invalid email address"
        isValid = false;
    }

   // Password-specific validation
   if (password.value !== "" && confirmPassword.value !== "") {
        if (password.value.length < 6 || password.value.length > 24) {
            password.classList.add('touched');
            document.querySelector('#password_error').textContent = "Password must be 6-24 characters long"
            isValid = false; 
        }
        
        if (password.value !== confirmPassword.value) {
            confirmPassword.classList.add('touched');
            document.querySelector('#confirm_password_error').textContent = "Passwords do not match"
            isValid = false;
        }
    }
    
    if (!isValid) {
        e.preventDefault();
    }
});