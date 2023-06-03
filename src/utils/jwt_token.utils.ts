import { JwtService } from '@nestjs/jwt';

export default class JwtToken {
  static async assignJwtToken(
    userId: string,
    jwtService: JwtService,
  ): Promise<string> {
    const payload = { id: userId };
    return jwtService.sign(payload);
  }
}
