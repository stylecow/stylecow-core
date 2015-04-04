module.exports = function (stylecow, assert) {
	var element, reader;

	reader = stylecow.Reader.fromString(' (min-width:  12px )');
	element = stylecow.ConditionalSelector.create(reader);
	assert.strictEqual(1, element.length);
	assert.strictEqual('ConditionalExpression', element[0].type);
	assert.strictEqual('(min-width: 12px)', element.toString());

	reader = stylecow.Reader.fromString('not ( transform-origin:  5% 5% )');
	element = stylecow.ConditionalSelector.create(reader);
	assert.strictEqual(2, element.length);
	assert.strictEqual('Keyword', element[0].type);
	assert.strictEqual('ConditionalExpression', element[1].type);
	assert.strictEqual('not (transform-origin: 5% 5%)', element.toString());

	reader = stylecow.Reader.fromString('( transform-origin:  5% 5% ) and (min-width: 12px)');
	element = stylecow.ConditionalSelector.create(reader);
	assert.strictEqual(3, element.length);
	assert.strictEqual('ConditionalExpression', element[0].type);
	assert.strictEqual('Keyword', element[1].type);
	assert.strictEqual('ConditionalExpression', element[2].type);
	assert.strictEqual('(transform-origin: 5% 5%) and (min-width: 12px)', element.toString());

	reader = stylecow.Reader.fromString('not ( not ( transform-origin: 2px ) )');
	element = stylecow.ConditionalSelector.create(reader);
	assert.strictEqual(2, element.length);
	assert.strictEqual('Keyword', element[0].type);
	assert.strictEqual('ConditionalExpression', element[1].type);
	assert.strictEqual('not (not (transform-origin: 2px))', element.toString());

	reader = stylecow.Reader.fromString('(color)');
	element = stylecow.ConditionalSelector.create(reader);
	assert.strictEqual(1, element.length);
	assert.strictEqual('ConditionalExpression', element[0].type);
	assert.strictEqual('(color)', element.toString());

	try {
		reader = stylecow.Reader.fromString(':invalid:');
		element = stylecow.ConditionalSelector.create(reader);
	} catch (error) {
		element = error;
	}

	assert.strictEqual('Unespected token: :invalid\nline: 1\ncol: 1\n', element.message);
};
