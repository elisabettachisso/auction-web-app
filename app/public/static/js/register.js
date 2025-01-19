const app = Vue.createApp({
    data() {
        return {
            username: '',
            password: '',
            name: '',
            surname: '',
            message: null,
        };
    },
    methods: {
        async register(event) {
            event.preventDefault();
            this.message = null;
            try {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password,
                        name: this.name,
                        surname: this.surname,
                    }),
                });

                const result = await response.json();

                if (response.ok) {
                    this.message = 'Registrazione avvenuta con successo!';
                    setTimeout(() => {
                        window.location.href = '/login.html';
                    }, 2000);
                } else {
                    this.message = `Errore: ${result.message}`;
                }
            } catch (error) {
                this.message = 'Errore durante la registrazione.';
                console.error('Errore nella registrazione:', error);
            }
        },
    },
});

app.mount('#register-app');
