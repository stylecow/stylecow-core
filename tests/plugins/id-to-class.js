export default function (stylecow) {
	stylecow.addTask({
		filter: {
			type: 'IdSelector'
		},
		fn: function (id) {
			id.replaceWithCode('.' + id.name, 'ClassSelector');
		}
	});
};
