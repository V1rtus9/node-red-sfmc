const mustache = require('mustache');
const { SfmcApi } = require('sfmc-api');

module.exports = function (RED) {
	function SfmcApiCall(config) {
		RED.nodes.createNode(this, config);
		const connection = RED.nodes.getNode(config.connection);

		const apiClient = new SfmcApi({
			subdomain: connection.subdomain,
			accountId: connection.accountId,
			clientId: connection.credentials.clientId,
			clientSecret: connection.credentials.clientSecret,
		});

		this.on('input', async (msg) => {
			const endpoint = mustache.render(config.endpoint, msg);

			const body = config.payload === 'body' ? msg.payload : undefined;
			const query =
				config.payload === 'query'
					? new URLSearchParams(msg.payload)
					: undefined;

			try {
				const response = await (async () => {
					switch (config.method) {
						case 'GET':
							return apiClient.rest.get(
								`${endpoint}?${query?.toString()}`,
							);
						case 'PUT':
							return apiClient.rest.put(endpoint, body);
						case 'POST':
							return apiClient.rest.post(endpoint, body);
						case 'DELETE':
							return apiClient.rest.delete(endpoint);
						default:
							throw new Error('Unsupported method');
					}
				})();

				this.send({
					...msg,
					payload: response,
				});
			} catch (e) {
				this.error(e);
			}
		});
	}

	function SfmcConnection(config) {
		RED.nodes.createNode(this, config);

		this.subdomain = config.subdomain;
		this.accountId = config.accountId;
	}

	RED.nodes.registerType('sfmc', SfmcApiCall);
	RED.nodes.registerType('sfmc-connection', SfmcConnection, {
		accountId: { type: 'text' },
		subdomain: { type: 'text' },
		credentials: {
			clientId: { type: 'text' },
			clientSecret: { type: 'password' },
		},
	});
};
