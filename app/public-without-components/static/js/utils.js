export function saveToken(token) {
    localStorage.setItem('token', token);
}

export function getToken() {
    return localStorage.getItem('token');
}

export function isAuthenticated() {
    return !!getToken();
}

export function redirectIfAuthenticated(redirectUrl = '/home.html') {
    if (isAuthenticated()) {
        window.location.href = redirectUrl;
    }
}
