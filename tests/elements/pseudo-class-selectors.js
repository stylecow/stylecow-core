module.exports = function (stylecow, assert) {
	var element, reader;

	reader = stylecow.Reader.fromString(' :-moz-not(  .ola, div.foo ) ');
	element = stylecow.PseudoClassSelectors.create(reader);
	assert.strictEqual('moz', element.vendor);
	assert.strictEqual('not', element.name);
	assert.strictEqual(2, element.length);
	assert.strictEqual('Selector', element[0].type);
	assert.strictEqual('Selector', element[1].type);
	assert.strictEqual(2, element[1].length);
	assert.strictEqual(':-moz-not(.ola, div.foo)', element.toString());

	reader = stylecow.Reader.fromString(' :not(  .ola, div.foo ) ');
	element = stylecow.PseudoClassSelectors.create(reader);
	assert.strictEqual(undefined, element.vendor);
	assert.strictEqual('not', element.name);
	assert.strictEqual(2, element.length);
	assert.strictEqual('Selector', element[0].type);
	assert.strictEqual('Selector', element[1].type);
	assert.strictEqual(2, element[1].length);
	assert.strictEqual(':not(.ola, div.foo)', element.toString());

	reader = stylecow.Reader.fromString(':not');
	element = stylecow.PseudoClassSelectors.create(reader);
	assert.strictEqual(undefined, element);
};
