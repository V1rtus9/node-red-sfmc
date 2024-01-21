const mustache = require('mustache');
const { SfmcApi } = require('sfmc-api');

module.exports = function (RED) {
	function sfmcApiCall(config) {
		RED.nodes.createNode(this, config);
		const connection = RED.nodes.getNode(config.sfmc_connection);

		const apiClient = new SfmcApi({
			clientId: connection.clientId,
			subdomain: connection.subdomain,
			accountId: connection.accountId,
			clientSecret: connection.clientSecret,
		});

		this.on('input', async (msg) => {
			const endpoint = mustache.render(config.endpoint, msg);

			try {
				const response = await (async () => {
					switch (config.method) {
						case 'GET':
							return apiClient.rest.get(endpoint);
						case 'POST':
							return apiClient.rest.post(endpoint, msg.payload);
						case 'PUT':
							return apiClient.rest.put(endpoint, msg.payload);
						case 'DELETE':
							return apiClient.rest.delete(endpoint);
						default:
							throw new Error('Unsupported method');
					}
				})();

				this.send({
					payload: response,
				});
			} catch (e) {
				this.error(e);
			}
		});
	}

	function sfmcConnection(n) {
		RED.nodes.createNode(this, n);

		this.clientId = n.clientId;
		this.subdomain = n.subdomain;
		this.accountId = n.accountId;
		this.clientSecret = n.clientSecret;
	}

	RED.nodes.registerType('sfmc', sfmcApiCall);
	RED.nodes.registerType('sfmc_connection', sfmcConnection, {
		clientId: { type: 'text' },
		subdomain: { type: 'text' },
		accountId: { type: 'text' },
		clientSecret: { type: 'text' },
	});
};
