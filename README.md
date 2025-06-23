# Automated Social Media Posting Tool

A web application that allows users to create and automatically post content to multiple social media platforms simultaneously.

## Overview

This tool provides a simple web interface for creating social media posts with text and media content, then automatically distributes them across LinkedIn, X (Twitter), and Substack platforms.

## Features

- **Multi-platform posting**: Automatically post to LinkedIn, X, and Substack
- **Rich content support**:
  - Text input with formatting options
  - Image upload and attachment
  - Video upload and attachment
- **OAuth Authentication**: Secure authentication with social platform APIs
- **Error handling**: Proper error handling and success confirmation
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **API Integration**: Social platform APIs (LinkedIn, X, Substack)
- **Authentication**: OAuth 2.0

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## API Configuration

Before using the application, you'll need to configure API credentials for each social platform:

- **LinkedIn**: Set up OAuth 2.0 application and obtain client credentials
- **X (Twitter)**: Configure Twitter API v2 credentials
- **Substack**: Set up Substack API access

## Project Structure

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
├── assets/        # Static assets
└── styles/        # Additional styles
```

## Notes

This is a local development solution. For production deployment, additional configuration for hosting, environment variables, and security considerations would be required.
