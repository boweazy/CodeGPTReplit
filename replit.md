# SmartFlow AI - AI Content Generation Platform

## Overview

SmartFlow AI is a full-stack web application that provides AI-powered content generation capabilities. The platform allows users to create text content and images using advanced AI models like GPT-5 and DALL-E 3. Built with a modern React frontend and Express.js backend, the application features a sleek glassmorphism design with animated star fields and comprehensive content generation tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom CSS variables for theming and glassmorphism effects
- **UI Components**: Radix UI primitives with shadcn/ui component library for accessible, customizable components
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds
- **Design System**: Custom glassmorphism theme with animated backgrounds and golden accent colors

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful API with JSON request/response format
- **Validation**: Zod for runtime type checking and request validation
- **Development**: tsx for TypeScript execution and hot reloading
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Fallback Storage**: In-memory storage implementation for development/testing
- **Data Models**: Users table for authentication and content_generations table for storing AI-generated content with metadata

### Authentication and Authorization
- **Current State**: Basic user schema defined but authentication not fully implemented
- **Planned Features**: Username/password based authentication with password hashing
- **Session Management**: Designed to support session-based authentication
- **User Context**: Content generation can be associated with user accounts

### External Service Integrations
- **AI Text Generation**: OpenAI GPT-5 API for advanced text content creation
- **AI Image Generation**: OpenAI DALL-E 3 API for high-quality image generation
- **Content Customization**: Configurable parameters for tone, length, style, and content type
- **API Management**: Centralized service layer for AI API interactions with error handling

### Development and Deployment Features
- **Development Tools**: Replit integration with runtime error overlay and cartographer plugin
- **Code Quality**: ESLint and TypeScript for code consistency and type checking
- **Performance**: Optimized with path aliases, code splitting, and efficient bundling
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Accessibility**: Radix UI components ensure WCAG compliance and keyboard navigation

The architecture follows modern full-stack patterns with clear separation of concerns, type safety throughout the stack, and scalable design principles. The application is optimized for both development experience and production performance.