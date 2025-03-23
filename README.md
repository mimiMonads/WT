# Q&A Website

# Integrants
## Antony Vladimir Montemayor Terrazas 3105325
## Bruna Gonçalves Heleno 3009733
## Elton Nakaoji

This project is part of the Web Technologies course at Griffith College Cork.
It is a **Question and Answer (Q&A) Website** designed for developers to ask and answer technical questions. The plataform includes authentication, CRUD operation, templating, and validation.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Usage](#usage)
- [Controllers - API Routes](#controllers)
- [Database Schema](#database)
- [CRUD Operations](#crud-operations)
- [Validation](#validation)
- [Testing](#testing)
- [Deployment](#deployment)


## Features
- **User Authentication**
- Users can login and logout
    - email, token generation
- Users can add profile picture
- Users can set their status
- Users can set their privacy to allow who can send messages to them
- **Q&A Posting**
- Users can post, edit, and delete questions
- Users can reply messages
- Users can refuse messages
- **Search & Filtering**
- Users can search over content
- **Responsive UI**
- Works across devices with angular frontend
- **Database Management**
- MongoDB for storing user data and messages (questions and answers)
- **Session Handling**
- Uses cookies and session for state maintenance
- **Deployment**
- Hosted online: 

## Technology Stack
- Angular: Frontend UI
- Node.js: Backend Server
- Express.js: API routing & middleware
- MongoDB: Database
- Jest and Supertest: Unit Test
- Joi: validation
- JSON Web Token (JWT): Authentication
- **Languages**
- JavaScript
- HTML
- TypeScript
- SCSS

## Usage
- Register/Login using email and token
- Post and browse questions
- Comment and answer questions
- Delete and refuse questions
- Search using keywords

## Controllers - API Routes

### Authentication  
| Method | Route     | Description             |
|--------|----------|-------------------------|
| `GET`  | `/login` | Displays login page     |
| `POST` | `/login` | Authenticates user & returns JWT |
| `GET`  | `/logout` | Logs out the user (client must discard token) |

### User Management  
| Method  | Route             | Description               |
|---------|------------------|---------------------------|
| `GET`   | `/user`          | Fetch logged-in user profile |
| `GET`   | `/user/:name`    | View a public user profile |
| `POST`  | `/user/status`   | Update user status |
| `POST`  | `/user/privacy`  | Set user privacy settings |
| `POST`  | `/user/php`      | Upload profile picture |

### Messaging  
| Method  | Route                | Description                  |
|---------|----------------------|------------------------------|
| `POST`  | `/user/getM`         | Fetch received messages |
| `POST`  | `/user/refuse`       | Delete a received message |
| `POST`  | `/user/replay`       | Reply to a message |
| `POST`  | `/post/:userID`      | Send a message to a user |

### Messages API  
| Method  | Route                  | Description                  |
|---------|------------------------|------------------------------|
| `GET`   | `/api/messages`        | Get all messages |
| `POST`  | `/api/messages`        | Create a new message |
| `GET`   | `/api/messages/:id`    | Get a specific message |
| `PUT`   | `/api/messages/:id`    | Update a message |
| `DELETE`| `/api/messages/:id`    | Delete a message |
| `GET`   | `/api/messages/search/:query` | Search messages |

## Database

### Users Collection
| Field          | Type       | Description                      |
|---------------|-----------|----------------------------------|
| `_id`         | `ObjectId` | Unique identifier for the user |
| `name`        | `String`   | Full name of the user |
| `username`    | `String`   | Unique username |
| `password`    | `String`   | Hashed password |
| `profilePicture` | `String` | URL or path to profile picture |
| `status`      | `String`   | User's status message |
| `privacy`     | `String`   | Privacy setting for messages (`public`, `friends`, etc.) |
| `createdAt`   | `Date`     | Timestamp of account creation |
| `updatedAt`   | `Date`     | Timestamp of last update |

### Messages Collection
| Field        | Type       | Description                      |
|-------------|-----------|----------------------------------|
| `_id`       | `ObjectId` | Unique identifier for the message |
| `content`   | `String`   | Message text content |
| `sender`    | `ObjectId` | Reference to the sender (`User`) |
| `recipient` | `ObjectId` | Reference to the recipient (`User`) |
| `replies`   | `Array`    | List of reply objects (`content`, `date`) |
| `createdAt` | `Date`     | Timestamp of when message was created |
| `updatedAt` | `Date`     | Timestamp of last message update |

### User Example
```json
{
  "_id": "60f718b2e13b7c3a2c1d1234",
  "name": "John Doe",
  "username": "johndoe",
  "password": "$2b$10$abcd1234...",
  "profilePicture": "uploads/johndoe.jpg",
  "status": "Feeling great!",
  "privacy": "public",
  "createdAt": "2025-03-23T12:00:00.000Z",
  "updatedAt": "2025-03-23T12:10:00.000Z"
}
```
## CRUD Operations
This project implements full **CRUD** (Create, Read, Update, Delete) operattions for managing users and messages within a social messaging system. Users can **create** accounts, **update** their profile information, set privacy preferences, and manage their statuses. Authentication is handled through a **login system** that uses JWT tokens for secure access. Messages can be **created** by users, either as direct messages or wall posts, and recipients can choose to **accept, refuse, or reply** them. The system also allows users to **retrieve (read)** their messages, including searching for specific content. Messages can be **updated** with new content, and **deleted**.

## Validation
The validation is made using **Joi schemas** to ensure data integrity and security. Each schema enforces specific constraints, such as required fields, length limits, and allowed values, preventing invalid or harmful data from being processed. The validate middleware function checks incoming requests against these schemas before passing them to the route handlers.

## Testing
This project includes comprehensive unit and integration tests to ensure the reliability of the backend functionality. The Mongoose models are tested using **Jest**, where methods like .save(), .findOne(), and .findById() are mocked to simulate database operations without requiring a real database. The route handlers are tested using **Supertest** to verify API endpoints for user authentication, messaging, and post management, ensuring they return expected responses and status codes. Additionally, the validation middleware is tested to confirm that invalid input is correctly rejected while valid input proceeds as expected.

```bash
npm install jest --global
jest
```

## Deployment
