module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.MediaType('screen');
	assert.strictEqual('screen', element.name);
	assert.strictEqual('screen', element.toString());

	reader = stylecow.Reader.fromString(' screen ');
	element = stylecow.MediaType.create(reader);
	assert.strictEqual('screen', element.name);
	assert.strictEqual('screen', element.toString());

	reader = stylecow.Reader.fromString('.');
	element = stylecow.MediaType.create(reader);
	assert.strictEqual(undefined, element);
};
