export default {
    name: 'CreateAuctionModal',
    props: ['newAuction'],
    template: `
      <div
        class="modal fade"
        id="createAuctionModal"
        tabindex="-1"
        aria-labelledby="createAuctionModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="createAuctionModalLabel">Create New Auction</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="emitCreateAuction">
                <div class="mb-3">
                  <label for="auctionTitle" class="form-label">Title</label>
                  <input
                    type="text"
                    v-model="localAuction.title"
                    class="form-control"
                    id="auctionTitle"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="auctionDescription" class="form-label">Description</label>
                  <textarea
                    v-model="localAuction.description"
                    class="form-control"
                    id="auctionDescription"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div class="mb-3">
                  <label for="auctionStartPrice" class="form-label">Start Price</label>
                  <input
                    type="number"
                    v-model="localAuction.start_price"
                    class="form-control"
                    id="auctionStartPrice"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="auctionEndDate" class="form-label">End Date</label>
                  <input
                    type="datetime-local"
                    v-model="localAuction.end_date"
                    class="form-control"
                    id="auctionEndDate"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="auctionImage" class="form-label">Upload Image</label>
                  <input
                    type="file"
                    class="form-control"
                    id="auctionImage"
                    accept="image/*"
                    @change="emitFileUpload"
                  />
                </div>
                <button type="submit" class="btn btn-primary">
                  Create
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        localAuction: { ...this.newAuction },
        imageFile: null
      };
    },
    methods: {
      emitFileUpload(e) {
        this.imageFile = e.target.files[0];
        this.$emit('handleFileUpload', e);
      },
      emitCreateAuction() {
        const payload = {
          ...this.localAuction
        };
        if (this.imageFile) payload.imageFile = this.imageFile;
  
        this.$emit('createAuction', payload);
      }
    },
    watch: {
      newAuction: {
        handler(val) {
          this.localAuction = { ...val };
        },
        deep: true
      }
    }
  };
  