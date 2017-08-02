"use strict";

const stylecow = require('./index');

stylecow.Tasks = class {

    constructor () {
        this.logs = [];
        this.tasks = [];
        this.support = {
            edge: 0,
            explorer: 0,
            firefox: 0,
            chrome: 0,
            safari: 0,
            opera: 0,
            android: 0,
            ios: 0
        };
    }

    use (module) {
        module(this, stylecow);

        return this;
    }

    addTask (task) {
        task.filter = task.filter || 'Root';
        task.position = task.position === 'before' ? 'before' : 'after';
        this.tasks.push(task);

        return this;
    }

    minSupport (support) {
        this.support = support;

        return this;
    }

    run (root) {
        this.logs = [];
        const tasks = prepareTasks(this.tasks, this.support);
        executeRootTasks(root, tasks);

        return this;
    }

    log (message, node) {
        const log = {
            message: message
        };

        if (node) {
            log.file = node.getData('file');
            log.line = node.getData('line');
            log.col = node.getData('col');
        }

        this.logs.push(log);
    }

    getLogs () {
        return this.logs;
    }
}


//filter and sort the tasks to improve performance (position.type.name)
function prepareTasks (allTasks, support) {
    const tasks = {before: {}, after: {}};
    let i;

    for (i = allTasks.length - 1; i >= 0; i--) {
        const task = allTasks[i];

        //browser compatibility
        if (!needFix(support, task, 'forBrowsersLowerThan')) {
            continue;
        }

        if (!needFix(support, task, 'forBrowsersUpperOrEqualTo')) {
            continue;
        }

        //Get type and name
        let types, names;

        if (typeof task.filter === 'string') {
            types = [task.filter];
            names = ['_'];
        } else {
            types = (task.filter.type instanceof Array ? task.filter.type : (task.filter.type ? [task.filter.type] : ['_']));
            names = (task.filter.name instanceof Array ? task.filter.name : (task.filter.name ? [task.filter.name] : ['_']));
        }

        types.forEach(function (type) {
            if (!tasks[task.position].hasOwnProperty(type)) {
                tasks[task.position][type] = {};
            }

            names.forEach(function (name) {
                if (!tasks[task.position][type].hasOwnProperty(name)) {
                    tasks[task.position][type][name] = [];
                }

                tasks[task.position][type][name].push(task);
            });
        });
    }

    return tasks;
}

//check the browser support of a task
function needFix (stylecowSupport, task, method) {
    const taskSupport = task[method];

    if (!taskSupport || !stylecowSupport) {
        return true;
    }

    for (let browser in taskSupport) {
        if (stylecowSupport[browser] === false) {
            continue;
        }

        if (method === 'forBrowsersLowerThan' && (taskSupport[browser] === false || stylecowSupport[browser] < taskSupport[browser])) {
            return true;
        }

        if (method === 'forBrowsersUpperOrEqualTo') {
            if (taskSupport[browser] === false) {
                return false;
            }

            if (stylecowSupport[browser] >= taskSupport[browser]) {
                return true;
            }
        }
    }

    return false;
}

function executeRootTasks (element, tasks) {
    //mark as executed to don't execute it again
    element.data.executed = true;

    //execute tasks before its children
    let t = tasks.before['Root'];
    if (t !== undefined && t._ !== undefined) {
        execRootTasks(element, t._);
    }

    //execute the children tasks recursively
    if (element.length) {
        execChildrenTasks(element, tasks)
    }

    //execute tasks after its children
    t = tasks.after['Root'];
    if (t !== undefined && t._ !== undefined) {
        execRootTasks(element, t._);
    }
}

function execRootTasks (element, tasks) {
    for (let i = tasks.length - 1; i >= 0; i--) {
        if (element.is(tasks[i].filter)) {
            tasks[i].fn(element);
        }
    }
}

function executeChildTasks (element, tasks) {
    //mark as executed to prevent execute it again
    element.data.executed = true;

    //was element removed?
    if (!element.hasParent()) {
        return false;
    }

    //execute tasks before children
    let t = tasks.before[element.type];

    if (t !== undefined) {
        if (element.name !== undefined && t[element.name] !== undefined) {
            if (!execChildTasks(element, t[element.name])) {
                return;
            }
        }

        if (t._ !== undefined) {
            if (!execChildTasks(element, t._)) {
                return;
            }
        }
    }

    //execute the children tasks recursively
    if (element.length) {
        execChildrenTasks(element, tasks)
    }

    //execute tasks after children
    t = tasks.after[element.type];

    if (t !== undefined) {
        if (element.name !== undefined && t[element.name] !== undefined) {
            if (!execChildTasks(element, t[element.name])) {
                return;
            }
        }

        if (t._ !== undefined) {
            if (!execChildTasks(element, t._)) {
                return;
            }
        }
    }
}

function execChildTasks (element, tasks) {
    for (let i = tasks.length - 1; i >= 0; i--) {
        if (element.is(tasks[i].filter)) {
            tasks[i].fn(element);

            //was element removed?
            if (!element.hasParent()) {
                return false;
            }
        }
    }

    return true;
}

function execChildrenTasks (element, tasks) {
    let k = 0;

    while (element[k] !== undefined) {
        if (element[k].data.executed) {
            ++k;
            continue;
        }

        executeChildTasks(element[k], tasks);
        k = 0;
    }
}
