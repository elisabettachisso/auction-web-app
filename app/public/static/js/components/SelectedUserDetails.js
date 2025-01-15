import AuctionCard from './AuctionCard.js';

export default {
    name: 'SelectedUserDetails',
    components: {
      AuctionCard
    },
    props: [
      'selectedUser',
      'selectedUserCreatedAuctions',
      'selectedUserWonAuctions',
      'user',
      'isAuthenticated'
    ],
    template: `
      <div class="container mt-4">
        <button class="btn btn-secondary mb-4" @click="$emit('back')">
          <i class="bi bi-arrow-left-square-fill"></i> Back to Users
        </button>
        <div class="card shadow-sm p-4 mb-4" v-if="selectedUser">
          <div class="d-flex align-items-center">
            <img
              :src="userImagePath"
              alt="User Icon"
              class="rounded-circle me-3"
              style="width: 100px; height: 100px;"
            />
            <div>
              <h2 class="mb-0">
                {{ selectedUser.name }} {{ selectedUser.surname }}
              </h2>
              <p class="text-muted mb-0">
                Username: {{ selectedUser.username }}
              </p>
            </div>
          </div>
        </div>
  
        <!-- Created Auctions -->
        <div class="mb-5">
          <h3 class="mb-4">Created Auctions</h3>
          <div class="row g-3" v-if="selectedUserCreatedAuctions.length > 0">
            <div class="row">
              <AuctionCard
                v-for="auction in selectedUserCreatedAuctions"
                :key="auction.auction_id"
                :auction="auction"
                :user="user"
                :is-authenticated="isAuthenticated"
                @clickAuction="id => $emit('select-auction', id)"
                @editAuction="id => $emit('edit-auction', id)"
                @deleteAuction="id => $emit('delete-auction', id)"
              />
            </div>
          </div>
        </div>
  
        <!-- Won Auctions -->
        <div>
          <h3 class="mb-4">Won Auctions</h3>
          <div class="row g-3" v-if="selectedUserWonAuctions.length > 0">
            <div class="row">
              <AuctionCard
                v-for="auction in selectedUserWonAuctions"
                :key="auction.auction_id"
                :auction="auction"
                :user="user"
                :is-authenticated="isAuthenticated"
                @clickAuction="id => $emit('select-auction', id)"
                @editAuction="id => $emit('edit-auction', id)"
                @deleteAuction="id => $emit('delete-auction', id)"
              />
            </div>
            </div>
          </div>
        </div>
      </div>
    `,
    computed: {
      userImagePath() {
        if (!this.selectedUser) return '';
        return `static/images/${this.selectedUser.image || 'default-user.jpg'}`;
      }
    },
    methods: {
      imagePath(img) {
        return `static/images/${img || 'placeholder.png'}`;
      },
      winnerImagePath(img) {
        return `static/images/${img || 'default-user.jpg'}`;
      },
      isAuctionClosed(status) {
        return status === 'closed' ? 'Auction Closed' : 'Auction Open';
      }
    }
  };
  