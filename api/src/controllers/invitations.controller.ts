import { Controller, Delete, Get, Param, UseGuards, UseInterceptors } from "@nestjs/common";
import { SessionGuard } from "@guards/session.guard";
import { ChanConnectionService } from "@services/chan_connection.service";
import { CrudFilterInterceptor } from "@interceptors/crud-filter.interceptor";

@Controller("users")
@UseGuards(...SessionGuard)
@UseInterceptors(CrudFilterInterceptor)
export class InvitationsController {
	constructor(private chanConnectionService: ChanConnectionService) {}

	/**
	 * get all chan connections
	 */
	@Get()
	getAll(): Promise<object> {
		return this.chanConnectionService.findAll();
	}

	/**
	 * get the ChanConection designated by id
	 * @param id the ChanConnection id
	 */
	@Get(":id")
	getOne(@Param("id") id: string): Promise<object> {
		return this.chanConnectionService.findOne(id);
	}

	/**
	 * delete the chanConnection designated by id
	 * @param id the ChanConnection id
	 */
	@Delete(":id")
	removeInvitation(@Param("id") id: string): Promise<void> {
		return this.chanConnectionService.remove(id); // TODO: protect
	}
}
