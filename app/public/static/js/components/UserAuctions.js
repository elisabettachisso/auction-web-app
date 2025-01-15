import AuctionCard from "./AuctionCard.js";

export default {
    name: 'UserAuctions',
    components: {AuctionCard},
    props: ['auctions', 'isAuthenticated', 'user'],
    template: `
      <div class="container mt-4">
        <h2 class="mb-4">Your Auctions</h2>
        <div class="row g-4" v-if="auctions.length > 0">
          <div class="row">
            <AuctionCard
              class="col-sm-6 col-lg-4"
              v-for="auction in auctions"
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
    `,
    methods: {
      imagePath(img) {
        return `static/images/${img || 'placeholder.png'}`;
      },
      winnerImagePath(img) {
        return `static/images/${img || 'default-user.jpg'}`;
      },
      isAuctionClosed(status) {
        return status === 'closed' ? 'Auction Closed' : 'Auction Open';
      },
      selectThisAuction(id) {
        this.$emit('selectAuction', id);
      },
      editThisAuction(id) {
        this.$emit('editAuction', id);
      },
      deleteThisAuction(id) {
        this.$emit('deleteAuction', id);
      }
    }
  };
  