module.exports = function (stylecow, assert) {
	var element, reader;

	reader = stylecow.Reader.fromString('@supports ( background-size : cover ) or ( border-radius: 3px ) { body { font-size: 23px;}}');
	element = stylecow.Supports.create(reader);
	assert.strictEqual(2, element.length);
	assert.strictEqual('ConditionalSelector', element[0].type);
	assert.strictEqual('Block', element[1].type);
	assert.strictEqual(3, element[0].length);
	assert.strictEqual(1, element[1].length);
	assert.strictEqual('ConditionalExpression', element[0][0].type);
	assert.strictEqual('Rule', element[1][0].type);
	assert.strictEqual('@supports (background-size: cover) or (border-radius: 3px) {\n\tbody {\n\t\tfont-size: 23px;\n\t}\n}', element.toString());

	try {
		reader = stylecow.Reader.fromString('@supports | non-valid');
		element = stylecow.Supports.create(reader);
	} catch (e) {
		element = e;
	}

	assert.strictEqual('Unespected token: |<SPACE>\nline: 1\ncol: 11\n', element.message);
};
