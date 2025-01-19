import Navbar from './components/Navbar.js';
import AuctionCard from './components/AuctionCard.js';

const app = Vue.createApp({
  data() {
    return {
      currentView: 'auctions',
      isAuthenticated: false,
      user: null,
      authenticatedUserId: null,
      filteredUsers: [],
      selectedUser: null,
      selectedUserCreatedAuctions: [],
      selectedUserWonAuctions: [],
      filteredAuctions: [],
      selectedAuction: null,
      auctionBids: [],
      newBidAmount: null,
      searchQuery: '',
      searchQueryUsers: '',
      newAuction: {
        title: '',
        description: '',
        start_price: null,
        end_date: '',
      },
      editedAuction: {
        id: null,
        title: '',
        description: ''
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
          this.isAuthenticated = true;
          this.authenticatedUserId = userData.id;
          console.log('User data:', this.user);
          if (this.user && this.user.id) {
            await this.fetchUserDetails(this.user.id);
          }
        } else {
          console.error('Error fetching user data:', await response.json());
          this.user = null;
          this.isAuthenticated = false;
        }
      } catch (error) {
        console.error('Error during fetchUserData:', error);
        this.user = null;
        this.isAuthenticated = false;
      }
    },
    async fetchUsers() {
      try {
          const response = await fetch(`/api/users?q=${encodeURIComponent(this.searchQueryUsers)}`);
          console.log('Search query response:', response);
          if (response.ok) {
            const { users } = await response.json();
            this.filteredUsers = users.filter(users => users.id !== this.authenticatedUserId );
            console.log('Filtered users:', this.filteredUsers);
          } else {
            console.error('Error filtering users. Response status:', response.status);
          }
      } catch (error) {
          console.error('Error during filterUsers:', error);
      }
    },
    async fetchUserDetails(userId) {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (response.ok) {
          const data = await response.json();          
          this.selectedUser = data.user || null;
          this.selectedUserCreatedAuctions = data.created_auctions || [];
          this.selectedUserWonAuctions = data.won_auctions || [];  
        } else {
          console.error('Error fetching user details. Response status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    },        
    async fetchAuctions() {
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
            console.log('Data:', data);
            this.auctionBids = data.bids;
            console.log('Fetched bids:', data.bids);
          } else {
          console.error('Error fetching bids. Response status:', response.status);
          }
      } catch (error) {
          console.error('Error during fetchBids', error);
      }
    },   
    async placeBid() {
      try {
        if (this.user.id === this.selectedAuction.user_id || this.selectedAuction.status === 'closed') {
          alert('You cannot bid on this auction.');
          return;
        }

        if (!this.newBidAmount || this.newBidAmount <= this.selectedAuction.current_price) {
          alert('Your bid must be higher than the current price.');
          return;
        }

        if (this.user.id === this.selectedAuction.winner_id) {
          const proceed = window.confirm('You are already the user who is winning this auction, are you sure you want to proceed with placing an offer?');
          if (!proceed) {
              return; 
          }
        }
        const response = await fetch(`/api/auctions/${this.selectedAuction.auction_id}/bids`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: this.newBidAmount }),
          credentials: 'include',
        });
        if (response.ok) {
          console.log('Bid placed successfully!');          
          this.newBidAmount = null;
          this.fetchBidsForAuction(this.selectedAuction.auction_id);
          this.showAuctionDetails(this.selectedAuction.auction_id);
        } else {
          alert('Failed to place bid.');
        }
      } catch (error) {
        console.error('Error placing bid:', error);
        alert('Failed to place bid.');
      }
    },
    async logout() {
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });
        if (response.ok) {
          this.isAuthenticated = false;
          this.user = null;
          window.location.reload(); 
        } else {
          console.error('Faild logout.');
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
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
    handleFileUpload(event) {
      this.imageFile = event.target.files[0]; 
      console.log('Selected file:', this.imageFile)
    },
    async createAuction() {
      console.log('Creating auction with data:', this.newAuction);
      try {
        const formData = new FormData(); 
        formData.append('title', this.newAuction.title);
        formData.append('description', this.newAuction.description);
        formData.append('start_price', this.newAuction.start_price);
        formData.append('end_date', this.newAuction.end_date);

        if (this.imageFile) {
          formData.append('image', this.imageFile);
          console.log('FormData file:', this.imageFile.name);
        } else {
          console.warn('No selected file!');
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
    
          this.newAuction = {
            title: '',
            description: '',
            start_price: null,
            end_date: '',
          };
          this.imageFile = null;
    
          alert('Auction created successfully!');
          await this.fetchAuctions(); 
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
      this.searchQuery = '';
      this.fetchAuctions();
      this.currentView = 'auctions'; 
    },
    showUsers() {
      this.searchQueryUsers = '';
      this.fetchUsers();      
      this.currentView = 'users';
    },
    showUserAuctions() {
      this.currentView = 'user-auctions';
      this.fetchUserDetails(this.user.id); 
    },
    showUserBids() {
      this.currentView = 'user-bids';
      this.fetchUserDetails(this.user.id); 
    },
    showUserDetails(userId) {
      this.currentView = 'selected-user-details';
      this.fetchUserDetails(userId); 
    },
    async showAuctionDetails(auctionId) {
      try {
        const response = await fetch(`/api/auctions/${auctionId}`);
        if (response.ok) {
          const data = await response.json();
          this.selectedAuction = data.auctions[0];
          console.log(this.selectedAuction);
          this.currentView = 'auction-details';
          this.fetchBidsForAuction(auctionId);
        } else {
          console.error('Error fetching auction details:', await response.json());
        }
      } catch (error) {
        console.error('Error fetching auction details:', error);
      }
    },
    async showEditAuctionDetails(auctionId) {
      try {
        const auction = this.filteredAuctions.find(a => a.auction_id === auctionId);
        this.editedAuction = {
          id: auction.auction_id,
          title: auction.auction_title,
          description: auction.auction_description,
        };
        const modal = new bootstrap.Modal(document.getElementById('editAuctionModal'));
        modal.show();
      } catch (error) {
        console.error('Error showing edit auction details:', error);
        alert('Unable to load auction details.');
      }
    },
    async editAuction() {
      console.log('Edited Auction ID:', this.editedAuction.id);
      const editedAuctionData =  JSON.stringify({
        title: this.editedAuction.title,
        description: this.editedAuction.description,
      });
      try {
        const response = await fetch(`/api/auctions/${this.editedAuction.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: editedAuctionData,        
          credentials: 'include',
        });
        if (response.ok) {
          alert('Auction updated successfully!');
          const modal = bootstrap.Modal.getInstance(document.getElementById('editAuctionModal'));
          modal.hide();
          await this.fetchAuctions();
        } else {
          const error = await response.json();
          alert(`Error: ${error.msg}`);
        }
      } catch (error) {
        console.error('Error updating auction:', error);
        alert('An unexpected error occurred.');
      }
    },  
    async deleteAuction(auctionId) {
      const proceed = window.confirm('You are deleting this auction, are you sure you want to proceed?');
      if (!proceed) {
          return; 
      }
      try {
        const response = await fetch(`/api/auctions/${auctionId}`, {
          method: 'DELETE',                 
          credentials: 'include'
        });
        if (response.ok) {
          await this.fetchAuctions();
          await this.fetchUserDetails(this.user.id);
          alert('Auction deleted successfully!');          
        } else {
          const error = await response.json();
          alert(`Error: ${error.msg}`);
        }
      } catch (error) {
        console.error('Error deleting auction:', error);
        alert('An unexpected error occurred.');
      }
    },
  },
  mounted() {
    this.fetchUserData();
    this.fetchUsers();
    this.fetchAuctions();
  },
});

app.component('navbar-x', Navbar);
app.component('auction-card', AuctionCard);

app.mount('#home-app');
