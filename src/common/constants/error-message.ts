import { NotFoundException } from "@nestjs/common";

export const ERROR_MESSAGES = {
    GAME: {
      NOT_FOUND: 'Game not found',
      INVALID_MOVE: 'Invalid move position',
      GAME_OVER: 'Game is already finished',
      NOT_YOUR_TURN: 'Not your turn',
      POSITION_TAKEN: 'Position already taken',
    },
    AUTH: {
      INVALID_TOKEN: 'Invalid or expired token',
      LOGIN_REQUIRED: 'Please login to continue',
      UNAUTHORIZED: 'Unauthorized access',
    },
    USER: {
      NOT_FOUND: 'User not found',
      INVALID_DATA: 'Invalid user data',
    },
  };
  
  throw new NotFoundException(ERROR_MESSAGES.GAME.NOT_FOUND);