# Mechanical Day Trading Protocol Journal

This is a simple web application to log and review trades based on a mechanical trading protocol. It is built with a Node.js and Express backend, and a plain HTML, CSS, and JavaScript frontend.

## Prerequisites

- [Node.js](https://nodejs.org/) (which includes npm) must be installed on your system.
- A modern web browser.

## Local Setup and Installation

1.  **Clone the repository (or download the files):**
    ```bash
    git clone <your-repository-url>
    cd Rules
    ```

2.  **Install dependencies:**
    Open a terminal in the project directory and run the following command to install the necessary Node.js packages (`express`, `sqlite3`, `multer`, `cors`):
    ```bash
    npm install
    ```

## How to Run the Application

There are two ways to run the application locally:

### Option 1: Using the Batch Script (Windows)

Simply double-click the `start.bat` file. This will:
1.  Start the Node.js server.
2.  Wait for 3 seconds.
3.  Automatically open the application in your default web browser at `http://localhost:3007`.

### Option 2: Manual Start

1.  **Start the server:**
    Open a terminal in the project directory and run:
    ```bash
    node server.js
    ```
You should see the message `Server running at http://localhost:3007`.

2.  **Open the application:**
    Open your web browser and navigate to `http://localhost:3007`.

The application is now running, and you can add, view, and delete your trade journal entries.
