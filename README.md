# OX Game Backend

A NestJS backend for a Tic-tac-toe game with Google OAuth authentication.

## Features
- Google OAuth 2.0 Authentication
- JWT-based session management
- Game logic with AI opponent
- Score tracking system
- Game history
- Leaderboard

## Tech Stack
- NestJS
- PostgreSQL with Sequelize
- TypeScript
- Passport.js for authentication
- Jest for testing

## Prerequisites
- Node.js v16 or higher
- PostgreSQL
- Google OAuth credentials

## Installation
```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Fill in the required environment variables

# Run migrations
pnpm run migration:run

# Start development server
pnpm run start:dev
```

## API Documentation
Visit http://localhost:3000/api for Swagger documentation

## Testing
```bash
# Unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## Project Structure
```
src/
├── auth/           # Authentication module
├── game/           # Game logic and endpoints
├── user/           # User management
├── common/         # Shared resources
└── config/         # Configuration
```

## Contributing
[Contribution guidelines]

## License
[License information]