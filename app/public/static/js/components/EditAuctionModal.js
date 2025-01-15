export default {
    name: 'EditAuctionModal',
    props: ['editedAuction'],
    template: `
      <div
        class="modal fade"
        id="editAuctionModal"
        tabindex="-1"
        aria-labelledby="editAuctionModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editAuctionModalLabel">Edit Auction</h5>
              <button 
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="emitEditAuction">
                <div class="mb-3">
                  <label for="editAuctionTitle" class="form-label">Title</label>
                  <input
                    type="text"
                    id="editAuctionTitle"
                    v-model="localAuction.title"
                    class="form-control"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="editAuctionDescription" class="form-label">
                    Description
                  </label>
                  <textarea
                    id="editAuctionDescription"
                    v-model="localAuction.description"
                    class="form-control"
                    required
                  ></textarea>
                </div>
                <button type="submit" class="btn btn-primary">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        localAuction: {
          id: null,
          title: '',
          description: ''
        }
      };
    },
    watch: {
      editedAuction: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.localAuction = { ...newVal };
          }
        }
      }
    },
    methods: {
      emitEditAuction() {
        this.$emit('editAuction', {
          ...this.localAuction
        });
      }
    }
  };
  