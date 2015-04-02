module.exports = function (stylecow, assert) {
	var element, reader;

	reader = stylecow.Reader.fromString('@keyframes foo {  from  {  color:  blue; } to { color: red} }');
	element = stylecow.Keyframes.create(reader);
	assert.strictEqual('keyframes', element.name);
	assert.strictEqual(undefined, element.vendor);
	assert.strictEqual(2, element.length);
	assert.strictEqual('Keyword', element[0].type);
	assert.strictEqual('KeyframesBlock', element[1].type);
	assert.strictEqual(2, element[1].length);
	assert.strictEqual('@keyframes foo {\n\tfrom {\n\t\tcolor: blue;\n\t}\n\tto {\n\t\tcolor: red;\n\t}\n}', element.toString());

	reader = stylecow.Reader.fromString('@-webkit-keyframes \nfoo\n {  from  {  color :  blue} to { color: red } }');
	element = stylecow.Keyframes.create(reader);
	assert.strictEqual('keyframes', element.name);
	assert.strictEqual('webkit', element.vendor);
	assert.strictEqual(2, element.length);
	assert.strictEqual('Keyword', element[0].type);
	assert.strictEqual('KeyframesBlock', element[1].type);
	assert.strictEqual(2, element[1].length);
	assert.strictEqual('@-webkit-keyframes foo {\n\tfrom {\n\t\tcolor: blue;\n\t}\n\tto {\n\t\tcolor: red;\n\t}\n}', element.toString());

	reader = stylecow.Reader.fromString('@keyframes {}');
	element = stylecow.Media.create(reader);
	assert.strictEqual(undefined, element);
};
