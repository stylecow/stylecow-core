module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.Selector();
	element.push(new stylecow.IdSelector('foo'));
	element.push(new stylecow.Combinator('>'));
	element.push(new stylecow.TypeSelector('p'));
	assert.strictEqual('#foo > p', element.toString());

	reader = stylecow.Reader.fromString('#foo    >   p.bar:hover   +    ::selection');
	element = stylecow.Selector.create(reader);
	assert.strictEqual('IdSelector', element[0].type);
	assert.strictEqual('Combinator', element[1].type);
	assert.strictEqual('TypeSelector', element[2].type);
	assert.strictEqual('ClassSelector', element[3].type);
	assert.strictEqual('PseudoClass', element[4].type);
	assert.strictEqual('Combinator', element[5].type);
	assert.strictEqual('PseudoElement', element[6].type);
	assert.strictEqual('#foo > p.bar:hover + ::selection', element.toString());

	reader = stylecow.Reader.fromString('| non-valid');
	element = stylecow.Selector.create(reader);
	assert.strictEqual(undefined, element);
};
