# Riff Market

This project implements a web application for managing an online auction system. Users can register, log in, view available auctions, place bids, and manage their data.

## Project Structure

The project is divided into various parts, each with specific responsibilities:

### Backend

#### `app.js`
The main file of the backend application. Configures the Express server and registers the main routes.

- Integration of middleware for handling HTTP requests.
- Configuration of routes defined in separate files.

#### Routes
- **`users.routes.js`**: Manages user-related operations, such as registration and login.
- **`auctions.routes.js`**: Manages operations related to auctions, such as creation, modification, and viewing.
- **`bids.routes.js`**: Manages bids placed on auctions.
- **`auth.routes.js`**: Provides authentication and authorization functionalities.

#### `middlewares.js`
Contains custom middleware for:
- User authentication and authorization.
- Multer Integration: Handles file uploads for auction images.
- Auction Status Updates: Automatically updates auction statuses (open or closed) based on their end date.

### Frontend

#### HTML Files
- **`index.html`**: Main page of the application.
- **`login.html`**: Login page for users.
- **`register.html`**: Registration page for new users.
- **`home.html`**: Main page with an overview of available auctions, other users registrated to the applications and other data about each user's own auctions and bids.

#### JS Files
- **`home.js`**: Implements the core functionality of the front end using Vue.js. It manages the application state, user interactions, and API calls for fetching auctions, bids, and user data.- 
- **`login.js`**: Manages the user login process.
- **`register.js`**: Handles the registration of new users.
- **`utils.js`**: Collects common functions for JWT token handling.

##### Components:

- **`Navbar.js`**: A Vue component for the navigation bar, dynamically displaying options based on the user's authentication status.
- **`AuctionCard.js`**: A Vue component for representing an auction as an interactive visual card, with options to edit or delete auctions if the user has appropriate permissions.

### Styling and Interactivity
- **`style.css`**: Style is handled using CSS and Bootstrap for responsive design.
- **`Vue.js`**: The project heavily utilizes Vue.js for building dynamic components and managing the state of the application.

## Features

### For Users
1. **Registration**
   - Users can register by providing a name, surname, usenrame, and password.
2. **Login**
   - Access via username and password.
3. **View Auctions**
   - Users can view available auctions.
4. **View Auctions' Details**
   - Users can view auctions' details.
4. **View Other Users' Details**
   - Users can view other users' details.
5. **Place Bids**
   - Authenticated users can place bids on specific auctions.
6. **Manage Auctions**
   - Authenticated users can create, edit, and delete their own auctions.

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/elisabettachisso/auction-web-app
   ```

2. **Build the Docker Container**
   ```bash
   docker compose up --build
   ```

3. **Access the Frontend**
   - Go to https://localhost:3000/

## Requirements

- Docker

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript, Vue.js
- **Authentication**: JWT via cookies
- **Database**: MySQL (via Docker Compose)
