import AuctionCard from './AuctionCard.js';

export default {
  name: 'AuctionList',
  components: {
    AuctionCard
  },
  props: ['filteredAuctions', 'searchQuery', 'isAuthenticated', 'user'],
  template: `
    <div class="container mt-4">
      <div class="row mb-3 align-items-center">
        <div class="col-md-6 d-flex">
          <input
            type="text"
            v-model="localSearchQuery"
            class="form-control"
            placeholder="Search for auctions..."
            style="max-width: 300px;"
          />
          <button class="btn btn-primary ms-2" @click="doFilterAuctions">
            <i class="bi bi-search"></i>
          </button>
        </div>
        <div class="col-md-6 text-end">
          <button
            v-if="isAuthenticated"
            class="btn btn-success"
            @click="$emit('showCreateAuctionModal')"
          >
            <i class="bi bi-plus-circle"></i> Create Auction
          </button>
        </div>
      </div>

      <div class="row">
        <AuctionCard
          v-for="auction in filteredAuctions"
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
  `,
  data() {
    return {
      localSearchQuery: this.searchQuery
    };
  },
  methods: {
    doFilterAuctions() {
      this.$emit('filter-auctions', this.localSearchQuery);
    }
  }
};
