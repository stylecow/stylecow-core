module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.ClassSelector('foo');
	assert.strictEqual('foo', element.name);
	assert.strictEqual('.foo', element.toString());

	reader = stylecow.Reader.fromString('.foo');
	element = stylecow.ClassSelector.create(reader);
	assert.strictEqual('foo', element.name);
	assert.strictEqual('.foo', element.toString());

	reader = stylecow.Reader.fromString('foo');
	element = stylecow.ClassSelector.create(reader);
	assert.strictEqual(undefined, element);
};