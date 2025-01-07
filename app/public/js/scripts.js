const app = Vue.createApp({
    data() {
        return {
            username: '',
            password: '',
            message: null,
        };
    },
    methods: {
        async login(event) {
            event.preventDefault(); 
            this.message = null; 
            try {
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
                    localStorage.setItem('token', result.token);
                    window.location.href = result.redirectUrl; 
                } else {
                    this.message = result.msg || 'Login fallito. Riprova.';
                    console.error("Errore dal server:", this.message);
                }
            } catch (error) {
                this.message = 'Si è verificato un errore. Riprova.';
                console.error("Errore nel login:", error);
            }
        },
    },
});

app.mount('#login-app');
