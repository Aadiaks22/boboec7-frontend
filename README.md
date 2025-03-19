# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

📌 Overview
This project is a Student Management System built using the MERN (MongoDB, Express.js, React, Node.js) stack with TypeScript. It features an Admin Dashboard that streamlines student registration, fee receipt generation, and invoice management while ensuring security, scalability, and performance.

✨ Features
🔹 Admin Dashboard: Secure and intuitive dashboard to manage students and financial records.
🔹 Student Registration: Admins can register students with relevant details.
🔹 Fee Collection & Receipts: Automated fee receipt generation and invoice tracking.
🔹 User Roles & Authentication: Secure authentication for admins and users.
🔹 CRUD Operations: Easily manage student records (Create, Read, Update, Delete).
🔹 Real-time Data Updates: Instant updates using React Query and Axios.
🔹 Role-based Access Control: Restricts unauthorized actions based on user roles.
🔹 Scalable & Secure Architecture: Uses TypeScript, JWT authentication, and hashed passwords.

🛠 Tech Stack
1. Frontend (React + TypeScript)
2. React.js (with TypeScript for type safety)
3. React Query (for efficient data fetching)
4. Tailwind CSS (for responsive UI)
5. React Router (for navigation)

Backend (Node.js + Express.js)
1. Express.js (with TypeScript)
2. MongoDB + Mongoose (database & schema management)
3. JWT Authentication (secure login system)
4. Bcrypt.js (password hashing)
5. Multer (for file uploads if needed)

Database
1. MongoDB (NoSQL database)
2. Mongoose (ODM for MongoDB)


Deployment
Frontend: Netlify
Backend: Render
Database: MongoDB Atlas

🔐 Authentication & Security
1. JWT-based authentication for securing API routes.
2. Password hashing using bcrypt.js.
3. Role-based access control to prevent unauthorized actions.

📜 License
All Rights Reserved. This software is proprietary and may not be used, copied, modified, or distributed without explicit permission from the owner.

🙌 Acknowledgments
MERN Stack Community
TypeScript Documentation
MongoDB Atlas for database hosting 
Netlify for Frontend Hosting
Render For Backend Hosting


## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```


