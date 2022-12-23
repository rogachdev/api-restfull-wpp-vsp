import parsePhoneNumber, {
	isValidNumber,
	isValidPhoneNumber,
} from 'libphonenumber-js'
import { type } from 'os'
import { start } from 'repl'
import {
	create,
	Whatsapp,
	Message,
	SocketState,
} from '@wppconnect-team/wppconnect'

export type Qrcode = {
	base64Qr: string
	attempts: number
}

class Sender {
	private client: Whatsapp
	private connected: boolean
	private qr: Qrcode

	get isConected(): boolean {
		return this.connected
	}

	get QrCOde(): Qrcode {
		return this.qr
	}

	constructor() {
		this.initializer()
	}

	// metodo de envio de msg
	async sendText(to: string, body: string) {
		if (!isValidPhoneNumber(to, 'BR')) {
			throw new Error('Este numero não é valido.')
		}

		let phoneNumber = parsePhoneNumber(to, 'BR')
			?.format('E.164')
			.replace('+', '') as string
		phoneNumber = phoneNumber.includes('@c.us')
			? phoneNumber
			: `${phoneNumber}@c.us`
		await this.client.sendText(phoneNumber, body)
	}

	async sendFile(to: string, filePath: string, options: string) {
		if (!isValidNumber(to, 'BR')) {
			throw new Error('Este numero é invalido.')
		}
		let phoneNumber = parsePhoneNumber(to, 'BR')
			?.format('E.164')
			.replace('+', '') as string
		phoneNumber = phoneNumber.includes('@c.us')
			? phoneNumber
			: `${phoneNumber}@c.us`
		await this.client.sendFile(phoneNumber, filePath, options)
	}

	private initializer() {
		const qr = (base64Qr: string, attempts: number) => {
			this.qr = { base64Qr, attempts }
		}

		const status = (statusSession: string) => {
			this.connected = ['isLogged', 'qrReadSucess'].includes(statusSession)
		}

		const start = (client: Whatsapp) => {
			this.client = client
			client.onStateChange((state) => {
				this.connected = state === SocketState.CONNECTED
			})
		}

		create({
			session: 'api-message',
			// statusFind: (statusSession, session) => {
			statusFind: (session) => {
				// console.log('Status da Sessão: ', statusSession)
				console.log('Nome da Sessão: ', session)
			},
		})
			.then((client) => start(client))
			.catch((error) => console.log(error))
	}
}
export default Sender
