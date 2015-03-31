module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.PseudoElement('-moz-first-line');
	assert.strictEqual('moz', element.vendor);
	assert.strictEqual('first-line', element.name);
	assert.strictEqual('::-moz-first-line', element.toString());

	element = new stylecow.PseudoElement('-grab');
	assert.strictEqual(undefined, element.vendor);
	assert.strictEqual('-grab', element.name);
	assert.strictEqual('::-grab', element.toString());

	element = new stylecow.PseudoElement('grab');
	assert.strictEqual(undefined, element.vendor);
	assert.strictEqual('grab', element.name);
	assert.strictEqual('::grab', element.toString());

	reader = stylecow.Reader.fromString('::-moz-first-line');
	element = stylecow.PseudoElement.create(reader);
	assert.strictEqual('moz', element.vendor);
	assert.strictEqual('first-line', element.name);
	assert.strictEqual('::-moz-first-line', element.toString());

	reader = stylecow.Reader.fromString('::first-line');
	element = stylecow.PseudoElement.create(reader);
	assert.strictEqual(undefined, element.vendor);
	assert.strictEqual('first-line', element.name);
	assert.strictEqual('::first-line', element.toString());

	reader = stylecow.Reader.fromString(':html');
	element = stylecow.PseudoElement.create(reader);
	assert.strictEqual(undefined, element);

	reader = stylecow.Reader.fromString('html');
	element = stylecow.PseudoElement.create(reader);
	assert.strictEqual(undefined, element);
};
