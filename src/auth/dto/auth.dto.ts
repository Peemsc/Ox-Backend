export class UserFromGoogleDto {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}

export class UserResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

export class JwtPayloadDto {
  sub: number;
  email: string;
}

export class AuthResponseDto {
  user: UserResponseDto;
  accessToken: string;
}
