# Railway Deployment Guide

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. Your project code pushed to GitHub (already completed)

## Deployment Steps

### 1. Connect Railway to GitHub

1. Log in to your Railway account
2. Click on "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository: `ranjeetverma061/trading-journal-app`
5. Grant Railway access to your repository

### 2. Configure Environment Variables

After connecting your repository, Railway will automatically detect the project structure. You'll need to set up environment variables for the database connection:

1. In your Railway project dashboard, go to the "Variables" tab
2. Add the following variables:
   - `DATABASE_URL`: Your PostgreSQL database connection string
   - You can use Railway's built-in PostgreSQL service or connect to an external database

### 3. Deploy the Application

1. Click the "Deploy" button in the Railway dashboard
2. Railway will automatically:
   - Install dependencies (npm install)
   - Start the application using the command in railway.toml (node server.js)
   - Set up the database table if it doesn't exist

### 4. Verify Deployment

1. Once deployment is complete, Railway will provide a URL for your application
2. Visit this URL to ensure your trading journal app is running
3. Test the functionality by adding, viewing, and deleting entries

## Important Notes

- The application uses PostgreSQL, so make sure your DATABASE_URL is properly configured
- The server.js file has built-in logic to create the "entries" table if it doesn't exist
- File uploads are stored in the "uploads" directory, which Railway should handle automatically
- The application runs on port 3007 by default, but Railway will handle port allocation

## Troubleshooting

If deployment fails:
1. Check the Railway logs for error messages
2. Ensure all environment variables are correctly set
3. Verify your database connection string is valid
4. Make sure all required dependencies are listed in package.json
