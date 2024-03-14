# DreamGO
DreamGo: Your ultimate vacation rental destination. Find your dream getaway with ease - from cozy cabins to luxurious villas. Book securely and start making memories today!

# Logo
<img src="https://github.com/omkar231098/dream_go/assets/109202596/49ade075-28c4-45f4-aa04-51b910f3a374" width="200" />


## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Routes](#api-routes)
- [Authentication](#authentication)
- [Logger](#logger)
- [Rate Limiter](#rate-limiter)
- [Validator](#validator)
- [Preview and Download](#preview-and-download)
- [Screenshots](#screenshots)
- [Deployed Link](#deployed-link)
- [Contribution](#contribution)
- [License](#license)


## Features

- **Easy Booking**: Effortlessly book your desired vacation rental with simple and intuitive booking process.
- **Wide Variety of Categories**: Explore diverse categories of accommodations, from cozy cottages and beachfront villas to urban apartments and countryside retreats.
- **Secure Payment**: Ensure peace of mind with secure online payment options for hassle-free transactions.
- **Customizable Search**: Filter accommodations based on location, price range, amenities, and more to find the perfect getaway.
- **User Wishlists**: Create personalized wishlists to save favorite properties for future reference and easy booking.
- **Listing Management**: Allow users to publish their own properties for rent, managing details, availability, and pricing.
- **User Ratings and Reviews**: Enable users to rate and review accommodations to help others make informed decisions.
- **Responsive Design**: Enjoy seamless user experience across devices with a mobile-friendly and responsive website design.


## Tech Stack

- React: JavaScript library for building user interfaces
- Node.js: JavaScript runtime
- Express.js: Web application framework for Node.js
- MongoDB: NoSQL database for storing user data
- imagekit.io: Image optimization and delivery service
- JWT: JSON Web Tokens for secure user authentication


## Getting Started

1. **Clone the repository:**
    ```bash
    git clone https://github.com/omkar231098/dream_go.git
   
    ```
   ```bash
   cd dream_go
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=8500
    MONGO_URL="mongodb_database_url"
    JWT_SECRET=mysecretkey
    publicKey="imagekit.io_public_key"
    privateKey="imagekit.io_private_key"
    urlEndpoint="imagekit.io_url_endpoint"
    ```

4. **Run the application:**
    ```bash
    npm start
    ```
    The API server will be running at `http://localhost:8500`.

