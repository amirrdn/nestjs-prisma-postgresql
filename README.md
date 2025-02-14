# NestJS Backend with Prisma and PostgreSQL

## Description

This project is a backend application built using NestJS, Prisma ORM, and PostgreSQL. It provides a set of RESTful APIs for user authentication, market, and product.

## Features

-   User authentication (register, login, logout, session management)
-   Market management (CRUD operations)
-   Product management (CRUD operations, filtering by category)
-   Database migrations and seeding using Prisma
-   Dockerized setup with PostgreSQL

## Prerequisites

-   Node.js (v18+)
-   Docker & Docker Compose

## Installation

1.  Clone the repository:
    
    ```sh
    git clone git@github.com:amirrdn/nestjs-prisma-postgresql.git
    cd nestjs-prisma-postgresql
    
    ```
    
2.  Install dependencies:
    
    ```sh
    npm install
    
    ```
    
3.  Create a `.env` file based on `.env.example`:
    
    ```sh
    cp .env.example .env
    
    ```
    
    Configure environment variables accordingly.
    
4.  Run database migrations:
    
    ```sh
    npx prisma migrate deploy
    
    ```
    
5.  Seed the database (if applicable):
    
    ```sh
    npx prisma db seed
    
    ```
    

## Running the Application

### Using Docker

1.  Build and start the services:
    
    ```sh
    docker-compose up --build
    
    ```
    
2.  The application should be running at `http://localhost:3000`

### Without Docker

1.  Start the PostgreSQL database manually.
2.  Run the NestJS server:
    
    ```sh
    npm run start:dev
    
    ```
    

## API Endpoints

### User APIs

-   `GET /api/user` - Get users (filter by role, requires JWT)
-   `POST /api/user` - Create a user (admin only, requires JWT)
-   `POST /api/user/register` - Register a customer or seller
-   `POST /api/user/login` - Authenticate user and return tokens
-   `POST /api/user/logout` - Logout user by removing session
-   `POST /api/user/logout-all` - Logout user from all sessions
-   `GET /api/user/session` - Get user sessions (requires JWT)
-   `GET /api/user/:user_id` - Get user by ID
-   `PUT /api/user/:user_id` - Update user by ID (requires JWT)
-   `DELETE /api/user/:user_id` - Delete user by ID (requires JWT)

### Market APIs

-   `GET /api/market` - Get markets (admin only, requires JWT)
-   `POST /api/market` - Create a market (seller only, requires JWT)
-   `GET /api/market/:market_id` - Get market by ID (requires JWT)
-   `PUT /api/market/:market_id` - Update market by ID (requires JWT)
-   `DELETE /api/market/:market_id` - Delete market by ID (requires JWT)

### Product APIs

-   `GET /api/product` - Get products (filter by category)
-   `POST /api/product` - Create a product (seller only, requires JWT)
-   `GET /api/product/:product_id` - Get product by ID
-   `PUT /api/product/:product_id` - Update product by ID (requires JWT)
-   `DELETE /api/product/:product_id` - Delete product by ID (requires JWT)

## Database Schema (Prisma)

-   User
-   Session
-   Market
-   Category
-   Product

## Technologies Used

-   NestJS
-   Prisma ORM
-   PostgreSQL
-   Docker & Docker Compose