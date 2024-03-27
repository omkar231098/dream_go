# DreamGO
DreamGo: Your ultimate vacation rental destination. Find your dream getaway with ease - from cozy cabins to luxurious villas. Book securely and start making memories today!

# Logo
<img src="https://github.com/omkar231098/dream_go/assets/109202596/49ade075-28c4-45f4-aa04-51b910f3a374" width="200" />


## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Routes](#api-routes)
- [Logger](#logger)
- [Rate Limiter](#rate-limiter)
- [Validator](#validator)
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

## API Routes

### Authentication Routes

- **User Registration**
  - Route: `POST /auth/register`
  - Description: Register a new user.

- **User Login**
  - Route: `POST /auth/login`
  - Description: Authenticate user login.
 
### Booking Routes

- **Create Booking**
  - Route: `POST /bookings/create`
  - Description: Create a new booking.

- **Delete Booking**
  - Route: `DELETE /bookings/delete/:id`
  - Description: Delete a booking.

### Listing Routes

- **Create Listing**
  - Route: `POST /listings/create`
  - Description: Create a new property listing.

- **Get Listings by Category**
  - Route: `GET /listings`
  - Query Parameter: `category`
  - Description: Retrieve property listings by category.

- **Search Listings**
  - Route: `GET /listings/search/:search`
  - Parameter: `search`
  - Description: Search property listings by keyword.

- **Get Listing Details**
  - Route: `GET /listings/:listingId`
  - Description: Retrieve details of a specific property listing.

- **Delete Listing**
  - Route: `DELETE /listings/:listingId`
  - Description: Delete a property listing.

### User Routes

- **Get User Trips**
  - Route: `GET /users/:userId/trips`
  - Description: Retrieve trips associated with a user.

- **Add/Remove Listing to/from Wishlist**
  - Route: `PATCH /users/:userId/:listingId`
  - Description: Add or remove a listing from a user's wishlist.

- **Get User Properties**
  - Route: `GET /users/:userId/properties`
  - Description: Retrieve properties listed by a user.

- **Get User Reservations**
  - Route: `GET /users/:userId/reservations`
  - Description: Retrieve reservations made by a user.

### Review Routes

- **Create Review**
  - Route: `POST /reviews/create/:listingId`
  - Description: Create a new review for a listing.

- **Get All Reviews**
  - Route: `GET /reviews`
  - Description: Retrieve all reviews.

- **Get Reviews by Listing ID**
  - Route: `GET /reviews/listing/:listingId`
  - Description: Retrieve reviews for a specific listing.



## Logger

### Overview

The logger middleware is responsible for logging various events and errors that occur during the execution of DreamGO. It helps in debugging, monitoring, and understanding the application's behavior.

### Usage

The logger middleware is integrated using the following steps:

1. **Installation:**
   ```bash
   npm install --save winston

## Rate Limiter

DreamGO uses a rate limiter to control the number of requests a user can make within a specific time frame. This helps prevent abuse and ensures fair usage of the application.

## Validator

Input validation is essential for ensuring that user-submitted data is accurate and secure. DreamGO employs a validator to check and sanitize user input.

## Screenshots

## 1. HomePage

![homepage](https://github.com/omkar231098/dream_go/assets/109202596/3f4cfb45-6228-4e39-83f0-d5d4d4656fe3)

## 2. RegisterPage
![register](https://github.com/omkar231098/dream_go/assets/109202596/1571de1e-21e2-42d1-a036-7dea080912b7)

## 3. LoginPage

![login](https://github.com/omkar231098/dream_go/assets/109202596/366e05df-351f-4b3a-8639-229afd691725)

## 4. ReservationListPage
![reservation](https://github.com/omkar231098/dream_go/assets/109202596/fe9c721b-a273-48b5-9aaf-04f353a6116d)



## 5. WishListPage
![wishlist](https://github.com/omkar231098/dream_go/assets/109202596/f42beeb7-7484-49fa-92e6-430fe4e4a84a)


## 6. PropertyListPage
![property](https://github.com/omkar231098/dream_go/assets/109202596/019c051a-db79-42d6-b4a5-333efe1a62da)

## 7. BecomeHostPage

![becomehostpage](https://github.com/omkar231098/dream_go/assets/109202596/166948a0-a6f6-4ef8-a302-dfd12180edf0)

## 8. ReservationPage
![ReservationPage](https://github.com/omkar231098/dream_go/assets/109202596/17d4db17-abf3-4a0c-ab1b-2c48b557c990)

## 9. ReviewSection

![review](https://github.com/omkar231098/dream_go/assets/109202596/4e5eadae-a39f-4669-a0e4-001630227b14)


## 10. PaymentPage
![payment](https://github.com/omkar231098/dream_go/assets/109202596/dc7e0275-a33a-4a5d-9c3b-b85e1aad1159)


## Deployed Link
The Dream GO Frontend is deployed at https://dreamgo-green.vercel.app/

## Contribution

We welcome contributions! If you have suggestions or improvements for the error handling process, please follow the [Contributing Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE). See the [LICENSE](LICENSE) file for details.
