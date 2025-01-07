import { getToken } from './utils.js';

const app = Vue.createApp({
    data() {
        return {
            auctions: [],
        };
    },
    async created() {
        try {
            const response = await fetch('/api/auctions', {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (response.ok) {
                this.auctions = await response.json();
            } else {
                console.error("An error occurred while fetching auctions.");
            }
        } catch (error) {
            console.error("Errore nel caricamento delle aste:", error);
        }
    },
});

app.mount('#home-app');
