module.exports = function (stylecow, assert) {
	var element, reader;

	reader = stylecow.Reader.fromString('  { font-family:\n Arial   ,   Helvetica ;  color : rgba( 0 , 10, 23, .5) \t}');
	element = stylecow.Block.create(reader);
	assert.strictEqual(2, element.length);
	assert.strictEqual('Declaration', element[0].type);
	assert.strictEqual('Declaration', element[1].type);
	assert.strictEqual('{\n\tfont-family: Arial, Helvetica;\n\tcolor: rgba(0, 10, 23, 0.5);\n}', element.toString());

	reader = stylecow.Reader.fromString('  { font-family:\n Arial   ,   Helvetica ;  color : rgba( 0 , 10, 23, .5); \n\n\na:hover { color: red;}\n\n\n\n \t}');
	element = stylecow.Block.create(reader);
	assert.strictEqual(3, element.length);
	assert.strictEqual('Declaration', element[0].type);
	assert.strictEqual('Declaration', element[1].type);
	assert.strictEqual('Rule', element[2].type);
	assert.strictEqual('{\n\tfont-family: Arial, Helvetica;\n\tcolor: rgba(0, 10, 23, 0.5);\n\ta:hover {\n\t\tcolor: red;\n\t}\n}', element.toString());

	reader = stylecow.Reader.fromString('color: blue');
	element = stylecow.Block.create(reader);
	assert.strictEqual(undefined, element);
};
