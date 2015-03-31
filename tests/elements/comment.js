module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.Comment(' hello world ');
	assert.strictEqual(' hello world ', element.name);
	assert.strictEqual(false, element.important);
	assert.strictEqual('/* hello world */', element.toString());

	element = new stylecow.Comment('! important comment');
	assert.strictEqual(' important comment', element.name);
	assert.strictEqual(true, element.important);
	assert.strictEqual('/*! important comment*/', element.toString());

	reader = stylecow.Reader.fromString('/* hello world */');
	element = stylecow.Comment.create(reader);
	assert.strictEqual(' hello world ', element.name);
	assert.strictEqual(false, element.important);
	assert.strictEqual('/* hello world */', element.toString());

	reader = stylecow.Reader.fromString('/*! hello world */');
	element = stylecow.Comment.create(reader);
	assert.strictEqual(' hello world ', element.name);
	assert.strictEqual(true, element.important);
	assert.strictEqual('/*! hello world */', element.toString());
};
