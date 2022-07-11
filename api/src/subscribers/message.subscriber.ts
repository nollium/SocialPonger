import { Injectable } from "@nestjs/common";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent, Connection } from "typeorm";
import { Message } from "@entities/message.entity";
import { Channel } from "@entities/channel.entity";
import { SocketService } from "@services/socket.service";

@EventSubscriber()
@Injectable()
export class MessageSubscriber implements EntitySubscriberInterface<Message> {
	constructor(private readonly connection: Connection, private socketService: SocketService) {
		this.connection.subscribers.push(this);
		void this.socketService;
	}

	listenTo() {
		return Message;
	}

	afterInsert(event: InsertEvent<Message>) {
		this.socketService.sendMessage("MSG", event.entity, (event.entity.channel as Channel).name);
	}
}
