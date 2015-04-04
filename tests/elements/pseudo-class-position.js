module.exports = function (stylecow, assert) {
	var element, reader;

	reader = stylecow.Reader.fromString(' :-moz-nth-child( 3 ) ');
	element = stylecow.PseudoClassPosition.create(reader);
	assert.strictEqual('moz', element.vendor);
	assert.strictEqual('nth-child', element.name);
	assert.strictEqual(1, element.length);
	assert.strictEqual('Number', element[0].type);
	assert.strictEqual(':-moz-nth-child(3)', element.toString());

	reader = stylecow.Reader.fromString(' :nth-column(even) ');
	element = stylecow.PseudoClassPosition.create(reader);
	assert.strictEqual(undefined, element.vendor);
	assert.strictEqual('nth-column', element.name);
	assert.strictEqual(1, element.length);
	assert.strictEqual('Keyword', element[0].type);
	assert.strictEqual(':nth-column(even)', element.toString());

	reader = stylecow.Reader.fromString(' :nth-column(3n+   2) ');
	element = stylecow.PseudoClassPosition.create(reader);
	assert.strictEqual(undefined, element.vendor);
	assert.strictEqual('nth-column', element.name);
	assert.strictEqual(3, element.length);
	assert.strictEqual('Unit', element[0].type);
	assert.strictEqual('Operator', element[1].type);
	assert.strictEqual('Number', element[2].type);
	assert.strictEqual(':nth-column(3n + 2)', element.toString());

	try {
		reader = stylecow.Reader.fromString(':nth-child(not)');
		element = stylecow.PseudoClassPosition.create(reader);
	} catch (error) {
		element = error;
	}

	assert.strictEqual('Unespected token: not)\nline: 1\ncol: 12\n', element.message);
};
