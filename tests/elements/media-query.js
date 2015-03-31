module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.MediaQuery();
	element.push(new stylecow.Keyword('only'));
	element.push(new stylecow.MediaFeature('color'));
	assert.strictEqual('only (color)', element.toString());

	reader = stylecow.Reader.fromString('only screen');
	element = stylecow.MediaQuery.create(reader);
	assert.strictEqual(2, element.length);
	assert.strictEqual('Keyword', element[0].type);
	assert.strictEqual('MediaType', element[1].type);
	assert.strictEqual('only screen', element.toString());

	reader = stylecow.Reader.fromString('only color and (min-width: 23px)');
	element = stylecow.MediaQuery.create(reader);
	assert.strictEqual(3, element.length);
	assert.strictEqual('Keyword', element[0].type);
	assert.strictEqual('MediaType', element[1].type);
	assert.strictEqual('MediaFeature', element[2].type);
	assert.strictEqual('min-width', element[2].name);
	assert.strictEqual('Unit', element[2][0].type);
	assert.strictEqual('only color and (min-width: 23px)', element.toString());

	reader = stylecow.Reader.fromString('12(color)');
	element = stylecow.MediaQuery.create(reader);
	assert.strictEqual(undefined, element);
};
