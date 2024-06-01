# Real-Time Collaborative Code Editor

## Overview

This project is a real-time collaborative code editor built using React, Node.js, and Socket.io. It supports C++, Java, and Python, providing a seamless experience for multiple users to collaborate on code in real-time. Features include synchronized editing, multi-language support, real-time chat, and in-app code execution. Users can create unique rooms using UUIDs, enabling easy access via referral links for enhanced collaboration.

## Features

- **Real-Time Collaboration**: Multiple users can edit code simultaneously with changes synchronized in real-time.
- **Multi-Language Support**: Supports coding in C++, Java, and Python.
- **Real-Time Chat**: In-app chat feature allows users to communicate while coding.
- **In-App Code Execution**: Execute C++, Java, and Python code within the app (requires respective setups on the system).
- **Unique Room Creation**: Rooms created with UUIDs for easy sharing and access via referral links.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- C++ compiler
- Python (v3.6 or later)
- Java (JDK 8 or later)

Ensure you have the necessary environment setup for running C++, Python, and Java code on your system.

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/repo-name.git
    cd repo-name
    ```

2. **Install dependencies for both client and server:**
    ```bash
    npm install
   
    ```

## Running the Application

### Starting the Client

To start the client application, navigate to the root directory and run:
```bash
npm start
```

### Starting the server

To start the server, navigate to the root directory and run:
```bash
npm run server:dev
```

### Usage

- Access the Application: Open your browser and navigate to http://localhost:3000.
- Create a Room: Click on "Create Room" to generate a unique room with a UUID.
- Share the Link: Copy the referral link and share it with collaborators.
- Start Collaborating: Begin coding together in real-time, use the chat feature to communicate, and execute code within the app.


### Future Improvements
- Enhanced Security: Implement authentication and authorization to secure rooms and user data.
- GitHub Integration: Add features to push code directly to GitHub repositories from within the app.
- Video Conferencing: Integrate a video feature to allow face-to-face communication during collaboration.

### Contact
For any questions or feedback, please open an issue on the repository or contact the project maintainer.
