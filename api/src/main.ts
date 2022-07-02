import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "@modules/app.module";
import helmet from "helmet";
import morgan from "morgan";
import config from "@config/api.config";
import session, { MemoryStore } from "express-session";
import { Container } from "typedi";
import session from "express-session";
import { useContainer } from "class-validator";

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
	const store = new MemoryStore();
	Container.set("SessionStore", store);

	// Instanciate Nest app
	const app = await NestFactory.create(AppModule);

	// Enable session
	app.use(
		session({
			store,
			secret: config.sessionSecret,
			resave: true,
			saveUninitialized: true,
			cookie: {
				httpOnly: false,
			},
		}),
	);

	// Enable helmet for saner security default
	app.use(helmet());

	// Enable Cross Origin Resource Sharing
	app.enableCors(config.cors);

	// Enable morgan for clean logs
	app.use(morgan("combined"));

	//	class-validator
	useContainer(app.select(AppModule), { fallbackOnErrors: true });

	// Start server and listen for requests
	await app.listen(config.apiPort);
})();
