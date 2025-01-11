# Used Guitars and Broken Dreams

An online auction application where users can buy and sell items like guitars, vinyl records, and other unique goods. The project includes authentication, auction management, and a modern interface.

## Key Features

- **Registration and Login**: Users can register and log in to the system.
- **Auction Management**: Users can create, search, filter, and participate in auctions.
- **Modern Interface**: Built with Bootstrap and Vue.js for a smooth and interactive user experience.
- **Security**: Session management with JWT and route protection using middleware.

## Project Structure

The project is divided into frontend and backend components:

### Frontend
- `index.html`: Landing page of the project.
- `login.html` and `register.html`: Pages for user authentication.
- `home.html`: Dashboard for exploring and managing auctions.
- JavaScript files (`*.js`) for client-side logic powered by Vue.js.

### Backend
- `users.routes.js`: User management.
- `auth.routes.js`: Authentication and session handling.
- `auctions.routes.js`: Auction CRUD operations.
- Middleware for verifying JWT tokens (`auth.js`).

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name


2. **Install dependencies**:
   - **Frontend**: Install required libraries (e.g., Vue.js and Bootstrap via CDN links in HTML files).
   - **Backend**: Install Node.js dependencies.
     ```bash
     cd backend
     npm install
     ```

3. **Set up environment variables**:
   Create a `.env` file in the backend directory with the following content:
   ```env
   PORT=3000
   JWT_SECRET=your-secret-key
   DB_HOST=your-database-host
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_NAME=your-database-name
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.

## Usage

- **Explore Auctions**: Visit the home page and browse the available auctions.
- **Authentication**: Register for an account or log in to participate in auctions.
- **Create Auctions**: Authenticated users can create and manage their own auctions.
- **Place Bids**: Place bids on items to compete with other users.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---
```

Let me know if you'd like to make further adjustments or add additional sections!
