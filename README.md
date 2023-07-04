# ChessU - Chess Course Platform - Frontend

This repository contains the frontend code for a Chess Course Platform developed using Next.js. The platform allows users to access and enroll in various chess courses, with server-side rendering and authentication provided by Clerk and payment processing facilitated by Stripe. The application is deployed on Vercel and utilizes a REST API and an S3 bucket for data storage.

## Features

- Browse and enroll in chess courses
- Secure user authentication provided by Clerk
- Seamless payment processing with Stripe
- Server-side rendering for improved performance and SEO
- Data storage and retrieval using a REST API and an S3 bucket

## Technologies Used

The frontend of the Chess Course Platform is built using the following technologies:

- Next.js: A React framework for building server-side rendered applications.
- Clerk: A user authentication and identity management platform.
- Stripe: A payment processing platform for handling course enrollment payments.
- Vercel: A cloud platform for deploying and hosting web applications.
- REST API: Used for communication with the backend to retrieve and store data.
- S3 Bucket: Amazon Simple Storage Service for securely storing and retrieving files.

## Getting Started

To run the Chess Course Platform frontend locally, follow these steps:

1. Clone this repository to your local machine.
2. Install the dependencies by running the following command:

   ```
   npm install
   ```

3. Configure the necessary environment variables. You will need to provide the following:

   - Clerk API credentials: Obtain the Clerk API credentials from the Clerk Developer Dashboard.
   - Stripe API credentials: Create a Stripe account and obtain the necessary API credentials.
   - REST API URL: Provide the URL of the backend REST API for data retrieval and storage.
   - S3 Bucket details: Configure the S3 bucket information for storing files.

4. Start the development server by running the following command:

   ```
   npm run dev
   ```

5. Access the application by visiting `http://localhost:3000` in your web browser.

## Deployment

The Chess Course Platform frontend can be deployed on Vercel using the following steps:

1. Create an account on Vercel and connect it to your Git repository.
2. Configure the necessary environment variables in the Vercel dashboard.
3. Set up the deployment settings, including specifying the branch to deploy and any build commands.
4. Trigger a new deployment, and Vercel will automatically build and deploy the application.