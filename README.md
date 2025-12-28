# ProjectPulse – Client Feedback & Project Health Tracker

ProjectPulse is a centralized project governance system designed for software teams. It enables transparent communication between Clients, Employees, and Admins while automatically monitoring project health using real-time data and logic-based health scoring.

## 🚀 Live Demo & Repository
- **Live URL:** [https://projectpulse-ebon.vercel.app/](https://projectpulse-ebon.vercel.app/)
- **GitHub Repository:** [https://github.com/SohanurRahman007/projectpulse](https://github.com/SohanurRahman007/projectpulse)

---

## 🛠 Tech Stack
- **Frontend:** Next.js 15 (App Router), Tailwind CSS, Lucide React
- **Backend:** Next.js API Routes (Option B - Serverless Backend)
- **Database:** MongoDB Atlas
- **Authentication:** JWT-based Authentication with Role-Based Access Control (RBAC)
- **Deployment:** Vercel (Frontend & Backend), MongoDB Atlas (Database)

---

## 🔑 Demo Login Credentials
To test the system, please use the following credentials for different roles:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@projectpulse.com` | `admin123` |
| **Employee** | `john@projectpulse.com` | `employee123` |
| **Client** | `sarah@clientco.com` | `client123` |

*Note: You can also use the "Seed Data" script button on the login page to reset demo accounts.*

---

## 📊 Project Health Score Logic
The Project Health Score (0–100) is calculated using a weighted algorithm to ensure objective monitoring:

$$Score = (Satisfaction \times 0.4) + (Confidence \times 0.3) + (TimelineProgress \times 0.2) - (OpenRisks \times 10)$$

### Component Weights:
1.  **Client Satisfaction (40%):** Derived from the latest weekly feedback ratings (1-5 scaled to 100).
2.  **Employee Confidence (30%):** Derived from employee check-ins regarding blockers and progress (1-5 scaled to 100).
3.  **Timeline Progress (20%):** Calculated by comparing elapsed time against the project duration.
4.  **Issue/Risk Penalty (10%):** Each open high-severity risk or "Flagged Issue" deducts 10 points.

### Interpretation:
- **80–100:** 🟢 **On Track** (Healthy progress)
- **60–79:** 🟠 **At Risk** (Requires monitoring)
- **Below 60:** 🔴 **Critical** (Needs immediate admin intervention)



---

## 🌟 Key Features
- **Admin Dashboard:** Centralized view of project statuses, health distribution, and overall risk analytics.
- **Weekly Check-in System:** Structured reporting for employees to submit progress and blockers.
- **Client Feedback Portal:** Dedicated view for clients to rate satisfaction and flag critical issues.
- **Risk Management:** Complete lifecycle tracking for technical and operational risks (Low/Medium/High).
- **Activity Timeline:** A chronological audit trail of every check-in, feedback, and status change.
- **Responsive UI:** Fully optimized for Mobile, Tablet, and Desktop.

---

## ⚙️ Environment Configuration
To run this project locally, create a `.env.local` file in the root directory and add the following:

```env
MONGODB_URI=mongodb+srv://projectpulse:fYwDxVSC6cLXk5bf@cluster0.qegylfx.mongodb.net/?appName=Cluster0
JWT_SECRET=9fA7xQ!2Lk@R8ZpM3WcD@E6N$H0bYJ
NEXTAUTH_URL=http://localhost:3000
