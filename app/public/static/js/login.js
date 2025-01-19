import { saveToken } from './utils.js';

const app = Vue.createApp({
    data() {
        return {
            username: '',
            password: '',
            message: null, 
            fail: false, 
            success: false 
        };
    },
    methods: {
        async login(event) {
            event.preventDefault();
            this.message = null; 
            this.fail = false;
            this.success = false;
            try {
                if (!this.username || !this.password) {
                    this.message = 'Please fill out all fields.';
                    this.fail = true;
                    return;
                }                
                const response = await fetch('/api/auth/signin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password,
                    }),
                });
                const result = await response.json();

                if (response.ok) {
                    this.message = 'Login successful!';
                    this.success = true;
                    saveToken(result.token);
                    window.location.href = result.redirectUrl || '/home.html';
                } else {
                    this.message = result.msg || 'Login failed. Please try again.';
                    this.fail = true;
                }                
            } catch (error) {
                this.message = 'Login failed. Please try again.';
                console.error('Errore nel login:', error);
            }
        },
    },
});

app.mount('#login-app');
