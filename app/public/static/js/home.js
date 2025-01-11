import { getToken, isAuthenticated } from './utils.js';

const app = Vue.createApp({
  data() {
    return {
      currentView: 'auctions',
      isAuthenticated: false,
      user: null,
      users: [],
      filteredUsers: [],
      auctions: [],
      filteredAuctions: [],
      selectedAuction: null,
      auctionBids: [],
      newBidAmount: null,
      searchQuery: '',
      newAuction: {
        title: '',
        description: '',
        start_price: null,
        end_date: '',
        image: null,
      },
      imageFile: null,
    };
  },
  methods: {
    async fetchUserData() {
      try {
        const response = await fetch('/api/whoami', {
          method: 'GET',
          credentials: 'include',
        });
    
        if (response.ok) {
          const userData = await response.json();
          this.user = userData; 
          console.log('User data:', this.user);
        } else {
          console.error('Error fetching user data:', await response.json());
        }
      } catch (error) {
        console.error('Error during fetchUserData:', error);
      }
    },
    async fetchUsers() {
      try {
          const response = await fetch('/api/users');
          console.log('Response from /api/users:', response);
          if (response.ok) {
          const { users } = await response.json();
          this.users = users;
          this.filteredUsers = users;
          console.log('Fetched users:', users);
          } else {
          console.error('Error fetching users. Response status:', response.status);
          }
      } catch (error) {
          console.error('Error during fetchUsers:', error);
      }
    },
    async filterUsers() {
      try {
          const response = await fetch(`/api/users?q=${encodeURIComponent(this.searchQueryUsers)}`);
          console.log('Search query response:', response);
          if (response.ok) {
          const { users } = await response.json();
          this.filteredUsers = users;
          console.log('Filtered users:', users);
          } else {
          console.error('Error during search. Response status:', response.status);
          }
      } catch (error) {
          console.error('Error during filterUsers:', error);
      }
    },
    async fetchAuctions() {
        try {
            const response = await fetch('/api/auctions');
            console.log('Response from /api/auctions:', response);
            if (response.ok) {
            const { auctions } = await response.json();
            this.auctions = auctions;
            this.filteredAuctions = auctions;
            console.log('Fetched auctions:', auctions);
            } else {
            console.error('Error fetching auctions. Response status:', response.status);
            }
        } catch (error) {
            console.error('Error during fetchAuctions:', error);
        }
    },
    async filterAuctions() {
        try {
            const response = await fetch(`/api/auctions?q=${encodeURIComponent(this.searchQuery)}`);
            console.log('Search query response:', response);
            if (response.ok) {
            const { auctions } = await response.json();
            this.filteredAuctions = auctions;
            console.log('Filtered auctions:', auctions);
            } else {
            console.error('Error during search. Response status:', response.status);
            }
        } catch (error) {
            console.error('Error during filterAuctions:', error);
        }
    },
    async fetchBidsForAuction(auctionId) {
      try {
          const response = await fetch(`/api/auctions/${auctionId}/bids`);
          if (response.ok) {
            const data = await response.json();
            console.log("data: ", data)
            this.auctionBids = data.bids;
            console.log(this.auctionBids)
          console.log('Fetched bids:', bids);
          } else {
          console.error('Error fetching bids. Response status:', response.status);
          }
      } catch (error) {
          console.error('Error during fetchBids', error);
      }
    },   
    async placeBid() {
      try {
        if (!this.newBidAmount) {
          alert('Please enter a valid bid amount.');
          return;
        }
        const response = await fetch(`/api/auctions/${this.selectedAuction.auction_id}/bids`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: this.newBidAmount }),
        });
        if (response.ok) {
          alert('Bid placed successfully!');
          this.fetchBidsForAuction(this.selectedAuction.auction_id);
        } else {
          alert('Failed to place bid.');
        }
      } catch (error) {
        console.error('Error placing bid:', error);
        alert('An unexpected error occurred.');
      }
    },
    viewAuction(id) {
      window.location.href = `/auction/${id}`;
    },
    async deleteAuction(id) {
      try {
        const response = await fetch(`/api/auctions/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });
        if (response.ok) {
          this.auctions = this.auctions.filter(auction => auction.id !== id);
          this.filteredAuctions = this.filteredAuctions.filter(auction => auction.id !== id);
          console.log('Asta eliminata con successo.');
        } else {
          console.error('Errore durante l\'eliminazione dell\'asta.');
        }
      } catch (error) {
        console.error('Errore:', error);
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.isAuthenticated = false;
      window.location.reload();
    },
    checkAuthentication() {
      this.isAuthenticated = isAuthenticated();
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    isAuctionClosed(status) {
      return status === 'closed' ? 'Auction Closed' : 'Auction Open';
    },
    showCreateAuctionModal() {
      try {
        const modal = new bootstrap.Modal(document.getElementById('createAuctionModal'));
        modal.show();
      } catch (error) {
        console.error('Error showing modal:', error);
      }
    },
    showCreateBidModal() {
      alert('Bid modal not implemented yet.');
    },
    handleFileUpload(event) {
      this.imageFile = event.target.files[0]; 
      console.log('File selezionato:', this.imageFile)
    },
    async createAuction() {
      console.log('Creating auction with data:', this.newAuction);
      try {
        const formData = new FormData(); // Crea un oggetto FormData
        formData.append('title', this.newAuction.title);
        formData.append('description', this.newAuction.description);
        formData.append('start_price', this.newAuction.start_price);
        formData.append('end_date', this.newAuction.end_date);
        
        // Aggiungi l'immagine se esiste
        if (this.imageFile) {
          formData.append('image', this.imageFile);
          console.log('FormData contiene il file:', this.imageFile.name);
        } else {
          console.warn('Nessun file selezionato!');
        }
    
        const response = await fetch('/api/auctions', {
          method: 'POST',
          body: formData, 
          credentials: 'include',
        });
    
        if (response.ok) {
          const auction = await response.json();
          console.log('Auction created:', auction);
    
          const modal = bootstrap.Modal.getInstance(document.getElementById('createAuctionModal'));
          modal.hide();
    
          // Resetta i dati del modulo
          this.newAuction = {
            title: '',
            description: '',
            start_price: null,
            end_date: '',
            image: '',
          };
          this.imageFile = null;
    
          alert('Auction created successfully!');
          await this.fetchAuctions(); // Aggiorna la lista delle aste
        } else {
          const error = await response.json();
          console.error('Error creating auction:', error);
          alert(`Error: ${error.msg || 'Failed to create auction'}`);
        }
      } catch (error) {
        console.error('Error during auction creation:', error);
        alert('An unexpected error occurred.');
      }
    },
    showAuctions() {
      this.currentView = 'auctions'; 
    },
    showUsers() {
      this.currentView = 'users'; 
    },
    async showAuctionDetails(auctionId) {
      try {
        const response = await fetch(`/api/auctions/${auctionId}`);
        if (response.ok) {
          const data = await response.json();
          this.selectedAuction = data.auction;
          this.currentView = 'auction-details';
          this.fetchBidsForAuction(auctionId);
        } else {
          console.error('Error fetching auction details:', await response.json());
        }
      } catch (error) {
        console.error('Error fetching auction details:', error);
      }
    },  
  },
  mounted() {
    this.checkAuthentication();
    if (this.isAuthenticated) {
      this.fetchUserData();
    }
    this.fetchUsers();
    this.fetchAuctions();
  },
});

app.mount('#home-app');
