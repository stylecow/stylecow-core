export default function (stylecow) {
	stylecow.addTask({
		filter: {
			type: 'Function',
			name: 'url'
		},
		fn: function (fn) {
			fn.name = 'uri';
		}
	});
};
