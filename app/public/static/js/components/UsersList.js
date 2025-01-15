import UserCard from './UserCard.js';

export default {
  name: 'UsersList',
  components: { UserCard },
  props: ['filteredUsers', 'searchQueryUsers'],
  template: `
    <div class="container mt-4">
      <div class="row mb-3 align-items-center">
        <div class="col-md-6 d-flex">
          <input
            type="text"
            v-model="localSearchQuery"
            class="form-control"
            placeholder="Search for users..."
            style="max-width: 300px;"
          />
          <button
            class="btn btn-primary ms-2"
            @click="doFilterUsers"
          >
            <i class="bi bi-search"></i>
          </button>
        </div>
      </div>

      <div class="row">
        <UserCard
          v-for="user in filteredUsers"
          :key="user.id"
          :user="user"
          @selectUser="id => $emit('selectUser', id)"
        />
      </div>
    </div>
  `,
  data() {
    return {
      localSearchQuery: this.searchQueryUsers
    };
  },
  methods: {
    doFilterUsers() {
      this.$emit('filterUsers', this.localSearchQuery);
    }
  }
};
