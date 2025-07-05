import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import * as crypto from 'crypto';
import { UserEntity } from '../../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { AuthInput } from '../dto/auth.input';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {}

    private validateInitData(initData: string, botToken: string) {
        const urlSearchParams = new URLSearchParams(initData);
        const data = Object.fromEntries(urlSearchParams.entries());

        const checkString = Object.keys(data)
            .filter((key) => key !== 'hash')
            .map((key) => `${key}=${data[key]}`)
            .sort()
            .join('\n');

        const secretKey = crypto
            .createHmac('sha256', 'WebAppData')
            .update(botToken)
            .digest();
        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(checkString)
            .digest('hex');

        if (data.hash === signature) {
            try {
                return JSON.parse(data.user);
            } catch {
                return null;
            }
        }

        return null;
    }

    async auth({ input }: { input: AuthInput }): Promise<UserEntity> {
        const { initData = '' } = input ?? {};
        const botToken = this.configService.get<string>('TELEGRAM_BOT_ID') ?? '';

        const validatedUser = this.validateInitData(initData, botToken);

        if (!validatedUser) {
            throw new BadRequestException('Ошибка авторизации');
        }

        const existing = await this.userService.findByTelegramId(
            BigInt(validatedUser.id),
        );

        if (existing) return existing as UserEntity;

        const created = await this.userService.create({
            telegramId: validatedUser.id,
            username: validatedUser.username,
            firstName: validatedUser.first_name,
            lastName: validatedUser.last_name,
            avatarUrl: validatedUser.photo_url,
            isBot: validatedUser.is_bot,
            telegramAuthDate: Number(validatedUser.auth_date),
            telegramHash: validatedUser.hash,
        });

        return created as UserEntity;
    }
}
