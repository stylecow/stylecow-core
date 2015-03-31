module.exports = function (stylecow, assert) {
	var element, reader;

	reader = stylecow.Reader.fromString('  { font-family:\n Arial   ,   Helvetica ;  color : rgba( 0 , 10, 23, .5) \t}');
	element = stylecow.Block.create(reader);
	assert.strictEqual(2, element.length);
	assert.strictEqual('Declaration', element[0].type);
	assert.strictEqual('Declaration', element[1].type);
	assert.strictEqual('{\n\tfont-family: Arial, Helvetica;\n\tcolor: rgba(0, 10, 23, 0.5);\n}', element.toString());

	reader = stylecow.Reader.fromString('color: blue');
	element = stylecow.Block.create(reader);
	assert.strictEqual(undefined, element);
};
