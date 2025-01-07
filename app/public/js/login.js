import { saveToken } from './utils.js';

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
            event.preventDefault(); // Evita il comportamento predefinito del form
            this.message = null; // Resetta il messaggio di errore
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
                    saveToken(result.token); // Salva il token localmente
                    window.location.href = result.redirectUrl || '/home.html'; // Redirect
                } else {
                    this.message = result.msg || 'Login fallito. Riprova.';
                }
            } catch (error) {
                this.message = 'Si è verificato un errore. Riprova.';
                console.error("Errore nel login:", error);
            }
        },
    },
});

app.mount('#login-app');
