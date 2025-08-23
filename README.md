# Blog App with React and Firebase

A full-featured blog application built with React and Firebase, allowing users to create, read, update, and delete blog posts.

## Features

- User authentication (signup, login, logout)
- Create, edit, and delete blog posts
- Upload images for blog posts
- Markdown content support
- Tagging system for categorizing posts
- Dashboard for managing your posts
- Responsive design with Tailwind CSS

## Technologies Used

- React
- TypeScript
- Firebase (Authentication, Firestore, Storage)
- React Router
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/blog-app.git
   cd blog-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password), Firestore, and Storage
   - Copy your Firebase configuration

4. Create a `.env` file in the root directory with your Firebase credentials:
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

5. Update the Firebase configuration in `src/firebase/config.ts` with your credentials.

6. Start the development server:
   ```
   npm start
   ```

7. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Usage

1. Sign up for a new account or log in with an existing one.
2. Create a new blog post from the dashboard or the "Write Blog" button.
3. Add a title, content, optional image, and tags to your post.
4. Choose to publish immediately or save as a draft.
5. Manage your posts from the dashboard.
6. View all published posts from the Blogs page.

## Deployment

To build the app for production:

```
npm run build
```

You can deploy the app to Firebase Hosting:

1. Install Firebase CLI:
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```
   firebase login
   ```

3. Initialize Firebase:
   ```
   firebase init
   ```

4. Deploy to Firebase:
   ```
   firebase deploy
   ```

## License

This project is licensed under the MIT License.
