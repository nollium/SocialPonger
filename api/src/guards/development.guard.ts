import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import config from "@config/api.config";
/**
 * enable a route only in development
 */
@Injectable()
export class DevelopmentGuard implements CanActivate {
	canActivate(_context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		return config.env === "development";
	}
}
