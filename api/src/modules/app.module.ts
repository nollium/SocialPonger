import { AppController } from "@controllers/app.controller";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@entities/user.entity";
import { UserModule } from "@modules/user.module";
import { Relation } from "@entities/relation.entity";
import { RelationModule } from "@modules/relation.module";
import { GameModule } from "@modules/game.module";
import { Game } from "@entities/game.entity";
import { Channel } from "@entities/channel.entity";
import { ChannelModule } from "@modules/channel.module";
import { Message } from "@entities/message.entity";
import { MessageModule } from "@modules/message.module";
import { ChanConnection } from "@entities/chan_connection.entity";
import { ChanConnectionModule } from "@modules/chan_connection.module";
import { ChanInvitation } from "@entities/chan_invitation.entity";
import { ChanInvitationModule } from "@modules/chan_invitation.module";

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: "postgres",
			host: "db",
			port: 5432,
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			entities: [User, Relation, Game, Channel, Message, ChanConnection, ChanInvitation],
			synchronize: true,
		}),
		UserModule,
		RelationModule,
		GameModule,
		ChannelModule,
		MessageModule,
		ChanConnectionModule,
		ChanInvitationModule,
	],
	controllers: [AppController],
})
export class AppModule {}
