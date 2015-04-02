module.exports = function (stylecow, assert) {
	var element, reader;

	reader = stylecow.Reader.fromString('  from  {  color:  blue; } ');
	element = stylecow.Keyframe.create(reader);
	assert.strictEqual(2, element.length);
	assert.strictEqual('KeyframeSelectors', element[0].type);
	assert.strictEqual('KeyframeBlock', element[1].type);
	assert.strictEqual(1, element[1].length);
	assert.strictEqual('from {\n\tcolor: blue;\n}', element.toString());

	reader = stylecow.Reader.fromString('  12% , 5%  {  color:  blue; opacity: 0 } ');
	element = stylecow.Keyframe.create(reader);
	assert.strictEqual(2, element.length);
	assert.strictEqual('KeyframeSelectors', element[0].type);
	assert.strictEqual('KeyframeBlock', element[1].type);
	assert.strictEqual(2, element[0].length);
	assert.strictEqual(2, element[1].length);
	assert.strictEqual('12%, 5% {\n\tcolor: blue;\n\topacity: 0;\n}', element.toString());

	reader = stylecow.Reader.fromString('12& { color: blue; }');
	element = stylecow.Media.create(reader);
	assert.strictEqual(undefined, element);
};
