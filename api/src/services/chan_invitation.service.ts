import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChanInvitation } from "@entities/chan_invitation.entity";

@Injectable()
export class ChanInvitationService {
	constructor(
		@InjectRepository(ChanInvitation)
		private ChanInvitationRepository: Repository<ChanInvitation>,
	) {}

	findAll(): Promise<ChanInvitation[]> {
		return this.ChanInvitationRepository.find();
	}

	findOne(id: number): Promise<ChanInvitation> {
		return this.ChanInvitationRepository.findOne({ where: { id } });
	}

	async remove(id: string): Promise<void> {
		await this.ChanInvitationRepository.delete(id);
	}

	async create(chaninvitation: ChanInvitation): Promise<ChanInvitation> {
		return this.ChanInvitationRepository.save(chaninvitation);
	}
}
