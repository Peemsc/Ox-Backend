export class UserResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  score: number;
  consecutiveWins: number;
}