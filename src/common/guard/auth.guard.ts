import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LogDataType } from 'types/global';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Allow non-HTTP contexts (e.g., RMQ, WebSocket) to pass through
    if (context.getType() !== 'http') {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const path = request.route.path.split('v1')[1];
    const token = request.headers['authorization']?.split(' ')[1];

    if (path === '/user/log-in') return true;
    if (path === '/organization' && !token) return true;
    if (path === '/city') return true;
    if (path === '/region') return true;
    if (path === '/organization/:id') return true;
    if (path === '/user') return true;
    if (path === '/user/verify-sms-code') return true;
    if (path === '/user/resend-sms-code') return true;
    if (path === '/organization/site') return true;
    if (path === '/user/site/log-in') return true;
    if (path === '/organization/site/search/:name') return true;
    if (path === '/geocode/search') return true;
    if (path === '/geocode/reverse') return true;
    if (path === '/bisiness-statistics') return true;
    if (path === '/user/update-sms-code') return true;
    // if (path === '/bisiness-statistics/one') return true;
    console.log(request.route.path, 'PATH');

    if (!token) {
      throw new ForbiddenException('No token provided');
    }

    const decoded = this.jwtService.verify(token); /*as {
      roleId: number;
      userId: number;
      exp?: number;
      organizationId?: number;
    };*/

    const rolePermissions = await this.userService.checkPermission({
      userId: decoded.userId,
      roleId: decoded.roleId,
      method,
      path,
    });

    if (!rolePermissions) {
      throw new ForbiddenException('Access denied');
    }

    const user = await this.userService.getById({ id: decoded.userId });

    const userData: LogDataType = {
      user: {
        id: user?.id,
        numericId: user?.numericId,
        fullName: user?.fullName,
        role: user.role.name,
      },
      organizationId: decoded?.organizationId,
      path,
      method,
    };
    request.userData = userData; //userdata

    request.body.userData = userData;

    return true;
  }
}
