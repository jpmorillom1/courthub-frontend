# 🏟️ CourtHub Frontend

<div align="center">
  <!-- PROJECT LOGO -->
  <a href="https://github.com/jpmorillom1/courthub-frontend">
    <img src="https://aka-cdn.uce.edu.ec/ares/tmp/SIIU/anuncios/sello_400.png" alt="Logo" width="120" height="120">
  </a>

  <h3 align="center">CourtHub - Booking Management System</h3>

  <p align="center">
    Modern and interactive platform for booking and managing sports courts.
    <br />

  </p>
</div>

<!-- BADGES -->
<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white" alt="Zustand" />
  <img src="https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
</div>

<br />

## 📖 Table of Contents
- [About the Project](#about-the-project)
- [Technologies](#technologies)
- [Key Features](#key-features)
- [Demo & Wireframes](#demo--wireframes)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Contributing](#contributing)

---

## 🧐 About the Project

**CourtHub** is a web application designed to simplify the administration and booking of sports venues. It offers a seamless user experience for both administrators and clients, allowing real-time management of schedules, payments, and issues.

Built with the latest technologies in the React ecosystem, prioritizing performance, accessibility, and a modern interface.

> [!NOTE]
> **Backend Required:** This project is the **Frontend** of the application. For full functionality, it requires the **Backend** to be running. You can find the backend code in its official repository:
> 👉 [CourtHub Backend Repository](https://github.com/jpmorillom1/courthub-backend)

---

## 🛠 Technologies

The project uses a robust and modern stack:

- **Frontend Core**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Shadcn/UI](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Global), [TanStack Query](https://tanstack.com/query/latest) (Server state)
- **Realtime / Backend as a Service**: [Firebase](https://firebase.google.com/) (Realtime Database for instant schedule grid synchronization)
- **Forms**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) (Validation)
- **3D Visualization**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber), [Drei](https://github.com/pmndrs/drei)
- **Navigation**: [React Router DOM](https://reactrouter.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## ✨ Key Features

### 🔐 Authentication & Security
- Login and Registration (Email/Password).
- Route Protection (Guards).
- User Roles (Admin vs Client).

### 📅 Booking System & Realtime Grid
- **Real-Time Updates**: Uses **Firebase** to instantly reflect changes in court availability. If a user books a slot, the block appears immediately for everyone else without reloading the page.
- Interactive court selection flow.
- Payment integration (Payment Gateway).
- Cancellation and rescheduling.

### 📊 Admin Panel
- **Dashboard**: Key metrics and usage charts.
- **Master Schedule**: Complete view of all courts and schedules .
- **User Management**: List user profiles.
- **Reports**: Manage issues reported by users.

### 👤 User Area
- Booking history (`MyReservations`).
- Reservation details.
- Report issues/problems with courts.
- Profile settings and notifications.

---

## 🎥 Demo & Wireframes

Here you can see the application in action:

### ⚡ Booking Flow
<!-- Insert your Booking Process GIF here -->
<div align="center">
  ![Grabación de pantalla 2026-02-06 234340](https://github.com/user-attachments/assets/44f385d3-43ec-4917-89bb-525cf7539e03)

</div>

### 🔒 Realtime Slots Blocking
<!-- Insert your GIF showing instant slot blocking here -->
<div align="center">
  ![realtime](https://github.com/user-attachments/assets/62134279-08b3-4965-8ef3-bab26636e4c1)

</div>

### 🖥️ Admin Dashboard
<!-- Insert your Dashboard GIF here -->
<div align="center">
  ![dashboard](https://github.com/user-attachments/assets/f200f2e8-fc4c-40a9-bf85-5960f5c4ad2f)

</div>

---

## 📂 Project Structure

```bash
src/
├── 📂 assets/
├── 📂 components/
│   ├── 📂 admin/
│   ├── 📂 auth/
│   ├── 📂 booking/
│   ├── 📂 common/
│   ├── 📂 dashboard/
│   ├── 📂 layout/
│   ├── 📂 schedule/
│   └── 📂 ui/
├── 📂 context/
├── 📂 hooks/
├── 📂 lib/
├── 📂 services/
├── 📂 store/
└── App.jsx
```

---

## 🚀 Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn
* [CourtHub Backend](https://github.com/jpmorillom1/courthub-backend) (Must be running locally or in an accessible remote environment)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/jpmorillom1/courthub-frontend.git
   cd courthub-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the project root. Here is an example with all required variables (Adjust values according to your configuration):

   ```env
   # API Backend & Gateway
   VITE_API_URL=http://your-api-gateway-url.com

   # Firebase Configuration (Realtime DB & Auth)
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef1234
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
