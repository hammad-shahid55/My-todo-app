# My Notes

A modern, full-stack todo/notes application built with React, TypeScript, and Supabase. This app allows users to manage their tasks with features like authentication, real-time updates, and a responsive design optimized for both web and mobile platforms.

## Features

- **User Authentication**: Secure sign-in and sign-up using Supabase Auth.
- **Task Management**: Add, edit, delete, and mark todos as complete.
- **Filtering**: View all, active, or completed tasks with easy-to-use tabs.
- **Real-time Updates**: Changes sync instantly across devices using Supabase's real-time database.
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices.
- **Mobile App**: Built with Capacitor for native mobile deployment on iOS and Android.
- **Modern UI**: Styled with Tailwind CSS and ShadCN/UI components for a sleek, gradient-based interface.

## Tech Stack

- **Frontend**:
  - React 18 with TypeScript
  - Vite for fast development and building
  - React Router for navigation
  - TanStack React Query for data fetching
  - Tailwind CSS for styling
  - ShadCN/UI for pre-built components
  - Lucide React for icons

- **Backend**:
  - Supabase for authentication, database, and real-time features

- **Mobile**:
  - Capacitor for hybrid mobile app development

- **Development Tools**:
  - ESLint for code linting
  - TypeScript for type safety

## Installation

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd speedy-rn-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env` file in the root directory.
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Set up Supabase**:
   - Create a new project on [Supabase](https://supabase.com).
   - Go to Settings > API and copy the URL and anon key.
   - Run migrations or set up the `todos` table in your Supabase database (refer to `supabase/migrations/` for schema).

5. **Start the development server**:
   ```bash
   npm run dev
   ```
   - Open [http://localhost:8080](http://localhost:8080) in your browser.

## Usage

1. **Authentication**:
   - Navigate to `/auth` to sign up or sign in.
   - Once authenticated, you'll be redirected to the main dashboard.

2. **Managing Todos**:
   - Use the input field to add new todos.
   - Click on a todo to mark it as complete or edit it.
   - Use the filter tabs (All, Active, Done) to organize your view.
   - Sign out using the logout button in the header.

3. **Mobile App**:
   - Build and deploy as a mobile app using Capacitor:
     ```bash
     npm run build
     npx cap add ios  # or android
     npx cap sync
     npx cap open ios  # or android
     ```

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run build:dev`: Build in development mode.
- `npm run lint`: Run ESLint to check code quality.
- `npm run preview`: Preview the built app.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Make your changes and commit: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

Please ensure your code adheres to the project's linting rules and includes tests where applicable.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons from [Lucide React](https://lucide.dev).
- UI components from [ShadCN/UI](https://ui.shadcn.com).
