export class XapiClient {
	constructor({ url, username, password, timeoutMs = 10000 } = {}) {
		this.url = url;
		this.username = username;
		this.password = password;
		this.timeoutMs = timeoutMs;

		if (!this.url) {
			throw new Error('LRS url not configured.');
		}
		if (!this.username || !this.password) {
			throw new Error('LRS credentials not configured.');
		}
	}

	async sendStatement(statement) {
		return this.#post(statement);
	}

	async sendStatements(statements) {
		if (!Array.isArray(statements)) {
			throw new Error('sendStatements expects an array of statements');
		}
		return this.#post(statements);
	}

	async #post(payloadObj) {
		const payload = JSON.stringify(payloadObj);
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

		let res;
		try {
			const authValue = btoa(`${this.username}:${this.password}`);

			res = await fetch(this.url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Experience-API-Version': '1.0.3',
					Authorization: `Basic ${authValue}`
				},
				body: payload,
				signal: controller.signal
			});
		} catch (err) {
			const message = err?.message ? err.message : String(err);
			throw new Error('Fetch error while sending xAPI: ' + message, { cause: err });
		} finally {
			clearTimeout(timeout);
		}

		const responseText = await res.text();

		if (res.status < 200 || res.status >= 300) {
			throw new Error(`LRS returned HTTP ${res.status}: ${responseText.slice(0, 2000)}`);
		}

		try {
			return JSON.parse(responseText);
		} catch {
			return responseText;
		}
	}
}
