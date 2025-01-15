export default {
    name: 'AuctionCard',
    props: ['auction', 'user', 'isAuthenticated'],
    template: `
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm" @click="handleClick" :class="{ 'grayed-out': auction.is_deleted }">
          <img :src="imagePath" class="card-img-top" alt="Auction Image">
          <div class="card-body">
            <span class="badge badge-pill mb-3" 
                  :class="auction.status === 'closed' ? 'bg-danger' : 'bg-success'">
              {{ isAuctionClosed(auction.status) }}
            </span>
            <h5 class="card-title">{{ auction.auction_title }}</h5>
            <p class="card-text">{{ auction.auction_description }}</p>
            <p class="card-text"><strong>End Date:</strong> {{ formatDate(auction.end_date) }}</p>
            <p class="card-text"><strong>Current Price:</strong> {{ auction.current_price }} €</p>
  
            <div class="d-flex align-items-center mt-3" v-if="auction.user_image && auction.user_name">
              <img
                :src="userImagePath"
                alt="User Icon"
                class="rounded-circle me-2"
                style="width: 40px; height: 40px;"
              />
              <p class="mb-0">
                <strong>Owner: </strong>{{ auction.user_name }} {{ auction.user_surname }}
              </p>
            </div>
  
            <div class="d-flex justify-content-between mt-3">
              <button
                v-if="isAuthenticated && user && user.id === auction.auction_creator_id"
                @click.stop="editThisAuction"
                class="p-2"
              >
                <i class="bi bi-pencil-square"></i> Edit
              </button>
              <button
                v-if="isAuthenticated && user && user.id === auction.auction_creator_id"
                @click.stop="deleteThisAuction"
                class="p-2"
              >
                <i class="bi bi-trash-fill"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    computed: {
      imagePath() {
        return `static/images/${this.auction.auction_image || 'placeholder.png'}`;
      },
      userImagePath() {
        return `static/images/${this.auction.user_image || 'default-user.jpg'}`;
      }
    },
    methods: {
      handleClick() {
        this.$emit('click-auction', this.auction.auction_id);
      },
      editThisAuction() {
        this.$emit('edit-auction', this.auction.auction_id);
      },
      deleteThisAuction() {
        this.$emit('delete-auction', this.auction.auction_id);
      },
      formatDate(dateString) {
        if (!dateString) return '';
        const opt = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, opt);
      },
      isAuctionClosed(status) {
        return status === 'closed' ? 'Auction Closed' : 'Auction Open';
      }
    }
  };
  