module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.Combinator('&');
	assert.strictEqual('&', element.name);
	assert.strictEqual('&', element.toString());

	element = new stylecow.Combinator(' ');
	assert.strictEqual(' ', element.name);
	assert.strictEqual(' ', element.toString());

	element = new stylecow.Combinator('>');
	assert.strictEqual('>', element.name);
	assert.strictEqual(' > ', element.toString());

	reader = stylecow.Reader.fromString('>');
	element = stylecow.Combinator.create(reader);
	assert.strictEqual('>', element.name);
	assert.strictEqual(' > ', element.toString());

	reader = stylecow.Reader.fromString('&');
	element = stylecow.Combinator.create(reader);
	assert.strictEqual('&', element.name);
	assert.strictEqual('&', element.toString());

	reader = stylecow.Reader.fromString(' ');
	element = stylecow.Combinator.create(reader);
	assert.strictEqual(' ', element.name);
	assert.strictEqual(' ', element.toString());

	reader = stylecow.Reader.fromString('+');
	element = stylecow.Combinator.create(reader);
	assert.strictEqual('+', element.name);
	assert.strictEqual(' + ', element.toString());

	reader = stylecow.Reader.fromString('~');
	element = stylecow.Combinator.create(reader);
	assert.strictEqual('~', element.name);
	assert.strictEqual(' ~ ', element.toString());

	reader = stylecow.Reader.fromString('.');
	element = stylecow.Combinator.create(reader);
	assert.strictEqual(undefined, element);
};
