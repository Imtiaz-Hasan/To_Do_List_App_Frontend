# To-Do List Application

A modern task management application built with Next.js frontend and Laravel backend.

## Prerequisites

- Node.js (v19.0.0 or higher)
- npm or yarn package manager
- PHP 8.x
- Composer

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Frontend Tech Stack

- Next.js 15.2.4
- React 19
- Material-UI (MUI)
- TailwindCSS
- React DatePicker
- SweetAlert2 for notifications

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

4. Generate application key:
   ```bash
   php artisan key:generate
   ```

5. Run database migrations:
   ```bash
   php artisan migrate
   ```

6. Create a symbolic link for storage:
   ```bash
   php artisan storage:link
   ```

7. Start the development server:
   ```bash
   php artisan serve

The backend API will be available at [http://localhost:8000](http://localhost:8000).

## Production Build

To build the frontend for production:

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Features

- Task creation and management
- Task categorization
- Date scheduling
- Modern and responsive UI
- Real-time updates

## Development

- Frontend code can be modified in the `src` directory
- The application uses modern React features and hooks
- Styling is handled through a combination of TailwindCSS and Material-UI
- Backend API endpoints are defined in Laravel routes
