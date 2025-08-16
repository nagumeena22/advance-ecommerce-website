# E-commerce Project Setup Guide

This guide will help you run the e-commerce project without errors.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **MongoDB** (optional - the project uses in-memory storage for now)

## Setup Instructions

### 1. Backend Setup

1. Navigate to the Server directory:
   ```bash
   cd Advance-Ecommerce-main/Server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the Server directory:
   ```bash
   cp env.example .env
   ```

4. Edit the `.env` file with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   CORS_ORIGIN=http://localhost:5173
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

The server should start on `http://localhost:5000`

### 2. Frontend Setup

1. Open a new terminal and navigate to the Client directory:
   ```bash
   cd Advance-Ecommerce-main/Client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend should start on `http://localhost:5173`

## Testing the Application

1. Open `http://localhost:5173` in your browser
2. Navigate to the sign-in page
3. Use any email and password to register/login (since we're using in-memory storage)
4. After login, you can access the account page and other features

## Project Structure

- **Client/**: React frontend with Vite
- **Server/**: Node.js backend with Express
- **MlServer/**: Python ML server for virtual try-on features

## Features

- User authentication (register/login)
- Product browsing
- Shopping cart
- User account management
- Virtual try-on (requires ML server setup)

## Troubleshooting

### Common Issues:

1. **Port already in use**: Change the PORT in .env file
2. **CORS errors**: Ensure the CORS_ORIGIN in .env matches your frontend URL
3. **Module not found**: Run `npm install` in both Client and Server directories

### Backend Issues:
- Check if MongoDB is running (if using database)
- Verify .env file exists and has correct values
- Check console for error messages

### Frontend Issues:
- Clear browser cache
- Check browser console for errors
- Verify API endpoints are correct

## Development Notes

- The project currently uses in-memory storage for users
- JWT tokens are used for authentication
- The ML server is optional and requires Python setup
- All API endpoints are prefixed with `/api` 