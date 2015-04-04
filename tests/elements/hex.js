module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.Hex('0fc');
	assert.strictEqual('0fc', element.name);
	assert.strictEqual('#0fc', element.toString());

	reader = stylecow.Reader.fromString('#fff');
	element = stylecow.Hex.create(reader);
	assert.strictEqual('fff', element.name);
	assert.strictEqual('#fff', element.toString());

	reader = stylecow.Reader.fromString('#98f98f');
	element = stylecow.Hex.create(reader);
	assert.strictEqual('98f98f', element.name);
	assert.strictEqual('#98f98f', element.toString());

	reader = stylecow.Reader.fromString('#00ffff');
	element = stylecow.Hex.create(reader);
	assert.strictEqual('00ffff', element.name);
	assert.strictEqual('#00ffff', element.toString());

	try {
		reader = stylecow.Reader.fromString('#098z');
		element = stylecow.Hex.create(reader);
	} catch (error) {
		element = error;
	}

	assert.strictEqual('Unespected token: 098z<EOF>\nline: 1\ncol: 1\n', element.message);
};
