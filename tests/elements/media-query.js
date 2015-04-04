module.exports = function (stylecow, assert) {
	var element, reader;

	reader = stylecow.Reader.fromString('only screen');
	element = stylecow.MediaQuery.create(reader);
	assert.strictEqual(2, element.length);
	assert.strictEqual('Keyword', element[0].type);
	assert.strictEqual('Keyword', element[1].type);
	assert.strictEqual('only screen', element.toString());

	reader = stylecow.Reader.fromString('(min-resolution:  2dppx)');
	element = stylecow.MediaQuery.create(reader);
	assert.strictEqual(1, element.length);
	assert.strictEqual('ConditionalExpression', element[0].type);
	assert.strictEqual('ConditionalFeature', element[0][0].type);
	assert.strictEqual('(min-resolution: 2dppx)', element.toString());

	reader = stylecow.Reader.fromString('only color and (min-width: 23px)');
	element = stylecow.MediaQuery.create(reader);
	assert.strictEqual(4, element.length);
	assert.strictEqual('Keyword', element[0].type);
	assert.strictEqual('Keyword', element[1].type);
	assert.strictEqual('Keyword', element[2].type);
	assert.strictEqual('ConditionalExpression', element[3].type);
	assert.strictEqual('ConditionalFeature', element[3][0].type);
	assert.strictEqual('min-width', element[3][0].name);
	assert.strictEqual('Value', element[3][0][0].type);
	assert.strictEqual('Unit', element[3][0][0][0].type);
	assert.strictEqual('only color and (min-width: 23px)', element.toString());

	reader = stylecow.Reader.fromString('only color and (min-width: 23px) and (max-width: 400px)');
	element = stylecow.MediaQuery.create(reader);
	assert.strictEqual(6, element.length);
	assert.strictEqual('Keyword', element[0].type);
	assert.strictEqual('Keyword', element[1].type);
	assert.strictEqual('Keyword', element[2].type);
	assert.strictEqual('ConditionalExpression', element[3].type);
	assert.strictEqual('Keyword', element[4].type);
	assert.strictEqual('ConditionalExpression', element[5].type);
	assert.strictEqual('only color and (min-width: 23px) and (max-width: 400px)', element.toString());

	try {
		reader = stylecow.Reader.fromString('12(color)');
		element = stylecow.MediaQuery.create(reader);
	} catch (error) {
		element = error;
	}

	assert.strictEqual('Unespected token: 12(\nline: 1\ncol: 1\n', element.message);
};
