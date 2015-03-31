module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.PseudoClass('-moz-grab');
	assert.strictEqual('moz', element.vendor);
	assert.strictEqual('grab', element.name);
	assert.strictEqual(':-moz-grab', element.toString());

	element = new stylecow.PseudoClass('-grab');
	assert.strictEqual(undefined, element.vendor);
	assert.strictEqual('-grab', element.name);
	assert.strictEqual(':-grab', element.toString());

	element = new stylecow.PseudoClass('grab');
	assert.strictEqual(undefined, element.vendor);
	assert.strictEqual('grab', element.name);
	assert.strictEqual(':grab', element.toString());

	reader = stylecow.Reader.fromString(':-moz-hover');
	element = stylecow.PseudoClass.create(reader);
	assert.strictEqual('moz', element.vendor);
	assert.strictEqual('hover', element.name);
	assert.strictEqual(':-moz-hover', element.toString());

	reader = stylecow.Reader.fromString(':-hover');
	element = stylecow.PseudoClass.create(reader);
	assert.strictEqual(undefined, element.vendor);
	assert.strictEqual('-hover', element.name);
	assert.strictEqual(':-hover', element.toString());

	reader = stylecow.Reader.fromString('html');
	element = stylecow.PseudoClass.create(reader);
	assert.strictEqual(undefined, element);
};
