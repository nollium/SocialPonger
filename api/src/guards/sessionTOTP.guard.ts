import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "@services/auth.service";
import { Request } from "@src/types/request";
import { WsException } from "@nestjs/websockets";
import { Socket } from "@src/types/socket";

/**
 * Allows access to the guarded route if the session is validated by TOTP
 */
@Injectable()
export class SessionGuardTOTP implements CanActivate {
	constructor(private authService: AuthService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		switch (context.getType()) {
			case "http": {
				// Nest js manipulation to access the underlying express request object
				const req: Request = context.switchToHttp().getRequest();
				// Allow access if the session is TOTP validated
				if (this.authService.isTOTPLogged(req.session)) {
					// Put the user object in the session
					req.user = req.session.user;
					// Allow access
					return true;
				}
				// Throw an HTTP 401 error
				throw new UnauthorizedException({
					statusCode: 401,
					error: "Unauthorized",
					reason: "not authenticated",
					authMethod: "TOTP",
				});
			}
			case "ws": {
				await this.authService.wsLoadSession(context);
				const socket: Socket = context.switchToWs().getClient<Socket>();
				if (socket.session && this.authService.isTOTPLogged(socket.session)) {
					return true;
				}
				throw new WsException({
					error: "Unauthorized",
					reason: "not authenticated",
					authMethod: "TOTP",
				});
			}
			default:
				throw new Error(`Fatal: executionContext type ${context.getType()} is not supported`);
		}
	}
}
