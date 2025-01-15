import { getToken, isAuthenticated } from './utils.js';

import Navbar from './components/Navbar.js';
import AuctionCard from './components/AuctionCard.js';
import AuctionList from './components/AuctionList.js';
import AuctionDetails from './components/AuctionDetails.js';
import UsersList from './components/UsersList.js';
import UserAuctions from './components/UserAuctions.js';
import UserBids from './components/UserBids.js';
import SelectedUserDetails from './components/SelectedUserDetails.js';
import CreateAuctionModal from './components/CreateAuctionModal.js';
import EditAuctionModal from './components/EditAuctionModal.js';

const app = Vue.createApp({
  data() {
    return {
      currentView: 'auctions',
      isAuthenticated: false,
      user: null,
      users: [],
      filteredUsers: [],
      selectedUser: null,
      selectedUserCreatedAuctions: [],
      selectedUserWonAuctions: [],
      auctions: [],
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
        image: null
      },
      editedAuction: {
        id: null,
        title: '',
        description: ''
      },
      imageFile: null
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
    async fetchUserDetails(userId) {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          
          this.selectedUser = data.user || null;
          this.selectedUserCreatedAuctions = data.created_auctions || [];
          this.selectedUserWonAuctions = data.won_auctions || [];
          
          console.log('Selected User:', this.selectedUser);
          console.log('Selected User Created Auctions:', this.selectedUserCreatedAuctions);
          console.log('Selected User Won Auctions:', this.selectedUserWonAuctions);
        } else {
          console.error('Error fetching user details:', await response.json());
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
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
    async filterAuctions(query) {
      this.searchQuery = query;  
      try {
            const response = await fetch(`/api/auctions?q=${encodeURIComponent(query)}`);
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
          console.log('Fetched bids:', data.bids);
          } else {
          console.error('Error fetching bids. Response status:', response.status);
          }
      } catch (error) {
          console.error('Error during fetchBids', error);
      }
    },   
    async placeBid(localBidAmount) {
      console.log(localBidAmount);
      try {
        if (!localBidAmount || localBidAmount <= this.selectedAuction.current_price) {
          alert('Your bid must be higher than the current price.');
          return;
        }
        if (this.isOwner || this.isAuctionExpired) {
          alert('You cannot bid on this auction.');
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
          body: JSON.stringify({ amount: localBidAmount }),
        });
        if (response.ok) {
          alert('Bid placed successfully!');
          this.fetchBidsForAuction(this.selectedAuction.auction_id);
          this.showAuctionDetails(this.selectedAuction.auction_id);
        } else {
          alert('Failed to place bid.');
        }
      } catch (error) {
        console.error('Error placing bid:', error);
        alert('An unexpected error occurred.');
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.isAuthenticated = false;
      window.location.reload();
    },
    showAuctions() {
      this.currentView = 'auctions';
    },
    showUsers() {
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
        const auction = this.auctions.find(a => a.auction_id === auctionId);
        if (!auction) {
          alert("Auction not found.");
          return;
        }

        this.editedAuction = {
          id: auction.auction_id,
          title: auction.auction_title,
          description: auction.auction_description,
        };
        const modal = new bootstrap.Modal(document.getElementById('editAuctionModal'));
        modal.show();
      } catch (error) {
        console.error("Error showing edit auction details:", error);
        alert("Unable to load auction details.");
      }
    },
    async editAuction(payload) {
      try {
        const response = await fetch(`/api/auctions/${payload.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify({
            title: payload.title,
            description: payload.description,
          }),
        });
        if (response.ok) {
          const updatedAuction = await response.json();
          const auctionIndex = this.auctions.findIndex(a => a.auction_id === updatedAuction.id);
          this.auctions[auctionIndex] = {
            ...this.auctions[auctionIndex],
            title: updatedAuction.updatedFields.title,
            description: updatedAuction.updatedFields.description,
          };
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
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });
        if (response.ok) {
          this.auctions = this.auctions.filter(auction => auction.auction_id !== auctionId);
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
    showCreateAuctionModal() {
      try {
        const modal = new bootstrap.Modal(document.getElementById('createAuctionModal'));
        modal.show();
      } catch (error) {
        console.error('Error showing modal:', error);
      }
    },
    handleFileUpload(e) {
      this.imageFile = e.target.files[0];
    },
    async createAuction(payload) {
      console.log('Creating auction with data:', payload);
      try {
        const formData = new FormData(); 
        formData.append('title', payload.title);
        formData.append('description', payload.description);
        formData.append('start_price', payload.start_price);
        formData.append('end_date', payload.end_date);
        
        if (this.imageFile) {
          formData.append('image', payload.imageFile);
          console.log('FormData contiene il file:', payload.imageFile.name);
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
    
          this.newAuction = {
            title: '',
            description: '',
            start_price: null,
            end_date: '',
            image: '',
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
    checkAuthentication() {
      this.isAuthenticated = isAuthenticated();
    }
  },
  mounted() {
    this.checkAuthentication();
    if (this.isAuthenticated) {
      this.fetchUserData();
    } else {
      this.user = null;
    }
    this.fetchUsers();
    this.fetchAuctions();
  }
});

app.component('navbar-x', Navbar);
app.component('auction-card', AuctionCard);
app.component('auction-list', AuctionList);
app.component('auction-details', AuctionDetails);
app.component('users-list', UsersList);
app.component('user-auctions', UserAuctions);
app.component('user-bids', UserBids);
app.component('selected-user-details', SelectedUserDetails);
app.component('create-auction-modal', CreateAuctionModal);
app.component('edit-auction-modal', EditAuctionModal);

app.mount('#home-app');
