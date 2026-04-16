# Solvix — University Complaint Tracker

![Solvix Logo Placeholder](https://via.placeholder.com/150x50/4361ee/ffffff?text=Solvix)

Solvix is a streamlined, full-stack central complaint tracking system designed specifically for universities and educational institutions. It provides a robust interface to intercept, categorize, prioritize, and manage administrative, infrastructural, and technological friction points experienced by students organically on campus.

---

## 🎯 The Need
Large-scale universities accommodate thousands of students. When friction occurs—be it a broken library air conditioner, spotty dormitory Wi-Fi, or cafeteria food quality issues—students heavily rely on outdated channels (like physical registry books or unorganized email chains) to complain. This creates massive inefficiencies:
* Issues get lost in communication.
* Administrators cannot adequately prioritize emergency issues.
* Students face zero transparency regarding the resolution status of their complaints.

**Solvix solves this.**

## 💡 Key Use Cases

### 1. Student Submission & Tracking
Students can launch Solvix to anonymously or authenticated-ly complain about on-campus issues. They input a title, a detailed description, select predetermined categories (Facilities, Food Services, Technology, etc.), and assign a priority level. Students can monitor the lifetime status of their ticket (*Pending*, *In Progress*, *Resolved*).

### 2. Administrative Dashboard Overview
Campus technicians and administrative members get a birds-eye perspective of the campus's health. The dashboard calculates dynamic statistics, isolates high-priority tickets, and provides filters to slice unhandled problems by state.

### 3. Immediate Actioning
By digitizing and formatting the data, Solvix makes the pipeline from an issue's discovery to a technician resolving it friction-free.

---

## ⚙️ Architecture & Technical Aspects

Solvix embraces a **Zero-Bloat Full-Stack Architecture** utilizing standard lightweight JavaScript technologies without the overhead of heavy frameworks like React or Next.js, making it insanely fast and easy to deploy.

### Frontend
* **Vanilla HTML5 & CSS3**: Powered directly via standard browser capabilities. Features an exceptionally rich, modern, glass-morphism desktop-first aesthetic.
* **Vanilla JavaScript (ES6+)**: `app.js` runs state-management, modal popups, data rendering, search debouncing, and REST API fetch executions flawlessly.
* **Mobile Responsiveness**: Highly optimized CSS media queries mathematically ensure the sidebar collapses, grid stat cards wrap seamlessly, and modals remain perfectly padded on arbitrary small-screen devices (down to 480px).

### Backend
* **Node.js & Express.js**: Handles lightweight serving. Acts primarily as an API router connecting frontend state requests to the respective database interactions.
* **Stateless API Design**: The backend exposes clean REST endpoints:
  * `POST /api/auth/login` - Handshakes user credentials.
  * `GET /api/complaints` - Synchronizes the state list upon dashboard entry.
  * `POST /api/complaints` - Registers a new user-submitted complaint dynamically.
* **Data Layer**: Solvix currently routes to a localized, in-memory JSON array architecture specifically built for rapid demonstration and UI/UX testing. *(Can be seamlessly swapped out to PostgreSQL or MongoDB arrays by injecting a DB connection inside `server.js` route handlers).*

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v14.0 or above)
* Git

### Installation
1. Clone the repository: 
   ```bash
   git clone https://github.com/rennnss/Solvix.git
   ```
2. Navigate into the application root:
   ```bash
   cd Solvix
   ```
3. Install backend dependencies (Express, CORS, Body-Parser):
   ```bash
   npm install
   ```
4. Start the internal Web-Server!
   ```bash
   npm start
   ```
5. Navigate your browser to `http://localhost:3000`. You will be immediately greeted by the Solvix Login portal.
