import { Injectable } from "@nestjs/common";
import { ValidatorConstraintInterface, ValidatorConstraint, ValidationArguments } from "class-validator";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@entities/user.entity";
import { Repository } from "typeorm";

/**
 * validator for user object, return true if the user exist else throw a bad request exception
 */
@ValidatorConstraint({ name: "UserExists", async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async validate(value: string) {
		try {
			await this.usersRepository.findOneOrFail(value);
		} catch (e) {
			return false;
		}
		return true;
	}
	defaultMessage(_args: ValidationArguments) {
		return `User doesn't exist`;
	}
}