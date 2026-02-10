# Talento App Backend

A Node.js backend for **Talento** — a social networking platform. It powers user authentication, posts & feeds, communities, real-time chat, stories, notifications, and more.

---

## Features

- **Authentication** — Sign up, sign in, change password, and token-based session management using JWT and bcrypt
- **User Profiles** — Profile management with profile/cover pictures, bio, follow/unfollow system, and user search & suggestions
- **Email Verification** — OTP-based email verification via Nodemailer (Gmail SMTP)
- **Posts & Feed** — Create, read, delete, and share posts with image/video uploads and paginated feeds
- **Comments** — Threaded comment system with nested replies and comment likes
- **Communities** — Create and manage communities with admin/moderator roles, member invitations, and community-specific posts
- **Likes** — Like/unlike toggle on posts and comments
- **Notifications** — In-app notifications for likes, comments, replies, follows, and community invitations with read/unread tracking
- **Real-time Chat** — One-to-one messaging with online/offline presence tracking via Socket.io
- **Stories** — Create image/video stories with automatic 24-hour expiration
- **File Uploads** — Media uploads to DigitalOcean Spaces (S3-compatible) using Multer
- **CI/CD** — Automated build and deployment via GitHub Actions and Docker

---

## Tech Stack

| Layer            | Technology                               |
| ---------------- | ---------------------------------------- |
| Runtime          | Node.js                                  |
| Framework        | Express.js                               |
| Database         | MongoDB (Mongoose ODM)                   |
| Authentication   | JWT, bcrypt                              |
| Real-time        | Socket.io                                |
| File Storage     | DigitalOcean Spaces (AWS S3 SDK, Multer) |
| Email            | Nodemailer (Gmail SMTP)                  |
| Testing          | Jest, Supertest                          |
| Containerization | Docker                                   |
| CI/CD            | GitHub Actions → Docker Hub → VPS        |

---

## Project Structure

```
talento-nodejs/
├── index.js                  # Entry point — HTTP server, Socket.io setup
├── app.js                    # Express app — middleware, routes, error handling
├── config/
│   ├── dbConnect.js          # MongoDB connection
│   └── multerConfig.js       # Multer + DigitalOcean Spaces (S3) config
├── middlewares/
│   ├── checkToken.js         # JWT authentication middleware
│   └── message/              # Message middleware (draft)
├── libs/
│   └── variables.js          # Shared constants (OTP time limit, etc.)
├── modules/
│   ├── auth/                 # Sign in, sign up, change password
│   ├── user/                 # Profile, follow/unfollow, search, OTP
│   ├── post/                 # CRUD, pagination, share, community posts
│   ├── commentModule/        # Threaded comments with replies & likes
│   ├── community/            # Community management & roles
│   ├── like/                 # Like/unlike for posts & comments
│   ├── notification/         # In-app notification system
│   ├── chat/                 # Chat history & contacts list
│   ├── story/                # Stories with 24h auto-expiry
│   └── verification/         # OTP generation & email sending
├── test/                     # Jest + Supertest tests
├── Dockerfile                # Docker image (node:20-alpine)
└── .github/workflows/
    └── main.yml              # CI/CD pipeline
```

Each module follows a consistent pattern: `model.js` → `controller.js` → `router.js`

---

## API Endpoints

All protected routes require `Authorization: Bearer <token>` header.

### Auth (`/auth`)

| Method | Endpoint          | Auth | Description                                    |
| ------ | ----------------- | ---- | ---------------------------------------------- |
| POST   | `/signIn`         | ✗    | Sign in with email & password                  |
| POST   | `/signUp`         | ✗    | Create new account (with optional file upload) |
| GET    | `/getUserByToken` | ✓    | Get current user from JWT                      |
| PUT    | `/changePassword` | ✓    | Change password                                |

### User (`/user`)

| Method | Endpoint                         | Auth | Description                        |
| ------ | -------------------------------- | ---- | ---------------------------------- |
| POST   | `/userOtpSend`                   | ✗    | Send OTP to email for verification |
| POST   | `/userOtpVerify`                 | ✗    | Verify OTP code                    |
| POST   | `/followUser`                    | ✓    | Follow a user                      |
| POST   | `/unFollowUser`                  | ✓    | Unfollow a user                    |
| POST   | `/checkFollow`                   | ✓    | Check follow status                |
| POST   | `/updateUser`                    | ✓    | Update profile (with file upload)  |
| POST   | `/ignorePost`                    | ✓    | Add post to ignore list            |
| GET    | `/getAllUsers`                   | ✓    | Get all users (paginated)          |
| GET    | `/getUserById`                   | ✓    | Get user by ID                     |
| GET    | `/searchUsers`                   | ✓    | Search users by name               |
| GET    | `/suggestUsers`                  | ✓    | Get user suggestions               |
| GET    | `/followingAndFollowers`         | ✓    | Get following & followers lists    |
| GET    | `/getUnjoinedUsers/:communityId` | ✓    | Get users not in a community       |

### Post (`/post`)

| Method | Endpoint                    | Auth | Description                                  |
| ------ | --------------------------- | ---- | -------------------------------------------- |
| POST   | `/createPost`               | ✓    | Create post (with file upload)               |
| POST   | `/sharePost`                | ✓    | Share an existing post                       |
| GET    | `/getPost`                  | ✓    | Get feed posts (paginated, excludes ignored) |
| GET    | `/getPostById`              | ✓    | Get single post by ID                        |
| GET    | `/getPostsById`             | ✓    | Get posts by user ID                         |
| GET    | `/getPostByUserId`          | ✓    | Get all posts for a user                     |
| GET    | `/getPostsByIdOfCommunity`  | ✓    | Get community posts                          |
| GET    | `/getPaginatedPosts`        | ✓    | Paginated post feed                          |
| DELETE | `/deletePostByUserIdPostId` | ✓    | Delete a post                                |

### Comment (`/comment`)

| Method | Endpoint            | Auth | Description                        |
| ------ | ------------------- | ---- | ---------------------------------- |
| POST   | `/create`           | ✓    | Create comment or reply            |
| PUT    | `/update`           | ✓    | Update a comment                   |
| DELETE | `/delete`           | ✓    | Delete a comment (and replies)     |
| GET    | `/topLevelComments` | ✓    | Get top-level comments (paginated) |
| GET    | `/replies`          | ✓    | Get replies for a comment          |
| GET    | `/getAllComments`   | ✓    | Get all comments with replies      |
| GET    | `/getCommentCount`  | ✓    | Get comment count for a post       |

### Like (`/like`)

| Method | Endpoint       | Auth | Description              |
| ------ | -------------- | ---- | ------------------------ |
| POST   | `/likePost`    | ✓    | Toggle like on a post    |
| POST   | `/likeComment` | ✓    | Toggle like on a comment |

### Community (`/community`)

| Method | Endpoint                          | Auth | Description                   |
| ------ | --------------------------------- | ---- | ----------------------------- |
| POST   | `/createCommunity`                | ✓    | Create community (with image) |
| POST   | `/addModerator`                   | ✓    | Add moderator                 |
| POST   | `/removeModerator`                | ✓    | Remove moderator              |
| POST   | `/inviteUserToCommunity`          | ✓    | Invite user to community      |
| POST   | `/acceptCommunityInvitation`      | ✓    | Accept invitation             |
| POST   | `/leaveCommunity`                 | ✓    | Leave a community             |
| POST   | `/updateCommunity`                | ✓    | Update community (with image) |
| POST   | `/deleteCommunity`                | ✓    | Delete a community            |
| POST   | `/removePersonFromCommunity`      | ✓    | Remove member                 |
| GET    | `/getMyCommunities`               | ✓    | Get joined communities        |
| GET    | `/forYouCommunities`              | ✓    | Discover communities          |
| GET    | `/getSingleCommunity`             | ✓    | Get community details         |
| GET    | `/getAdminOrModeratorCommunities` | ✓    | Get managed communities       |

### Notification (`/notification`)

| Method | Endpoint                          | Auth | Description                          |
| ------ | --------------------------------- | ---- | ------------------------------------ |
| POST   | `/createNotification`             | ✓    | Create a notification                |
| GET    | `/getNotifications`               | ✓    | Get notifications (marks as read)    |
| GET    | `/getNotificationsWithOutMarking` | ✓    | Get notifications (unread preserved) |
| GET    | `/unread`                         | ✗    | Get unread notification count        |
| PUT    | `/markAsRead`                     | ✗    | Mark single notification as read     |
| PUT    | `/markAllAsRead`                  | ✓    | Mark all notifications as read       |

### Chat (`/chat`)

| Method | Endpoint           | Auth | Description                  |
| ------ | ------------------ | ---- | ---------------------------- |
| GET    | `/getAllChatsList` | ✓    | Get all chat contacts        |
| GET    | `/getChatHistory`  | ✓    | Get chat history with a user |

Real-time messaging is handled via **Socket.io** events: `register`, `sendMessage`, `newMessage`, `userOnline`, `userOffline`.

### Story (`/story`)

| Method | Endpoint          | Auth | Description                     |
| ------ | ----------------- | ---- | ------------------------------- |
| POST   | `/createStory`    | ✓    | Create story (with file upload) |
| GET    | `/userStories`    | ✓    | Get current user's stories      |
| GET    | `/allStories`     | ✓    | Get all active stories          |
| DELETE | `/expiredStories` | ✗    | Delete expired stories          |

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas cluster (or local MongoDB)
- DigitalOcean Spaces bucket (for file uploads)
- Gmail account with App Password (for email verification)

### Installation

```bash
git clone https://github.com/Asadullah246/talento-nodejs.git
cd talento-nodejs
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Server
PORT=5000

# Database (MongoDB)
DB_CONNECTION_STRING=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# Authentication (JWT)
JWT_SECRET=your_jwt_secret_key

# Email (Nodemailer - Gmail)
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# DigitalOcean Spaces (S3-compatible storage)
DO_SPACES_KEY=your_spaces_access_key
DO_SPACES_SECRET=your_spaces_secret_key
DO_SPACES_ENDPOINT=https://your-region.digitaloceanspaces.com
DO_SPACES_BUCKET=your_bucket_name
```

### Run Locally

```bash
npm run dev
```

The server starts at `http://localhost:5000`.

### Run with Docker

```bash
docker build -t talento-backend .
docker run -d -p 5000:5000 --env-file .env talento-backend
```

---

## Testing

```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report
```

---

## CI/CD Pipeline

On every push to `main`, the GitHub Actions workflow:

1. **Builds** a Docker image from the project
2. **Pushes** the image to Docker Hub (`asadullah047/node-backend:latest`)

Workflow file: `.github/workflows/main.yml`

---

## License

ISC
