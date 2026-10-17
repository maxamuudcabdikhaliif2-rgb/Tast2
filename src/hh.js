const form = document.getElementById("registerForm");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");
const successMsg = document.getElementById("successMsg");
const toggleBtn = document.querySelector(".toggle");
const strengthBar = document.querySelector(".strength span");

function setError(input, message) {
    const field = input.closest(".field");
    field.classList.add("invalid");
    field.classList.remove("valid");
    field.querySelector(".error").textContent = message;
    return false;
}

function setValid(input) {
    const field = input.closest(".field");
    field.classList.remove("invalid");
    field.classList.add("valid");
    field.querySelector(".error").textContent = "";
    return true;
}

function validateName() {
    const value = fullName.value.trim();
    if (value.length < 3) return setError(fullName, "Magaca waa inuu ugu yaraan 6 xaraf ahaadaa.");
    return setValid(fullName);
}

function validateEmail() {
    const value = email.value.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(value)) return setError(email, "Geli email sax ah.");
    return setValid(email);
}

function validatePhone() {
    const value = phone.value.trim();
    const digits = value.replace(/\D/g, "");
    if (!/^[+\d\s()-]+$/.test(value) || digits.length < 7 || digits.length > 15) {
        return setError(phone, "Geli lambar taleefan sax ah.");
    }
    return setValid(phone);
}

function validatePassword() {
    const value = password.value;
    if (value.length < 8) return setError(password, "Furaha waa inuu ugu yaraan 8 xaraf ahaadaa.");
    if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
        return setError(password, "Furuhu waa inuu leeyahay xarfo iyo lambarro.");
    }
    return setValid(password);
}

function validateConfirm() {
    if (confirmPassword.value === "" || confirmPassword.value !== password.value) {
        return setError(confirmPassword, "Labada furaha ma isle'eka.");
    }
    return setValid(confirmPassword);
}

function validateTerms() {
    const field = terms.closest(".field");
    if (!terms.checked) {
        field.classList.add("invalid");
        field.querySelector(".error").textContent = "Waa inaad aqbashaa shuruudaha.";
        return false;
    }
    field.classList.remove("invalid");
    field.querySelector(".error").textContent = "";
    return true;
}

// Password strength bar
function updateStrength() {
    const v = password.value;
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
    if (/\d/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;

    const colors = ["#d93a3a", "#e8a33d", "#c9b92e", "#1f9d55"];
    strengthBar.style.width = (v ? score * 25 : 0) + "%";
    strengthBar.style.background = colors[Math.max(score - 1, 0)];
}

// Show / hide password
toggleBtn.addEventListener("click", () => {
    const show = password.type === "password";
    password.type = show ? "text" : "password";
    toggleBtn.querySelector("i").className = show ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
});

// Live validation after the user leaves a field
fullName.addEventListener("blur", validateName);
email.addEventListener("blur", validateEmail);
phone.addEventListener("blur", validatePhone);
password.addEventListener("input", () => {
    updateStrength();
    if (password.closest(".field").classList.contains("invalid")) validatePassword();
});
password.addEventListener("blur", validatePassword);
confirmPassword.addEventListener("blur", validateConfirm);
terms.addEventListener("change", validateTerms);

form.addEventListener("submit", (e) => {
    e.preventDefault();
    successMsg.textContent = "";

    const results = [
        validateName(),
        validateEmail(),
        validatePhone(),
        validatePassword(),
        validateConfirm(),
        validateTerms(),
    ];

    if (results.every(Boolean)) {
        // Halkan ka dir xogta server-ka (fetch / API)
        const data = {
            fullName: fullName.value.trim(),
            email: email.value.trim(),
            phone: phone.value.trim(),
        };
        console.log("Xogta la diiwaangeliyay:", data);

        successMsg.textContent = "Si guul leh ayaad u diiwaangashay!";
        form.reset();
        strengthBar.style.width = "0";
        form.querySelectorAll(".field").forEach((f) => f.classList.remove("valid", "invalid"));
    }
});