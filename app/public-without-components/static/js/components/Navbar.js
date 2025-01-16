export default {
  name: 'Navbar',
  props: ['isAuthenticated', 'user'],
  template: `
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-brand text-white" href="/index.html">
          <i class="bi bi-house-door-fill"></i> | Riff Market
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <a class="nav-link text-white" href="#" @click.prevent="$emit('show-auctions')">
                <i class="bi bi-disc-fill"></i> Explore Auctions
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white" href="#" @click.prevent="$emit('show-users')">
                <i class="bi bi-people-fill"></i> Other Users
              </a>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto">
            <!-- Se non autenticato -->
            <li class="nav-item dropdown" v-if="!isAuthenticated">
              <a
                class="nav-link text-white dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Jump In!
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="/login.html">Login</a></li>
                <li><a class="dropdown-item" href="/register.html">Register</a></li>
              </ul>
            </li>
            <!-- Se autenticato -->
            <li class="nav-item dropdown" v-else>
              <a
                class="nav-link text-white dropdown-toggle"
                href="#"
                id="navbarDropdown2"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-person-circle"></i>
                {{ user ? user.name + ' ' + user.surname : 'Loading...' }}
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown2">
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="$emit('show-user-auctions')">Your Auctions</a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="$emit('show-user-bids')">Your Winnings</a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="$emit('logout')">
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `
};
