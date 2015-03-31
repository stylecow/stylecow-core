module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.TypeSelector('html');
	assert.strictEqual('html', element.name);
	assert.strictEqual('html', element.toString());

	reader = stylecow.Reader.fromString('html');
	element = stylecow.TypeSelector.create(reader);
	assert.strictEqual('html', element.name);
	assert.strictEqual('html', element.toString());

	reader = stylecow.Reader.fromString('.foo');
	element = stylecow.TypeSelector.create(reader);
	assert.strictEqual(undefined, element);
};
