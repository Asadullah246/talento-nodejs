# Talento App Backend

Talento is a social networking platform similar to Facebook. This backend system powers the core functionalities of the app, handling user authentication, media uploads, real-time communication, and more.

---

## Features

- **User Authentication:** Secure login and registration using JWT and bcrypt
- **Profile Management:** User data handling via MongoDB and Mongoose
- **File Uploads:** Upload profile pictures, posts, and other media using Multer and AWS S3
- **Real-time Messaging:** Enable chat and notifications using Socket.io
- **Email Services:** Account verification and notification emails via Nodemailer
- **API-first Design:** Clean and scalable RESTful API using Express.js
- **Security:** Environment variable management with dotenv and secure data handling
- **Unique Identifiers:** UUID used for user IDs, posts, and other resources
- **CI/CD Pipeline:** Automated build, test, and deployment using GitHub Actions and Docker
- **Monitoring & Metrics:** Real-time observability using Prometheus and Grafana
- **Unit & Integration Testing:** Not yet done

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Auth:** JWT, bcrypt
- **File Handling:** Multer, multer-s3, AWS S3
- **Real-time:** Socket.io
- **Mailing:** Nodemailer
- **Utilities:** dotenv, uuid
- **Containerization:** Docker, Docker Compose
- **CI/CD:** GitHub Actions, Docker Hub
- **Monitoring:** Prometheus, Grafana
- **Testing:**

---

## CI/CD Pipeline

This project uses GitHub Actions to:

- Run tests (`npm test`)
- Build the Docker image
- Push to Docker Hub
- Deploy to VPS using SSH and Docker

**Workflow file:** `.github/workflows/main.yml`

---

## Observability

**Prometheus** scrapes app metrics exposed via `/metrics` endpoint.  
**Grafana** dashboards visualize system health and app metrics (GC time, memory usage, HTTP requests, etc.).

---

## Getting Started (Development)

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file with necessary environment variables:
   - `MONGO_URI=`
   - `JWT_SECRET=`
   - etc.

Start the app:
   ```bash
   npm run dev
