export default {
    name: 'AuctionDetails',
    props: ['selectedAuction', 'auctionBids', 'isAuthenticated', 'newBidAmount'],
    template: `
      <div class="container mt-4" v-if="selectedAuction">
        <button class="btn btn-secondary mb-4" @click="$emit('back')">
          <i class="bi bi-arrow-left-square-fill"></i> Back to Auctions
        </button>
  
        <div class="card shadow-sm p-4">
          <div class="row g-4">
            <!-- Immagine -->
            <div class="col-md-4 text-center">
              <img
                :src="auctionImagePath"
                alt="Auction Image"
                class="img-fluid rounded mb-3"
              />
            </div>
            <div class="col-md-8">
              <h1 class="mb-3">{{ selectedAuction.auction_title }}</h1>
              <p><strong>Description:</strong> {{ selectedAuction.auction_description }}</p>
              <p><strong>End Date:</strong> {{ formatDate(selectedAuction.end_date) }}</p>
              <p>
                <strong v-if="selectedAuction.status === 'closed'">Winner Bid: </strong>
                <strong v-else>Current Bid: </strong>
                € {{ selectedAuction.current_price }}
              </p>
              <span
                class="badge badge-pill mb-3"
                :class="selectedAuction.status === 'closed' ? 'bg-danger' : 'bg-success'"
              >
                {{ isAuctionClosed(selectedAuction.status) }}
              </span>
  
              <!-- Owner -->
              <div class="d-flex align-items-center mt-4" v-if="selectedAuction.seller_name">
                <img
                  :src="sellerImagePath"
                  alt="User Icon"
                  class="rounded-circle me-3"
                  style="width: 50px; height: 50px;"
                />
                <p class="mb-0">
                  <strong>Owner: </strong>
                  {{ selectedAuction.seller_name }} {{ selectedAuction.seller_surname }}
                </p>
              </div>
  
              <!-- Winner -->
              <div class="d-flex align-items-center mt-4" v-if="selectedAuction.winner_name">
                <img
                  :src="winnerImagePath"
                  alt="User Icon"
                  class="rounded-circle me-3"
                  style="width: 50px; height: 50px;"
                />
                <p class="mb-0">
                  <strong v-if="selectedAuction.status === 'closed'">Winner: </strong>
                  <strong v-else>Winning User: </strong>
                  {{ selectedAuction.winner_name }} {{ selectedAuction.winner_surname }}
                </p>
              </div>
            </div>
          </div>
        </div>
  
        <div class="mt-5">
          <h3 class="mb-4">Bids</h3>
          <div class="list-group">
            <div
              class="list-group-item d-flex justify-content-between align-items-center"
              v-for="bid in auctionBids"
              :key="bid.bid_id"
            >
              <span>
                {{ bid.bidder_name }} bid € {{ bid.bid_amount }}
                on {{ formatDate(bid.bid_created_at) }}
              </span>
              <span class="badge bg-primary rounded-pill">
                #{{ bid.bid_id }}
              </span>
            </div>
          </div>
        </div>
  
        <div v-if="isAuthenticated && selectedAuction.status !== 'closed'" class="mt-4">
          <h4>Place Your Bid</h4>
          <input
            type="number"
            v-model="localBidAmount"
            placeholder="Your bid amount"
            class="form-control mb-3"
          />
          <button class="btn btn-primary w-100" @click="emitPlaceBid">
            Place Bid
          </button>
        </div>
      </div>
    `,
    data() {
      return {
        localBidAmount: this.newBidAmount || null
      };
    },
    computed: {
      auctionImagePath() {
        if (!this.selectedAuction) return '';
        return `static/images/${this.selectedAuction.auction_image || 'placeholder.png'}`;
      },
      sellerImagePath() {
        return `static/images/${this.selectedAuction.seller_image || 'default-user.jpg'}`;
      },
      winnerImagePath() {
        return `static/images/${this.selectedAuction.winner_image || 'default-user.jpg'}`;
      }
    },
    methods: {
      formatDate(dateString) {
        if (!dateString) return '';
        const opt = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, opt);
      },
      isAuctionClosed(status) {
        return status === 'closed' ? 'Auction Closed' : 'Auction Open';
      },
      emitPlaceBid() {
        this.$emit('place-bid', this.localBidAmount);
      }
    }
  };
  