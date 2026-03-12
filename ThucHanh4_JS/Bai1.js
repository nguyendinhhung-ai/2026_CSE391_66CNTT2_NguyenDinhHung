const form = document.getElementById('registrationForm');
const successBox = document.getElementById('successMessage');
const displayName = document.getElementById('displayName');

//  Hiển thị lỗi
function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorDisplay = document.getElementById(`${fieldId}Error`);
    if (input && input.type !== 'radio' && input.type !== 'checkbox') {
        input.classList.add('invalid');
    }
    errorDisplay.textContent = message;
}

// Xóa lỗi
function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorDisplay = document.getElementById(`${fieldId}Error`);
    if (input) input.classList.remove('invalid');
    errorDisplay.textContent = '';
}

// Validate Họ tên
function validateFullname() {
    const val = document.getElementById('fullname').value.trim();
    const regex = /^[a-zA-ZÀ-ỹ\s]+$/; // Hỗ trợ tiếng Việt
    if (val === "") {
        showError('fullname', 'Họ tên không được để trống');
        return false;
    }
    if (val.length < 3) {
        showError('fullname', 'Họ tên phải ít nhất 3 ký tự');
        return false;
    }
    if (!regex.test(val)) {
        showError('fullname', 'Họ tên chỉ được chứa chữ cái');
        return false;
    }
    clearError('fullname');
    return true;
}

// Validate Email
function validateEmail() {
    const val = document.getElementById('email').value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val === "") {
        showError('email', 'Email không được để trống');
        return false;
    }
    if (!regex.test(val)) {
        showError('email', 'Email không đúng định dạng (name@domain.com)');
        return false;
    }
    clearError('email');
    return true;
}

//  Validate Số điện thoại
function validatePhone() {
    const val = document.getElementById('phone').value.trim();
    const regex = /^0\d{9}$/;
    if (val === "") {
        showError('phone', 'Số điện thoại không được để trống');
        return false;
    }
    if (!regex.test(val)) {
        showError('phone', 'SĐT phải có 10 số và bắt đầu bằng số 0');
        return false;
    }
    clearError('phone');
    return true;
}

//  Validate Mật khẩu & Strength Bar
function checkPasswordStrength(pass) {
    const bar = document.getElementById('strengthBar');
    const text = document.getElementById('strengthText');
    let score = 0;

    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    const levels = [
        { width: '0%', color: '#eee', msg: '' },
        { width: '25%', color: '#e74c3c', msg: 'Yếu' },
        { width: '50%', color: '#f1c40f', msg: 'Trung bình' },
        { width: '75%', color: '#2ecc71', msg: 'Mạnh' },
        { width: '100%', color: '#1d9d53', msg: 'Rất mạnh' }
    ];

    const level = levels[Math.min(score, 4)];
    bar.style.width = level.width;
    bar.style.backgroundColor = level.color;
    text.textContent = level.msg;
    text.style.color = level.color;
}

function validatePassword() {
    const val = document.getElementById('password').value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (val === "") {
        showError('password', 'Mật khẩu không được để trống');
        return false;
    }
    if (!regex.test(val)) {
        showError('password', 'Ít nhất 8 ký tự, 1 hoa, 1 thường, 1 số');
        return false;
    }
    clearError('password');
    return true;
}

// Validate Nhập lại mật khẩu
function validateConfirmPassword() {
    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (confirm === "") {
        showError('confirmPassword', 'Vui lòng xác nhận mật khẩu');
        return false;
    }
    if (confirm !== pass) {
        showError('confirmPassword', 'Mật khẩu xác nhận không khớp');
        return false;
    }
    clearError('confirmPassword');
    return true;
}

// Validate Giới tính
function validateGender() {
    const genders = document.getElementsByName('gender');
    let checked = false;
    for (const g of genders) { if (g.checked) checked = true; }
    if (!checked) {
        showError('gender', 'Vui lòng chọn giới tính');
        return false;
    }
    clearError('gender');
    return true;
}

// Validate Điều khoản
function validateTerms() {
    const checkbox = document.getElementById('terms');
    if (!checkbox.checked) {
        showError('terms', 'Bạn phải đồng ý với điều khoản');
        return false;
    }
    clearError('terms');
    return true;
}

// Realtime: Đếm ký tự và xóa lỗi khi nhập
document.getElementById('fullname').addEventListener('input', (e) => {
    document.getElementById('fullnameCount').textContent = `${e.target.value.length}/50`;
    clearError('fullname');
});

// Realtime: Password strength & Xóa lỗi
document.getElementById('password').addEventListener('input', (e) => {
    checkPasswordStrength(e.target.value);
    clearError('password');
});

// Toggle ẩn hiện mật khẩu
document.getElementById('togglePassword').addEventListener('click', function() {
    const passInput = document.getElementById('password');
    const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passInput.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});

// Realtime: Blur & Input cho các trường còn lại
const fields = ['email', 'phone', 'confirmPassword'];
fields.forEach(id => {
    document.getElementById(id).addEventListener('blur', () => {
        if(id === 'email') validateEmail();
        if(id === 'phone') validatePhone();
        if(id === 'confirmPassword') validateConfirmPassword();
    });
    document.getElementById(id).addEventListener('input', () => clearError(id));
});

// SUBMIT FORM
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Sử dụng toán tử bitwise & để ép thực thi tất cả các hàm validate
    // (nhằm hiển thị lỗi cho tất cả các trường cùng lúc nếu có)
    const isValid = 
        validateFullname() & 
        validateEmail() & 
        validatePhone() & 
        validatePassword() & 
        validateConfirmPassword() & 
        validateGender() & 
        validateTerms();

    if (isValid) {
        const nameValue = document.getElementById('fullname').value;
        form.classList.add('hidden');
        successBox.classList.remove('hidden');
        displayName.textContent = nameValue;
    }
});