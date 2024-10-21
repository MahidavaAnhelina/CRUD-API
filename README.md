# CRUD API Project

## Description

This project is a simple **CRUD (Create, Read, Update, Delete) API** built with **Node.js** and **TypeScript**. It uses an in-memory database to store user data and supports basic CRUD operations via HTTP requests.

The application supports:

- **Development Mode**: For ease of development and debugging.
- **Production Mode**: For deployment with optimized performance.
- **Horizontal Scaling**: Utilizes the Node.js Cluster API with a load balancer implementing a round-robin algorithm.

## Features

- **CRUD Operations**: Create, read, update, and delete user records.
- **In-Memory Database**: Stores data in memory for simplicity.
- **TypeScript**: Provides static typing for better code quality.
- **Load Balancing**: Distributes requests across multiple worker processes.
- **Environment Variables**: Configurable via a `.env` file.

## Prerequisites

- **Node.js** version **22.x.x** (22.9.0 or higher)
- **npm** (comes with Node.js)

## Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:MahidavaAnhelina/CRUD-API.git
   cd crud-api
   git checkout add-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

## Running the Application

### Development Mode

Runs the application using `ts-node-dev`, which automatically restarts the server on code changes.

```bash
npm run start:dev
```

### Production Mode

Builds the application using the TypeScript compiler and Webpack, then runs the compiled code.

```bash
npm run start:prod
```

### Multi-Instance Mode (Horizontal Scaling)

Starts multiple instances of the application using the Node.js Cluster API. A load balancer distributes requests across worker processes using a round-robin algorithm.

```bash
npm run start:multi
```

## API Endpoints

The base URL is `http://localhost:4000/api/users`

### Get All Users

- **Endpoint**: `GET /api/users`
- **Description**: Retrieves all user records.
- **Response**:
   - `200 OK`: Returns an array of users.

### Get User by ID

- **Endpoint**: `GET /api/users/:userId`
- **Description**: Retrieves a user by their unique ID.
- **Parameters**:
   - `userId` (path parameter): UUID of the user.
- **Response**:
   - `200 OK`: Returns the user object.
   - `400 Bad Request`: If `userId` is not a valid UUID.
   - `404 Not Found`: If the user does not exist.

### Create a New User

- **Endpoint**: `POST /api/users`
- **Description**: Creates a new user.
- **Body** (JSON):

  ```json
  {
    "username": "string", // required
    "age": number,        // required
    "hobbies": ["string"] // required (can be an empty array)
  }
  ```

- **Response**:
   - `201 Created`: Returns the created user object.
   - `400 Bad Request`: If required fields are missing or invalid.

### Update an Existing User

- **Endpoint**: `PUT /api/users/:userId`
- **Description**: Updates an existing user's information.
- **Parameters**:
   - `userId` (path parameter): UUID of the user.
- **Body** (JSON):

  ```json
  {
    "username": "string", // required
    "age": number,        // required
    "hobbies": ["string"] // required (can be an empty array)
  }
  ```

- **Response**:
   - `200 OK`: Returns the updated user object.
   - `400 Bad Request`: If `userId` is invalid or required fields are missing.
   - `404 Not Found`: If the user does not exist.

### Delete a User

- **Endpoint**: `DELETE /api/users/:userId`
- **Description**: Deletes a user by their unique ID.
- **Parameters**:
   - `userId` (path parameter): UUID of the user.
- **Response**:
   - `204 No Content`: If deletion is successful.
   - `400 Bad Request`: If `userId` is invalid.
   - `404 Not Found`: If the user does not exist.

## Testing the Application

You can test the API endpoints using tools like **Postman**, **Insomnia**, or **curl**.

### Example Test Scenario

1. **Get all users** (should return an empty array):

   ```bash
   curl -X GET http://localhost:4000/api/users
   ```

2. **Create a new user**:

   ```bash
   curl -X POST http://localhost:4000/api/users \
     -H "Content-Type: application/json" \
     -d '{
       "username": "John Doe",
       "age": 30,
       "hobbies": ["reading", "gaming"]
     }'
   ```

3. **Retrieve the created user by ID** (replace `<userId>` with the actual ID from the previous response):

   ```bash
   curl -X GET http://localhost:4000/api/users/<userId>
   ```

4. **Update the user**:

   ```bash
   curl -X PUT http://localhost:4000/api/users/<userId> \
     -H "Content-Type: application/json" \
     -d '{
       "username": "John Smith",
       "age": 31,
       "hobbies": ["writing", "hiking"]
     }'
   ```

5. **Delete the user**:

   ```bash
   curl -X DELETE http://localhost:4000/api/users/<userId>
   ```

6. **Confirm deletion** (should return 404 Not Found):

   ```bash
   curl -X GET http://localhost:4000/api/users/<userId>
   ```

### Testing Multi-Instance Mode

1. **Start the application in multi-instance mode**:

   ```bash
   npm run start:multi
   ```

2. **Send requests to `http://localhost:4000/api/users`**.

   Each request will be handled by different worker processes due to the round-robin load balancing.

3. **Ensure state consistency**:

   - **Create a user**.
   - **Retrieve the user** using a different worker.
   - **Delete the user**, confirming that changes are reflected across all workers.

## Dependencies

- **nodemon**
- **dotenv**
- **typescript**
- **ts-node-dev**
- **webpack-cli**
- **webpack**
- **uuid**
- **@types/node**
- **@types/uuid**
