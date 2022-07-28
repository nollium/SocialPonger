import { Logger, UseGuards, UseInterceptors, ValidationPipe, ValidationPipeOptions } from "@nestjs/common";
import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayInit,
	OnGatewayDisconnect,
	SubscribeMessage,
	ConnectedSocket,
	MessageBody,
	WsException,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { Socket } from "@src/types/socket";
import { SessionGuard } from "@guards/session.guard";
import { WebsocketSaveSession } from "@interceptors/websocket-save-session";
import { UserService } from "@services/user.service";
import { GameModeDTO } from "@dtos/GameModeDTO";
import { GameService } from "@src/services/game.service";

const exceptionOptions: ValidationPipeOptions = {
	exceptionFactory: (errors) => {
		return new WsException(errors.flatMap((err) => Object.values(err.constraints)).join(", "));
	},
};

@WebSocketGateway({
	namespace: "game",
	cors: {
		origin: "*",
	},
})
@UseInterceptors(WebsocketSaveSession)
@UseGuards(...SessionGuard)
export class GameGateway implements OnGatewayInit, OnGatewayDisconnect {
	// WS server
	@WebSocketServer() server: Server;

	private logger: Logger = new Logger("GameGateway");

	constructor(private readonly gameService: GameService, private readonly userService: UserService) {}

	afterInit(server: Server) {
		void server;
		this.logger.log("Gateway initialized.");
	}

	// Log the connection
	handleConnection(client: Socket) {
		this.logger.log(`Client connected: ${client.id}`);
		client.emit("Welcome", "my friend");
	}

	// Remove client from the pool it's in
	handleDisconnect(client: Socket) {
		// Debug log
		this.logger.log(`Client disconnected: ${client.id}`);

		// Ensure client is authenticated and registered as connected.
		if (client.session && client.session.user) this.gameService.disconnectClient(client);
	}

	// Initialize client session, or throws 401 when unauthenticated
	@SubscribeMessage("authenticate")
	async authenticate(@ConnectedSocket() client: Socket) {
		// Get user from DB
		client.session.user = await this.userService.findOne(client.session.sessionUser.id);

		// Get user ID
		const userID = client.session.user.id;

		this.gameService.connectClient(client, userID);

		// Tell the client they're authenticated
		client.emit("authenticate", { status: "success", user: client.session.user });
	}

	// Add the client to the matchmaking pool (= searching for a game)
	@SubscribeMessage("matchmaking:searchGame")
	addUserToMatchmakingPool(
		@ConnectedSocket() client: Socket,
		@MessageBody("", new ValidationPipe(exceptionOptions)) gameMode: GameModeDTO,
	): void {
		this.gameService.addUserToMatchmakingPool(client.session.user.id, gameMode.mode);
	}

	@SubscribeMessage("matchmaking:cancelSearchGame")
	removeUserFromMatchmakingPool(@ConnectedSocket() client: Socket): void {
		this.gameService.removeUserFromMatchmakingPool(client.session.user.id);
	}

	@SubscribeMessage("matchmaking:matchBot")
	matchUserToBot(
		@ConnectedSocket() client: Socket,
		@MessageBody("", new ValidationPipe(exceptionOptions)) gameMode: GameModeDTO,
	) {
		void this.gameService.matchUserToBot(client.session.user.id, gameMode.mode);
	}
}