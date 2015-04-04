module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.String('ola');
	assert.strictEqual('ola', element.name);
	assert.strictEqual('"ola"', element.toString());

	element = new stylecow.String('ola"ola');
	assert.strictEqual('ola"ola', element.name);
	assert.strictEqual('"ola\\"ola"', element.toString());

	reader = stylecow.Reader.fromString('"ola"');
	element = stylecow.String.create(reader);
	assert.strictEqual('ola', element.name);
	assert.strictEqual('"ola"', element.toString());

	reader = stylecow.Reader.fromString("'ola'");
	element = stylecow.String.create(reader);
	assert.strictEqual('ola', element.name);
	assert.strictEqual('"ola"', element.toString());

	reader = stylecow.Reader.fromString("''");
	element = stylecow.String.create(reader);
	assert.strictEqual('', element.name);
	assert.strictEqual('""', element.toString());

	reader = stylecow.Reader.fromString('ola');
	element = stylecow.String.create(reader);
	assert.strictEqual(undefined, element);
};
