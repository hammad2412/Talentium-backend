# 🚀 Talentium Backend

> A production-grade REST API backend for a job portal platform built with **Node.js**, **Express**, and **MongoDB** — designed with scalable architecture, strong security practices, and modular design.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Joi](https://img.shields.io/badge/Joi-0080FF?style=for-the-badge&logoColor=white)
[![Live on Render](https://img.shields.io/badge/Live%20on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://talentium-backend.onrender.com)

---

## 🌐 Live Deployment

The API is live and deployed on **Render**:

|                     |                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| 🔗 **Base URL**     | `https://talentium-backend.onrender.com`                                                         |
| 🏥 **Health Check** | [`https://talentium-backend.onrender.com/health`](https://talentium-backend.onrender.com/health) |
| 📡 **API Base**     | `https://talentium-backend.onrender.com/api/v1`                                                  |

> ⚠️ **Note:** This project is hosted on Render's free tier. The server may take **30–60 seconds to wake up** on the first request after a period of inactivity.

---

## 📌 Project Overview

**Talentium Backend** powers a job portal platform connecting **candidates** and **recruiters**.

The backend system handles:

- 🔐 Authentication & authorization
- 👤 Candidate profile management
- 🏢 Recruiter company management
- 📋 Job posting & management
- 📨 Job applications
- 📊 Profile completeness tracking
- 🛡️ Secure API access

Built with a **modular MVC-inspired architecture** to ensure scalability, maintainability, and security.

---

## 🗂️ Project Architecture

```
src
│
├── controllers
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── job.controller.js
│   ├── company.controller.js
│   ├── application.controller.js
│   ├── candidateProfile.controller.js
│   ├── candidateEducation.controller.js
│   ├── candidateExperience.controller.js
│   ├── candidateSkill.controller.js
│   ├── candidateProject.controller.js
│   └── candidatePreference.controller.js
│
├── models
│   ├── User.model.js
│   ├── Company.model.js
│   ├── Job.model.js
│   ├── Application.model.js
│   ├── CandidateProfile.model.js
│   ├── CandidateEducation.model.js
│   ├── CandidateExperience.model.js
│   ├── CandidateSkill.model.js
│   ├── CandidateProject.model.js
│   └── CandidatePreference.model.js
│
├── routes
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── company.routes.js
│   ├── job.routes.js
│   ├── application.routes.js
│   ├── candidateProfile.routes.js
│   ├── candidateEducation.routes.js
│   ├── candidateExperience.routes.js
│   ├── candidateSkill.routes.js
│   ├── candidateProject.routes.js
│   └── candidatePreference.routes.js
│
├── middlewares
│   ├── auth.middleware.js
│   ├── authorize.middleware.js
│   ├── pagination.middleware.js
│   ├── validate.middleware.js
│   ├── user.middleware.js
│   └── error.middleware.js
│
├── validations
│   ├── auth.validation.js
│   ├── job.validation.js
│   ├── application.validation.js
│   ├── company.validation.js
│   ├── candidateProfile.validation.js
│   ├── candidateEducation.validation.js
│   ├── candidateExperience.validation.js
│   ├── candidateSkill.validation.js
│   ├── candidateProject.validation.js
│   └── candidatePreference.validation.js
│
├── utils
│   ├── asyncHandler.js
│   ├── ErrorResponse.js
│   ├── generateProfileSlug.js
│   └── profileCompletion.js
│
├── app.js
└── server.js
```

### Layer Responsibilities

| Layer          | Purpose                                                                          |
| -------------- | -------------------------------------------------------------------------------- |
| `controllers/` | Business logic — handles requests, talks to models, returns responses            |
| `routes/`      | Defines endpoints and chains middleware to controllers                           |
| `models/`      | Mongoose schemas — shape, validation, and DB relationships                       |
| `middlewares/` | Reusable pipeline stages — auth, roles, validation, pagination, errors           |
| `validations/` | Joi schemas that enforce request body structure before controllers run           |
| `utils/`       | Shared helpers — async wrappers, error classes, slug generation, profile scoring |

---

## ⚙️ Core System Design

### Request Lifecycle

```
Route → Authentication → Authorization → Validation → Controller → Database
```

| Layer          | Role                                                                            |
| -------------- | ------------------------------------------------------------------------------- |
| **Controller** | Executes business logic using `asyncHandler`, interacts with Mongoose models    |
| **Route**      | Entry gate — chains auth → authorize → validate before delegating to controller |
| **Model**      | Mongoose schemas handle DB-level validation, defaults, and population           |
| **Middleware** | Cross-cutting concerns executed on every matched request                        |

---

## 🔒 Security Architecture

| Feature                  | Implementation                                                              |
| ------------------------ | --------------------------------------------------------------------------- |
| 🪖 **HTTP Headers**      | `helmet` sets secure response headers                                       |
| 🚦 **Rate Limiting**     | `express-rate-limit` — **100 requests / IP / 10 minutes**                   |
| 🧹 **HPP Protection**    | `hpp` sanitizes query strings against parameter pollution                   |
| 🔑 **JWT Auth**          | Access token verification + user activity check on every protected route    |
| 🌐 **CORS**              | Strict origin whitelist — only approved clients permitted                   |
| 🎭 **Role-Based Access** | `authorize` middleware enforces `candidate` / `recruiter` role restrictions |

---

## 🛡️ Middleware System

### `auth.middleware.js`

Extracts and verifies the JWT access token. Attaches the authenticated user to `req.user` for downstream middleware and controllers.

### `authorize.middleware.js`

Higher-order middleware factory. Accepts allowed roles (`candidate`, `recruiter`) and returns `403 Forbidden` if the user's role isn't permitted.

### `validate.middleware.js`

Accepts a Joi schema and validates `req.body` before the controller runs. Returns `400 Bad Request` with a descriptive message on failure.

### `pagination.middleware.js`

Reusable pagination utility. Reads `page` and `limit` from query params, computes MongoDB `skip`/`limit`, and supports document population.

### `error.middleware.js`

Global Express error handler at the end of the middleware stack. Uses the custom `ErrorResponse` class to return consistent JSON error responses.

---

## 🔑 Authentication System

**Features:**

- Candidate & Recruiter registration with role assignment
- Secure login with signed JWT access token
- Current session retrieval
- Token refresh for seamless renewal
- Logout & token invalidation

| Method | Endpoint                          | Description                    |
| ------ | --------------------------------- | ------------------------------ |
| `POST` | `/api/v1/auth/login`              | Authenticate user & return JWT |
| `POST` | `/api/v1/auth/register/candidate` | Register a new candidate       |
| `POST` | `/api/v1/auth/register/recruiter` | Register a new recruiter       |
| `POST` | `/api/v1/auth/refresh`            | Refresh access token           |
| `POST` | `/api/v1/auth/logout`             | Invalidate current session     |
| `GET`  | `/api/v1/auth/me`                 | Fetch authenticated user       |

---

## 👤 Candidate Features

Candidates can build fully structured professional profiles across multiple modules.

### 📋 Candidate Profile

- Create, update & delete profile
- Fetch profile or full aggregated profile

### 📊 Profile Completion System

A utility calculates completeness percentage based on:

- Profile data · Education · Experience · Skills · Projects · Preferences

### 🛠️ Skills

- Add, update & delete skills
- Retrieve full skills list

### 🎓 Education

- Add, update & delete education entries
- Retrieve education history

### 💼 Experience

- Add, update & delete work experiences
- Retrieve all experiences

### 🚀 Projects

- Add, update & delete portfolio projects
- Retrieve projects list

### ⚙️ Preferences

Set job preferences: target role, preferred location, expected salary range, and job type (full-time, part-time, remote, contract).

---

## 🏢 Recruiter Features

### Company Management

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| `POST` | `/api/v1/company`    | Create company profile |
| `GET`  | `/api/v1/company/me` | Retrieve own company   |
| `PUT`  | `/api/v1/company`    | Update company details |

---

## 📋 Job Management

### Recruiter Actions

- Create, update & delete job postings
- Change job status (open / closed / draft)
- View all their listings

### Candidate Discovery

Browse all active jobs with server-side pagination:

```
GET /api/v1/jobs?page=1&limit=10
```

| Method   | Endpoint                  | Description                 |
| -------- | ------------------------- | --------------------------- |
| `POST`   | `/api/v1/jobs`            | Create a job posting        |
| `PUT`    | `/api/v1/jobs/:id`        | Update job details          |
| `DELETE` | `/api/v1/jobs/:id`        | Delete a job                |
| `PATCH`  | `/api/v1/jobs/:id/status` | Change job status           |
| `GET`    | `/api/v1/jobs/my-jobs`    | Recruiter's job listings    |
| `GET`    | `/api/v1/jobs`            | Browse all jobs (paginated) |

---

## 📨 Job Applications System

Candidates apply to jobs. Recruiters review and manage applicants through a structured status workflow.

**Application Statuses:** `pending` → `reviewing` → `shortlisted` → `rejected` / `accepted`

| Method  | Endpoint                            | Description               |
| ------- | ----------------------------------- | ------------------------- |
| `POST`  | `/api/v1/applications/apply/:jobId` | Apply to a job            |
| `GET`   | `/api/v1/applications/jobs/:jobId`  | Get applicants for a job  |
| `PATCH` | `/api/v1/applications/:id/status`   | Update application status |

---

## ⚡ Performance Optimizations

- **Server-side pagination** on all listing endpoints — prevents full collection scans
- **MongoDB population** joins related resources efficiently:
  - `Job` → `Company`
  - `Application` → `Candidate`
  - `Application` → `CandidateProfile`

---

## 🏥 Health Monitoring

```
GET /health
```

Returns: server status · environment · timestamp · service owner

---

## 🚀 Future Improvements

- [ ] 🔍 Advanced candidate search (skills, education, location, salary, tech stack)
- [ ] 🔡 Full-text job search with Atlas Search / Elasticsearch
- [ ] ⚡ Redis caching for job listings and company profiles
- [ ] 📧 Email notification system for application status changes
- [ ] 📄 Resume parsing from uploaded PDFs
- [ ] 🤖 AI-based candidate recommendation system

---

## 🧱 Tech Stack

| Category       | Technologies                    |
| -------------- | ------------------------------- |
| **Runtime**    | Node.js                         |
| **Framework**  | Express.js                      |
| **Database**   | MongoDB, Mongoose               |
| **Security**   | Helmet, Express Rate Limit, HPP |
| **Validation** | Joi                             |
| **Utilities**  | Morgan, Cookie Parser, CORS     |

---

## ✍️ Author

**Hammad Khan** — MERN Stack Developer
