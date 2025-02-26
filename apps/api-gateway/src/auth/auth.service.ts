import { PrismaService } from '@app/shared';
import { AuthEntity } from '@app/shared/entities/auth.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Authenticate a user
   * @param email: string
   * @param password: string
   * @returns AuthEntity
   */
  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({
      where: { username: email },
      include: { role: true },
    });

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const payload = {
          id: user.id,
          sub: user.id,
          username: user.username,
          roleId: user.roleId,
          role: user.role,
        };

        return {
          status: true,
          accessToken: await this.jwtService.signAsync(payload),
          user: payload,
        };
      }
    }

    return { status: false, error: 'Invalid Email or Password' };
  }
}
