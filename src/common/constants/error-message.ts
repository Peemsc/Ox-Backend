import { NotFoundException } from "@nestjs/common";

export const ERROR_MESSAGES = {
    GAME: {
      NOT_FOUND: 'Game not found',
      ALREADY_FINISHED: 'Game is already finished',
      INVALID_MOVE: 'Invalid move: Position already taken or out of bounds',
      NOT_YOUR_TURN: 'Not your turn to move',
    },
    AUTH: {
      UNAUTHORIZED: 'Unauthorized access',
      INVALID_TOKEN: 'Invalid or expired token',
    },
    USER: {
      NOT_FOUND: 'User not found',
    },
  };
  
  throw new NotFoundException(ERROR_MESSAGES.GAME.NOT_FOUND);