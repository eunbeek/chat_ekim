# Chat Application

This project is a **real-time chat application** built using **React** for the client-side, **Node.js** for the backend, integrating both **WebSocket** for real-time messaging and a **REST API** for data persistence. The client interacts with the WebSocket for real-time updates and with the API to handle message storage and retrieval.

## Project Overview

The Chat Application provides a seamless interface for real-time communication. The client (React) sends and receives messages through **WebSocket** for immediate updates, while the **REST API** ensures that messages are stored and retrieved from a PostgreSQL database, maintaining a history of conversations.

### **YouTube Demo**

Watch a demo of the Chat Room on YouTube:

[![Chat Room Demo](https://img.youtube.com/vi/283ovhsYyUw/0.jpg)](https://youtu.be/283ovhsYyUw)

### Architecture Overview

The architecture consists of two distinct communication paths:

1. **Client ↔ WebSocket**:
   - Handles real-time messaging between the client and the server. Any message sent by the user is instantly broadcasted to all connected clients via the WebSocket server.
   
2. **Client ↔ REST API**:
   - Manages the storage and retrieval of messages. When a user sends a message, the client also makes an API call to store the message in the PostgreSQL database. Upon opening the chat, the client fetches previous messages from the API.

### Why This Structure?

This architecture allows the application to achieve real-time messaging (via WebSocket) while ensuring message history is preserved in the database (via the REST API). Separating these responsibilities ensures better scalability and maintainability:

- **WebSocket** provides low-latency real-time communication, making the chat feel instantaneous.
- **REST API** ensures data persistence, so users can view their previous conversations even after disconnecting.

### **Main Features**

- **Real-Time Messaging**: Messages are instantly delivered across all connected clients using WebSocket.
- **Message Persistence**: Messages are stored using the REST API in a PostgreSQL database, ensuring historical chat data is saved and retrievable.
- **CRUD Operations**: Users can create, read, update, and delete messages using API endpoints.

### **Tech Stack**

- **chat_client (Frontend)**: React, Material-UI
- **websocket-api (Real-Time)**: WebSocket for instant message updates
- **rest-api (API)**: Node.js, Express.js for managing message persistence and retrieval
- **Database**: PostgreSQL

### **How It Works**

1. **Client ↔ WebSocket**:
   - When a user sends a message, it is transmitted in real-time to all connected clients via WebSocket, ensuring instantaneous communication.
```
// Web socket 
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {});
  ws.on('close', () => {});
});
```
2. **Client ↔ REST API**:
   - Simultaneously, the message is also sent to the server via the REST API for persistent storage. This ensures that the message is saved in the database.
   - When a user opens the chat, the client fetches all past messages through an API call.
    - Create User (POST): ```/api/user```
    - Read All Users (GET): ```/api/users```
    - Read One User by Email (GET): ```/api/user?email=<email>```
    - Create Message (POST): ```/api/messages```
    - Read All Messages (GET): ```/api/messages```
    - Delete All Messages (DELETE): ```/api/messages```
    - Delete Message by ID (DELETE): ```/api/message?id=<id>```

### **Installation**

To run the project locally, follow these steps:

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/ChatApp.git
