# LinkHive

LinkHive is a web application that allows users to create, customize, and share public profiles with personalized links, backgrounds, and more. The project consists of a React frontend and a Node.js/Express backend.

## Features

- User authentication (register, login, protected routes)
- Customizable public profiles
- Background and theme selection
- Link management
- Responsive design

## Project Structure

```
LinkHive/
  ├── public/                # Static assets
  ├── src/                   # Frontend source code (React)
  │   ├── components/        # Reusable UI components
  │   ├── contexts/          # React context providers
  │   ├── pages/             # Page components
  │   └── Styles/            # CSS files
  ├── index.html             # Main HTML file
  ├── package.json           # Frontend dependencies
  └── vite.config.js         # Vite configuration

linkhive-backend/
  ├── routes/                # API route handlers
  ├── middleware/            # Express middleware
  ├── utils/                 # Utility functions
  ├── db.js                  # Database connection
  ├── server.js              # Express server entry point
  └── package.json           # Backend dependencies
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MohamedMishal77/LinkHive.git
   cd LinkHive
   ```

2. **Install frontend dependencies:**
   ```bash
   cd LinkHive
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd linkhive-backend
   npm install
   ```

4. **Set up environment variables:**
   - Copy `.env.example` to `.env` in `linkhive-backend/` and fill in the required values.

### Running the Application

#### Backend
```bash
cd linkhive-backend
npm start
```

#### Frontend
```bash
cd LinkHive
npm run dev
```

The frontend will typically run on [http://localhost:5173](http://localhost:5173) and the backend on [http://localhost:5000](http://localhost:5000).

## Deployment
- Configure environment variables on your deployment platform as needed.




## Author
[Mohamed Mishal](https://github.com/MohamedMishal77)
