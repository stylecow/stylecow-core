(function (stylecow) {

	//Properties
	stylecow.tasks = [];
	stylecow.support = {
		explorer: false,
		firefox: false,
		chrome: false,
		safari: false,
		opera: false,
		android: false,
		ios: false
	};

	//Load npm modules
	stylecow.loadNpmModule = function (name) {
		require(name)(stylecow);

		return stylecow;
	};

	//Load stylecow plugin
	stylecow.loadPlugin = function (name) {
		stylecow.loadNpmModule('stylecow-plugin-' + name);

		return stylecow;
	};

	//Set temporary default browser support
	var defaultSupport;

	stylecow.forBrowsersLowerThan = function (support, callback) {
		tasks = null;
		var prevSupport = defaultSupport;

		defaultSupport = support;
		callback(stylecow);
		defaultSupport = prevSupport;

		return stylecow;
	};

	//Register new tasks
	stylecow.addTask = function (task) {
		tasks = null;

		if (!task.forBrowsersLowerThan) {
			task.forBrowsersLowerThan = defaultSupport;
		}

		stylecow.tasks.push(task);

		return stylecow;
	};

	//Configure minimum browser support
	stylecow.minSupport = function (support) {
		stylecow.support = support;

		return stylecow;
	};

	//Run registered tasks
	stylecow.run = function (css) {
		if (!tasks) {
			tasks = {_: [], __: []};

			var type, name;

			for (var i = stylecow.tasks.length - 1; i >= 0; i--) {
				var task = stylecow.tasks[i];

				if (task.forBrowsersLowerThan && !needFix(stylecow.support, task.forBrowsersLowerThan)) {
					continue;
				}

				if (task.filter) {
					if (typeof task.filter.type !== 'string') {
						tasks._.push(task);
						continue;
					}

					type = task.filter.type;

					if (typeof task.filter.name === 'string') {
						name = task.filter.name;
					} else {
						name = '_';
					}

					if (!(type in tasks)) {
						tasks[type] = {};
						tasks[type][name] = [task];
					} else if (!(name in tasks[type])) {
						tasks[type][name] = [task];
					} else {
						tasks[type][name].push(task);
					}
				} else {
					tasks.__.push(task);
				}
			};
		}

		for (var i = tasks.__.length - 1; i >= 0; i--) {
			if (css.is(tasks.__[i].filter)) {
				tasks.__[i].fn(css);
			}
		}

		executeTasks(css, tasks);

		if ('Root' in tasks) {
			for (var i = tasks.Root._.length - 1; i >= 0; i--) {
				if (css.is(tasks.Root._[i].filter)) {
					tasks.Root._[i].fn(css);
				}
			}
		}
	};

})(require('./index'));

//execute tasks
function executeTasks (element, tasks) {
	if (element.length) {
		var k = 0;

		while (element[k] !== undefined) {
			if (element[k].data.executed) {
				++k;
				continue;
			}

			executeTasks(element[k], tasks);
			k = 0;
		}
	}
	
	if (tasks._.length) {
		for (i = tasks._.length - 1; i >= 0 && element.parent; i--) {
			if (element.is(tasks[i].filter)) {
				tasks[i].fn(element);
			}
		}
	}

	if (element.type in tasks) {
		if (('name' in element) && (element.name in tasks[element.type])) {
			for (var i = tasks[element.type][element.name].length - 1; i >= 0 && element.parent; i--) {
				if (element.is(tasks[element.type][element.name][i].filter)) {
					tasks[element.type][element.name][i].fn(element);
				}
			}
		}

		if (tasks[element.type]._ !== undefined) {
			for (var i = tasks[element.type]._.length - 1; i >= 0 && element.parent; i--) {
				if (element.is(tasks[element.type]._[i].filter)) {
					tasks[element.type]._[i].fn(element);
				}
			}
		}
	}

	element.data.executed = true;
}

//check the browser support of a task
function needFix (minSupport, disablePlugin) {
	if (!disablePlugin || !minSupport) {
		return true;
	}

	for (var browser in disablePlugin) {
		if (minSupport[browser] === false) {
			continue;
		}

		if (disablePlugin[browser] === false || minSupport[browser] < disablePlugin[browser]) {
			return true;
		}
	}

	return false;
}