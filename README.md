# 🐝 TaskHive

**TaskHive** is a task and project board management web application that allows users to visually organize work with boards, columns, and tasks. It includes secure user authentication, PostgreSQL storage, and an extensible frontend ready for future ML features.

![image](https://github.com/user-attachments/assets/3fdb73dc-6c3c-455b-8029-820568a0c4b3)

---

## 🚀 Features

- ✨ Visual Kanban-style task boards
- 📌 Add columns, tasks, due dates, and priorities
- 🧑‍💻 User authentication with secure sessions
- 🎨 Profile customization (with image upload)
- 📦 PostgreSQL database integration
- 🌱 Designed for future ML timeline/priority prediction
- ☁️ Deployable on Heroku with optional custom domain support

---

## 🛠 Tech Stack

| Frontend | Backend          | Database   | DevOps         |
|----------|------------------|------------|----------------|
| React    | Node.js + Express | PostgreSQL | Docker, Heroku |

---

## 📸 Screenshots

| Main Dashboard |
|----------------|

---

## ⚙️ Getting Started (Local Dev)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/taskhive.git
cd taskhive
```

---

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### 3. Set Up Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgres://your_username:your_password@your_host:5432/your_db_name
SECRET_KEY=your_secret_key_here
NODE_ENV=development
FRONTEND_URL=https://your-frontend-url.com

```

---

### 4. Set Up PostgreSQL

Ensure PostgreSQL is running, then create the DB and tables:

```bash
# Access psql
psql postgres

# Inside psql shell:
CREATE DATABASE taskhive;
\c taskhive

-- You can run your schema setup manually or use the backend's schema initializer if provided
```

---

### 5. Run Locally

```bash
# Backend
cd backend
npm start

# Frontend (in separate terminal)
cd frontend
npm run dev
```

Then open: [http://localhost:5173](http://localhost:5173)

---

## ☁️ Deployment

### 🔷 Deploy on Heroku

1. Provision PostgreSQL (e.g., `heroku addons:create heroku-postgresql`)
2. Add a `Procfile` to the root of your backend (if missing):
   ```
   web: node server.js
   ```
3. Set your environment variables on Heroku:
   ```bash
   heroku config:set SESSION_SECRET=your_secret
   heroku config:set CLIENT_ORIGIN=https://yourdomain.com
   ```
4. Push to Heroku:
   ```bash
   git push heroku main
   ```

---

### 🌐 Add a Custom Domain (Optional)

1. Buy a domain from [Namecheap](https://namecheap.com) or [Porkbun](https://porkbun.com)
2. Point the domain to Heroku via CNAME
3. Add it to Heroku:
   ```bash
   heroku domains:add yourdomain.com
   ```
4. Set HTTPS with Cloudflare or enable automatic SSL from Heroku

---

## 📌 Notes for Authentication

- Cookies are used for session-based auth
- Works best when frontend and backend share the same domain
- Always use `Secure` cookies + `SameSite=Lax` or `None` (if cross-site)

---

## ✨ Future Plans

- 📅 Timeline / calendar view
- 🧠 ML-based task scoring
- 🔄 Drag-and-drop reordering
- ✅ Checklists within tasks
- 📊 Team assignment and progress tracking

---

## 🧑 Author

Created by [Your Name](https://github.com/yourusername) – feel free to reach out!

---

## 🪲 Issues / Contributions

Found a bug or want to contribute? [Open an issue](https://github.com/yourusername/taskhive/issues) or submit a PR!
