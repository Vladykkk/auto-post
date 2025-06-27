# Auto Post

A React-based web application for posting content to multiple social media platforms (LinkedIn, X/Twitter, and Substack) with a consistent, modern UI.

## Features

- **Multi-platform posting** - Post to LinkedIn, X, and Substack from one interface
- **Rich content support** - Text, images, videos, and platform-specific options
- **Consistent design** - Unified UI components across all forms
- **Real-time validation** - Character counting and form validation
- **Secure authentication** - OAuth integration for each platform

## Tech Stack

- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Vite** for build tooling
- **React Icons** for consistent iconography
- **Axios** for API requests

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── form/            # Form-specific components
│   ├── multi-platform/  # Multi-platform posting
│   └── settings/        # Platform connection settings
├── hooks/
│   ├── api/            # API-related hooks
│   ├── auth/           # Authentication hooks
│   ├── form/           # Form logic hooks
│   └── toast/          # Notification hooks
├── services/           # API services
├── types/              # TypeScript definitions
└── consts/             # Constants and configurations
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

---

_Built with modern React patterns and consistent design principles._
