var currentStep = 1;
var steps = document.querySelectorAll('.form-step');
var prevBtn = document.getElementById('prevBtn');
var nextBtn = document.getElementById('nextBtn');
var submitBtn = document.getElementById('submitBtn');

function showError(id, message) {
    var err = document.getElementById(id + 'Error');
    if (err) err.textContent = message;
}

function clearError(id) {
    var err = document.getElementById(id + 'Error');
    if (err) err.textContent = '';
}

function validateStep1() {
    var isValid = true;
    var name = document.getElementById('fullname').value.trim();
    if (name.length < 3) { showError('fullname', 'Tên quá ngắn'); isValid = false; }
    if (document.getElementById('dob').value === "") { showError('dob', 'Thiếu ngày sinh'); isValid = false; }
    if (!document.querySelector('input[name="gender"]:checked')) { showError('gender', 'Chọn giới tính'); isValid = false; }
    return isValid;
}

function validateStep2() {
    var isValid = true;
    var email = document.getElementById('email').value;
    if (!email.includes('@')) { showError('email', 'Email sai'); isValid = false; }
    var pass = document.getElementById('password').value;
    if (pass.length < 8) { showError('password', 'Mật khẩu yếu'); isValid = false; }
    if (pass !== document.getElementById('confirmPassword').value) { showError('confirmPassword', 'Không khớp'); isValid = false; }
    return isValid;
}

function updateUI() {
    for (var i = 0; i < steps.length; i++) {
        steps[i].style.display = (i === currentStep - 1) ? 'block' : 'none';
    }
    prevBtn.style.display = (currentStep === 1) ? 'none' : 'inline-block';
    if (currentStep === 3) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
        renderSummary();
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}

function renderSummary() {
    document.getElementById('summaryBox').innerHTML = 
        "Tên: " + document.getElementById('fullname').value + "<br>" +
        "Email: " + document.getElementById('email').value;
}

nextBtn.onclick = function() {
    if (currentStep === 1 && validateStep1()) { currentStep++; updateUI(); }
    else if (currentStep === 2 && validateStep2()) { currentStep++; updateUI(); }
};

prevBtn.onclick = function() { currentStep--; updateUI(); };

document.getElementById('fullname').oninput = function() {
    document.getElementById('fullnameCount').textContent = this.value.length + "/50";
    clearError('fullname');
};

document.getElementById('password').oninput = function() {
    var bar = document.getElementById('strengthBar');
    var val = this.value;
    clearError('password');
    if (val.length < 5) { bar.style.width = '30%'; bar.style.background = 'red'; }
    else if (val.length < 8) { bar.style.width = '60%'; bar.style.background = 'orange'; }
    else { bar.style.width = '100%'; bar.style.background = 'green'; }
};

document.getElementById('togglePassword').onclick = function() {
    var p = document.getElementById('password');
    p.type = (p.type === 'password') ? 'text' : 'password';
    this.classList.toggle('fa-eye-slash');
};

document.getElementById('multiStepForm').onsubmit = function(e) {
    e.preventDefault();
    if (document.getElementById('terms').checked) {
        this.style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('displayName').textContent = document.getElementById('fullname').value;
    } else {
        showError('terms', 'Cần đồng ý điều khoản');
    }
};

updateUI();
function updateUI() {
    // 1. Ẩn/hiện các bước
    for (var i = 0; i < steps.length; i++) {
        steps[i].style.display = (i === currentStep - 1) ? 'block' : 'none';
    }

    // 2. Cập nhật thanh tiến trình (MỚI BỔ SUNG)
    var percent = (currentStep / 3) * 100;
    document.getElementById('mainProgressBar').style.width = percent + '%';
    document.getElementById('currentStepText').textContent = currentStep;

    // 3. Điều khiển các nút bấm
    prevBtn.style.display = (currentStep === 1) ? 'none' : 'inline-block';
    
    if (currentStep === 3) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
        renderSummary();
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }
}