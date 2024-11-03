# OX Game Backend

Backend service for Tic-tac-toe game with user authentication and scoring system.

## Features
- Google OAuth 2.0 Authentication
- Game logic with AI opponent
- Score tracking system
- Game history
- RESTful API

## Tech Stack
- NestJS
- PostgreSQL
- Sequelize
- TypeScript

## Prerequisites
- Node.js v16+
- PostgreSQL
- Google OAuth credentials

## Installation
```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configurations

# Run database migrations
pnpm run migration:run

# Start development server
pnpm run start:dev
```

## API Documentation
After starting the server, visit http://localhost:3000/api for Swagger documentation.

### Main Endpoints
- POST /auth/google - Google OAuth login
- POST /game - Create new game
- POST /game/:id/move - Make a move
- GET /game/stats - Get game statistics
- GET /game/history - Get game history

## Running Tests
```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## Contributing
[Contributing guidelines]

## License
[License information]