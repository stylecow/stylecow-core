module.exports = function (stylecow, assert) {
	var element, reader;

	reader = stylecow.Reader.fromString('#foo    >   p.bar:hover   +    ::selection ,   div \n >  \t p ');
	element = stylecow.Selectors.create(reader);
	assert.strictEqual(2, element.length);
	assert.strictEqual('Selector', element[0].type);
	assert.strictEqual('Selector', element[1].type);
	assert.strictEqual(7, element[0].length);
	assert.strictEqual(3, element[1].length);
	assert.strictEqual('IdSelector', element[0][0].type);
	assert.strictEqual('TypeSelector', element[1][0].type);
	assert.strictEqual('#foo > p.bar:hover + ::selection, div > p', element.toString());

	reader = stylecow.Reader.fromString('| non-valid');
	element = stylecow.Selector.create(reader);
	assert.strictEqual(undefined, element);
};
