module.exports = function (stylecow, assert) {
	var element, reader;

	reader = stylecow.Reader.fromString(' body {} p {font-family:\n Arial   ,   Helvetica ;  color : rgba( 0 , 10, 23, .5)} \t');
	element = stylecow.Root.create(reader);
	assert.strictEqual(2, element.length);
	assert.strictEqual('Rule', element[0].type);
	assert.strictEqual('Rule', element[1].type);
	assert.strictEqual('body {\n\t\n}\np {\n\tfont-family: Arial, Helvetica;\n\tcolor: rgba(0, 10, 23, 0.5);\n}', element.toString());

	reader = stylecow.Reader.fromString('color: blue');
	element = stylecow.Block.create(reader);
	assert.strictEqual(undefined, element);
};
