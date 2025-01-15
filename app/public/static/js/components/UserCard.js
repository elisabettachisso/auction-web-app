export default {
    name: 'UserCard',
    props: ['user'],
    template: `
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm">
          <img
            :src="imagePath"
            class="card-img-top"
            alt="User Image"
          />
          <div class="card-body">
            <h5 class="card-title">
              {{ user.name }} {{ user.surname }}
            </h5>
            <p class="card-text">Username: {{ user.username }}</p>
            <button
              class="btn btn-primary mt-3"
              @click="$emit('selectUser', user.id)"
            >
              User's details
            </button>
          </div>
        </div>
      </div>
    `,
    computed: {
      imagePath() {
        return `static/images/${this.user.image || 'default-user.jpg'}`;
      }
    }
  };
  