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

	//Set temporary default browser support
	var defaultSupport;

	stylecow.forBrowsersLowerThan = function (support, callback) {
		var prevSupport = defaultSupport;

		defaultSupport = support;
		callback(stylecow);
		defaultSupport = prevSupport;

		return stylecow;
	};

	//Register new tasks
	stylecow.addTask = function (task) {
		task.forBrowsersLowerThan = task.forBrowsersLowerThan || defaultSupport;
		task.filter = task.filter || 'Root';
		task.position = task.position === 'before' ? 'before' : 'after';

		stylecow.tasks.push(task);

		return stylecow;
	};

	//Configure minimum browser support
	stylecow.minSupport = function (support) {
		stylecow.support = support;

		return stylecow;
	};

	//Run registered tasks
	stylecow.run = function (root) {
		var tasks = prepareTasks(stylecow.tasks, stylecow.support);

		executeRootTasks(root, tasks);
	};

})(require('./index'));

//filter and sort the tasks to improve performance
function prepareTasks (allTasks, support) {
	var tasks = {}, i;

	for (i = allTasks.length - 1; i >= 0; i--) {
		var task = allTasks[i];

		//browser compatibility
		if (!needFix(support, task, 'forBrowsersLowerThan')) {
			continue;
		}

		if (!needFix(support, task, 'forBrowsersUpperOrEqualTo')) {
			continue;
		}

		//Sort by position (after|before)
		tasks[task.position] = tasks[task.position] || {};

		//Sort by type
		if (typeof task.filter === 'string') {
			tasks[task.position][task.filter] = tasks[task.position][task.filter] || [];
			tasks[task.position][task.filter].push(task);
			continue;
		}

		if (typeof task.filter.type === 'string') {
			tasks[task.position][task.filter.type] = tasks[task.position][task.filter.type] || [];
			tasks[task.position][task.filter.type].push(task);
			continue;
		}

		if (typeof task.filter.type === Array) {
			task.filter.type.forEach(function (type) {
				tasks[task.position][type] = tasks[task.position][type] || [];
				tasks[task.position][type].push(task);
			});
			continue;
		}

		//Unknow type: use "_"
		tasks[task.position]._ = tasks[task.position]._ || [];
		tasks[task.position]._.push(task);
	}

	return tasks;
}

//check the browser support of a task
function needFix (stylecowSupport, task, method) {
	var taskSupport = task[method];

	if (!taskSupport || !stylecowSupport) {
		return true;
	}

	for (var browser in taskSupport) {
		if (stylecowSupport[browser] === false) {
			continue;
		}

		if (taskSupport[browser] === false) {
			return true;
		}

		if (method === 'forBrowsersLowerThan' && stylecowSupport[browser] < taskSupport[browser]) {
			return true;
		}

		if (method === 'forBrowsersUpperOrEqualTo' && stylecowSupport[browser] >= taskSupport[browser]) {
			return true;
		}
	}

	return false;
}

function executeRootTasks (element, tasks) {
	//mark as executed to don't execute it again
	element.data.executed = true;

	//execute tasks before its children
	if (tasks.hasOwnProperty('before')) {
		if (tasks.before.hasOwnProperty('Root')) {
			execRootTasks(element, tasks.before.Root);
		}

		if (tasks.before.hasOwnProperty('_')) {
			execRootTasks(element, tasks.before._);
		}
	}

	//execute the children tasks recursively
	if (element.length) {
		execChildrenTasks(element, tasks)
	}

	//execute tasks after its children
	if (tasks.hasOwnProperty('after')) {
		if (tasks.after.hasOwnProperty('Root')) {
			execRootTasks(element, tasks.after.Root);
		}

		if (tasks.after.hasOwnProperty('_')) {
			execRootTasks(element, tasks.after._);
		}
	}
}

function execRootTasks (element, tasks) {
	for (var i = tasks.length - 1; i >= 0; i--) {
		if (element.is(tasks[i].filter)) {
			tasks[i].fn(element);
		}
	}
}

function executeChildTasks (element, tasks) {
	//mark as executed to prevent execute it again
	element.data.executed = true;

	//was element removed?
	if (!element.parent) {
		return false;
	}

	//execute tasks before children
	if (tasks.hasOwnProperty('before')) {
		if (tasks.before.hasOwnProperty(element.type)) {
			if (!execChildTasks(element, tasks.before[element.type])) {
				return;
			}
		}

		if (tasks.before.hasOwnProperty('_')) {
			if (!execChildTasks(element, tasks.before._)) {
				return;
			}
		}
	}

	//execute the children tasks recursively
	if (element.length) {
		execChildrenTasks(element, tasks)
	}

	//execute tasks after children
	if (tasks.hasOwnProperty('after')) {
		if (tasks.after.hasOwnProperty(element.type)) {
			if (!execChildTasks(element, tasks.after[element.type])) {
				return;
			}
		}

		if (tasks.after.hasOwnProperty('_')) {
			if (!execChildTasks(element, tasks.after._)) {
				return;
			}
		}
	}
}

function execChildTasks (element, tasks) {
	for (var i = tasks.length - 1; i >= 0; i--) {
		if (element.is(tasks[i].filter)) {
			tasks[i].fn(element);

			//was element removed?
			if (!element.parent) {
				return false;
			}
		}
	}

	return true;
}

function execChildrenTasks (element, tasks) {
	var k = 0;

	while (element[k] !== undefined) {
		if (element[k].data.executed) {
			++k;
			continue;
		}

		executeChildTasks(element[k], tasks);
		k = 0;
	}
}
