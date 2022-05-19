import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "@src/controllers/app.controller";
import { Game } from "@src/entities/game.entity";
import { GameService } from "@services/game.service";
import { UserService } from "@services/user.service";
import { User } from "@entities/user.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Game, User])],
	providers: [GameService, UserService],
	controllers: [AppController],
	exports: [GameService, UserService],
})
export class GameModule {}
