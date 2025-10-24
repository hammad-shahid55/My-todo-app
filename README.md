# My Notes App

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20Web-lightgrey.svg)

A modern, full-stack notes application built with React, TypeScript, and Supabase. Seamlessly manage your notes across web and mobile platforms with real-time synchronization, beautiful dark/light themes, and an intuitive user interface.

[Features](#features) • [Tech Stack](#tech-stack) • [Installation](#installation) • [Usage](#usage) • [Building](#building-for-production)

</div>

---

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication** - Email/password authentication powered by Supabase Auth
- 📝 **Rich Note Management** - Create, edit, delete, and organize notes with titles and detailed content
- ✅ **Task Completion** - Mark notes as complete with visual indicators
- 🔍 **Smart Filtering** - Filter notes by All, Active, or Completed status
- 👥 **Admin Dashboard** - Special admin role to view all users' notes (optional)

### User Experience
- 🌓 **Dark/Light Theme** - Toggle between beautiful dark and light modes with system preference support
- 📱 **Mobile-First Design** - Fully responsive interface optimized for all screen sizes
- ⚡ **Real-time Sync** - Instant synchronization across all devices using Supabase real-time subscriptions
- 🎨 **Modern UI** - Sleek gradient-based design with smooth animations and transitions
- 🚀 **Native Mobile App** - Android APK with native performance via Capacitor

### Technical Features
- 💾 **Persistent Storage** - Cloud-based storage with automatic backups
- 🔄 **Offline Support** - LocalStorage integration for seamless offline experience
- 🎯 **Type Safety** - Full TypeScript implementation for robust code
- 🧩 **Component Library** - Built with ShadCN/UI for consistent, accessible components

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks and modern features |
| **TypeScript** | Type-safe JavaScript for better DX |
| **Vite** | Lightning-fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **ShadCN/UI** | High-quality, accessible component library |
| **React Router** | Client-side routing |
| **TanStack Query** | Powerful data fetching and caching |
| **Next Themes** | Dark/light mode management |
| **Lucide React** | Beautiful, consistent icon set |

### Backend
| Technology | Purpose |
|------------|---------|
| **Supabase** | PostgreSQL database with real-time capabilities |
| **Supabase Auth** | User authentication and authorization |
| **Supabase Functions** | Serverless edge functions for admin roles |

### Mobile
| Technology | Purpose |
|------------|---------|
| **Capacitor 7** | Native mobile app wrapper |
| **Android SDK** | Android platform support |

### Development Tools
| Tool | Purpose |
|------|---------|
| **ESLint** | Code quality and consistency |
| **TypeScript ESLint** | TypeScript-specific linting rules |
| **Git** | Version control |

## 📦 Installation

### Prerequisites

Ensure you have the following installed on your system:

| Requirement | Version | Purpose |
|-------------|---------|---------|
| **Node.js** | 16+ | JavaScript runtime |
| **npm** | 8+ | Package manager |
| **JDK** | 17 | Java Development Kit (for Android) |
| **Android Studio** | Latest | Android development (optional) |
| **Android SDK** | API 33+ | Android platform tools (optional) |

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-notes-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_PROJECT_ID="your_project_id"
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_key"
   ```

4. **Set up Supabase**
   
   - Create a new project at [supabase.com](https://supabase.com)
   - Navigate to **Settings → API** to get your credentials
   - Run the database migrations:
     ```bash
     # Migrations are located in supabase/migrations/
     # Apply them through Supabase Dashboard or CLI
     ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:8080](http://localhost:8080) in your browser 🚀

## 🚀 Usage

### Web Application

1. **Authentication**
   - Navigate to `/auth` to create an account or sign in
   - Admin accounts can be created using the special credential: `246810`
   - After authentication, you'll be redirected to your notes dashboard

2. **Managing Notes**
   - Click **"Add a new note..."** to create a note
   - Enter a title and optional detailed content
   - Mark notes as complete by clicking the checkbox
   - Delete notes using the trash icon (appears on hover)
   - Expand/collapse note details with the chevron button

3. **Filtering & Organization**
   - **All** - View all your notes
   - **Active** - Show only incomplete notes
   - **Done** - Show only completed notes

4. **Theme Switching**
   - Click the sun/moon icon in the header to toggle dark/light mode
   - Theme preference is saved automatically

5. **Admin Features** (Admin accounts only)
   - View all users' notes across the platform
   - Notes display with user email and name
   - Read-only access (cannot edit other users' notes)

## 📱 Building for Production

### Web Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Android APK

#### Development Build
```bash
# 1. Build the web app
npm run build

# 2. Sync web assets to Android
npx cap sync android

# 3. Build debug APK
cd android
./gradlew assembleDebug

# 4. Install on connected device
adb install app/build/outputs/apk/debug/app-debug.apk
```

#### Release Build (Signed)
```bash
# 1. Build the web app
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Build signed release APK
cd android
./gradlew assembleRelease

# 4. Install on device
adb install -r app/build/outputs/apk/release/app-release.apk
```

**Release APK Location:** `android/app/build/outputs/apk/release/app-release.apk`

**Signing Configuration:**
- Keystore: `android/app/my-notes-release-key.keystore`
- Alias: `my-notes-key`
- Password: `mynotes123` (⚠️ Change in production!)

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 8080 |
| `npm run build` | Build optimized production bundle |
| `npm run build:dev` | Build in development mode |
| `npm run lint` | Run ESLint code quality checks |
| `npm run preview` | Preview production build locally |

## 🏗️ Project Structure

```
my-notes-app/
├── android/                    # Android native project
│   ├── app/
│   │   ├── build.gradle       # App-level Gradle config
│   │   └── src/               # Android source files
│   └── build.gradle           # Project-level Gradle config
├── public/                     # Static assets
├── src/
│   ├── components/            # React components
│   │   ├── ui/               # ShadCN UI components
│   │   ├── AddTodo.tsx       # Note creation component
│   │   ├── TodoItem.tsx      # Note display component
│   │   └── ThemeToggle.tsx   # Theme switcher
│   ├── integrations/
│   │   └── supabase/         # Supabase client & types
│   ├── pages/
│   │   ├── Index.tsx         # Main notes dashboard
│   │   ├── Auth.tsx          # Authentication page
│   │   └── NotFound.tsx      # 404 page
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles & theme
├── supabase/
│   ├── config.toml           # Supabase configuration
│   └── migrations/           # Database migrations
├── .env                       # Environment variables (gitignored)
├── capacitor.config.ts       # Capacitor configuration
├── package.json              # Dependencies & scripts
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite build configuration
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/your-username/my-notes-app.git
   cd my-notes-app
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Run `npm run lint` to check for issues
   - Test your changes thoroughly

4. **Commit Your Changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
   
   Use conventional commits:
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation changes
   - `style:` - Code style changes
   - `refactor:` - Code refactoring
   - `test:` - Test additions/changes
   - `chore:` - Build process or auxiliary tool changes

5. **Push & Create Pull Request**
   ```bash
   git push origin feature/amazing-feature
   ```

### Code Guidelines

- ✅ Use TypeScript for type safety
- ✅ Follow React best practices and hooks patterns
- ✅ Keep components small and focused
- ✅ Write meaningful commit messages
- ✅ Update documentation for new features

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Supabase](https://supabase.com)** - Backend infrastructure and real-time database
- **[ShadCN/UI](https://ui.shadcn.com)** - Beautiful, accessible component library
- **[Lucide React](https://lucide.dev)** - Consistent, customizable icon set
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Capacitor](https://capacitorjs.com)** - Native mobile app framework

## 📞 Support

For issues, questions, or suggestions:

- 🐛 **Bug Reports**: Open an issue on GitHub
- 💡 **Feature Requests**: Start a discussion
- 📧 **Contact**: [Your contact information]

---

<div align="center">

**Built with using React, TypeScript, and Supabase**

⭐ Star this repo if you find it helpful!

</div>
