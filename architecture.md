# System Architecture - Car Rental Platform

This document outlines the high-level architecture, technology stack, and directory structure of the Car Rental Platform application.

---

## 1. Overview
The Car Rental Platform is a **Single-Page Application (SPA)** built with **React** and **Vite**. It operates on a **Serverless / Backend-as-a-Service (BaaS)** model leveraging **Firebase** for Authentication, Cloud Firestore Database, and Cloud Storage for assets.

The architecture is characterized by **direct client-to-database communication**, with security and data validation managed via Firebase Rules rather than a custom middleware server.

---

## 2. Technology Stack

### Frontend Core
*   **Framework**: [React 19](https://react.dev/) - Component-based UI library.
*   **Build Tool**: [Vite](https://vite.dev/) - Next-generation frontend tooling.
*   **Routing**: [React Router 7](https://reactrouter.com/) - Declarative routing for React.
*   **Styling**: [TailwindCSS 4](https://tailwindcss.com/) - Utility-first CSS framework.

### Backend-as-a-Service (Firebase)
*   **Authentication**: Firebase Auth (User setup & session management).
*   **Database**: Cloud Firestore (NoSQL Document Database).
*   **Asset Storage**: Cloud Storage (Vehicle management, photos).

### Utilities & UI Dependencies
*   **Icons**: `lucide-react`
*   **Notifications**: `react-hot-toast`

---

## 3. Core Architecture & Data Flow

### Presentation Layer
The UI is divided into:
1.  **Pages (`src/pages/`)**: Full-screen components representing routes. They typically manage their own local state and fetch data directly from Firebase using the layout context.
2.  **Components (`src/components/`)**: Reusable UI elements like Navigation Bars, Cards, Forms, etc.

### State Management
*   **Global State**: Managed via React Context API.
*   **`AuthContext.jsx`**: Provides authentication state (currently logged-in user, roles) to the entire application using an `AuthProvider` that wraps `App.jsx`.

### Data Access Flow
Data flows directly from the React pages to Firebase services.

```mermaid
graph TD
    User([User In Browser]) --> Pages[React Pages / Components]
    Pages --> AuthContext[AuthContext (State)]
    Pages --> Firebase[Firebase SDK]
    AuthContext --> Firebase
    Firebase --> Firestore[(Cloud Firestore)]
    Firebase --> Storage[(Cloud Storage)]
    Firebase --> Auth[(Firebase Auth)]
```

---

## 4. Directory Structure (`src/`)

An annotated view of the main codebase directory:

```text
src/
├── components/          # Reusable UI components
│   └── Navbar.jsx       # Global Navigation Header
├── context/             # Global Context providers
│   └── AuthContext.jsx  # Handles user auth state & session
├── pages/               # Route views grouped by actor role
│   ├── Home.jsx         # Landing page with featured vehicles
│   ├── SignUp.jsx       # Registration
│   ├── SignIn.jsx       # Login
|   |...
├── firebase.js          # Initialization of Firebase Services (db, auth, storage)
├── App.jsx              # Main router & page routes definition
├── main.jsx             # Entry point loading App.jsx into DOM
└── index.css            # Main stylesheet import including Tailwind setup
```

---

## 5. Actor-Based Views Breakdown

The application serves three distinct user roles:

### A. Customer Views
*   **`Home.jsx`**: Displays search form and featured vehicles grid.
*   **`VehicleSearchResults.jsx`**: Dynamic listing with filtration.
*   **`VehicleDetailPage.jsx`**: Full technical specs and booking forms for a specific car.
*   **`BookingDetails.jsx`**: Breakdown of costs and reservation flow.
*   **`ReviewAndPayment.jsx`**: Confirmation details and processing.

### B. Vendor Views
*   **`VendorDashboard.jsx`**: Overview of active listings, status, and earnings.
*   **`VendorAddVehicle.jsx`**: Listing submission form for adding vehicle data to Firestore.
*   **`VendorBookings.jsx`**: Tracking active reservations belonging to the vendor's fleet.

### C. Admin Views
*   **`AdminDashboard.jsx`**: High-level system statistics (users, vendors, listings).
*   **`AdminVendorManagement.jsx`**: Managing lists of vendors, approval workflows.

---

## 6. Infrastructure & Configuration

*   **`.firebaserc` / `firebase.json`**: Configuration files detailing project ID and rules deployments.
*   **`storage.rules`**: Security rules specifying read/write permissions for bucket folders.
*   **`tailwind.config.js`**: Tailoring the styling dictionary (colors, fonts, layout breaks).
