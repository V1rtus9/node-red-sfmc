module.exports = function (RED) {
	function sfmcApiCall(config) {
		RED.nodes.createNode(this, config);

		this.on('input', async (msg) => {});
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
