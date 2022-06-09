import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "@src/controllers/app.controller";
import { User } from "@entities/user.entity";
import { UserService } from "@services/user.service";
import { UserExistsRule } from "@src/validators/userExist.validator";
import { UsersController } from "@controllers/users.controller";
import { GameModule } from "@modules/game.module";
import { ChanConnectionModule } from "@modules/chan_connection.module";
import { RelationModule } from "@modules/relation.module";
import { MessageModule } from "@modules/message.module";
import { AuthModule } from "./auth.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		AuthModule,
		GameModule,
		ChanConnectionModule,
		RelationModule,
		MessageModule,
	],
	providers: [UserService, UserExistsRule],
	controllers: [AppController, UsersController],
	exports: [UserService],
})
export class UserModule {}