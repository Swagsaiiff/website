# Overview

This is a full-stack game top-up website built with React.js and Firebase. The application allows users to purchase gaming currencies (like Free Fire Diamonds and PUBG UC) through a digital wallet system. It features a comprehensive admin panel for managing orders and add money requests, along with user authentication supporting both email/password and Google Sign-In methods.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React.js with TypeScript
- **Routing**: Wouter for client-side navigation
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Context API for authentication and application state
- **Data Fetching**: TanStack React Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

## Backend Architecture  
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Firebase Authentication
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful API structure with `/api` prefix

## Authentication & Authorization
- **Primary Authentication**: Firebase Authentication
- **Methods Supported**: Email/password and Google OAuth
- **Role-based Access**: Admin role for `tahsan897@gmail.com`, regular users for others
- **Protected Routes**: Route-level protection with admin-only sections

## Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database serverless
- **ORM**: Drizzle ORM for type-safe database operations  
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Real-time Data**: Firebase Firestore for real-time features like order tracking

## Key Features Architecture
- **Wallet System**: Digital wallet with add money requests requiring admin approval
- **Order Management**: Complete order lifecycle with status tracking (pending, completed, cancelled)
- **Game Integration**: Support for Free Fire (Diamonds) and PUBG (UC) with configurable packages
- **Admin Dashboard**: Real-time statistics, order management, and user wallet administration

## Component Structure
- **Layout System**: Consistent layout with header, footer, and main content areas
- **UI Components**: Reusable shadcn/ui components with custom gaming theme
- **Protected Components**: Route-level and component-level access control
- **Modal System**: Dialog-based interactions for order placement and confirmations

# External Dependencies

## Firebase Services
- **Firebase Authentication**: User authentication and session management
- **Firebase Firestore**: Real-time database for orders, user data, and admin statistics
- **Firebase Configuration**: Pre-configured with project ID `gametopupplus`

## Database & ORM
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations and migrations
- **Drizzle Kit**: Database schema management and migration tools

## UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built accessible UI components
- **Radix UI**: Headless UI primitives for complex components
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds
- **React Dev Tools**: Development and debugging support

## Third-party Integrations
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Form handling and validation
- **Zod**: Runtime type validation and schema definition
- **Date-fns**: Date manipulation and formatting utilities