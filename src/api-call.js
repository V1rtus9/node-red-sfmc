module.exports = function (RED) {
	function sfmcApiCall(config) {
		RED.nodes.createNode(this, config);

		this.on('input', async (msg) => {});
	}

	function sfmcConnection(n) {
		RED.nodes.createNode(this, n);
	}

	RED.nodes.registerType('sfmc', sfmcApiCall);
	RED.nodes.registerType('sfmc_connection', sfmcConnection, {
		api_key: { type: 'text' },
		base_url: { type: 'text' },
	});
};
