import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MailService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	async sendActivationMail(to: string, link: string) {
		await this.mailerService.sendMail({
			to,
			from: this.configService.get('SMTP_USER'),
			subject: `Account activation on ${this.configService.get('API_URL')}`,
			text: '',
			html: `
				<div>
					<h1>Follow link below to activate your account</h1>
					<a href="${link}">${link}</a>
				</div>
			`
		})
	}
}
