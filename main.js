var isOnSelect = false;
var leftTaskList = [];
var coderList = [];
var currentChooseTask;
var currentChooseCoder;

//-------------------------------------------------------------------------------------------//

function inputTask() {
    initTasksData(prompt("inputTask"));
    renderTaskGroup(leftTaskList);
}

function initTasksData(tasksText) {
    var taskStringList = tasksText.split("\n");
    // 迷之不可以，代码提示完全不好用
    // for (var taskString in taskStringList) {
    //     var splitedTaskString = taskString.split(" ");
    //     leftTaskList.push({name: splitedTaskString[0], hour: splitedTaskString[1]});
    // }
    for (var i = 0; i < taskStringList.length; i++) {
        var splitedTaskString = taskStringList[i].split(" ");
        leftTaskList.push(new Task(splitedTaskString[0], splitedTaskString[1]));
    }
}

function renderTaskGroup(taskGroup) {
    var container = document.getElementById('task');
    // container.remove
    for (var i = 0; i < taskGroup.length; i++) {
        var child = document.createElement('p');

        var ownerName = "";
        if(taskGroup[i].owner!==null){
            ownerName = taskGroup[i].owner.name;
        }
        child.innerHTML = taskGroup[i].name + ":" + taskGroup[i].hour + "h -> " + ownerName;
        child.style.padding = 5;

        child.onmouseover = function () {
            // 用this而不是child，否则会绑定成最后一个
            this.style.backgroundColor = 'green'
        };
        child.onmouseout = function () {
            if (this.style.backgroundColor === 'green') {
                this.style.backgroundColor = 'transparent'
            }
        };

        child.onclick = function () {
            if (isOnSelect) {
                if (currentChooseCoder !== null) {
                    if (contains(leftTaskList, taskGroup[i])) {
                        leftTaskList = removeByObj(leftTaskList, taskGroup[i]);
                    }
                    currentChooseCoder.bind(taskGroup[i]);
                }
                exitSelectMode();
                update();
            } else {
                isOnSelect = true;
                currentChooseTask = taskGroup[i];
                this.style.backgroundColor = 'red';
            }
        };

        container.appendChild(child);
    }
}

//-------------------------------------------------------------------------------------------//

function inputCoder() {
    initCodersData(prompt("inputCoder"));
    renderCoders();
}

function initCodersData(codersText) {
    var coderStringList = codersText.split("\n");
    for (var i = 0; i < coderStringList.length; i++) {
        coderList.push(new Coder(coderStringList[i]));
    }
}

function renderCoders() {
    var container = document.getElementById('coder');
    for (var i = 0; i < coderList.length; i++) {
        var child = document.createElement('p');
        child.innerHTML = coderList[i].name + ":" + coderList[i].getAllTime() + "h";
        child.style.padding = 5;

        child.onmouseover = function () {
            // 用this而不是child，否则会绑定成最后一个
            this.style.backgroundColor = 'blue'
        };
        child.onmouseout = function () {
            if (this.style.backgroundColor === 'blue') {
                this.style.backgroundColor = 'transparent'
            }
        };

        child.onclick = function () {
            if (isOnSelect) {
                if (currentChooseTask !== null) {
                    if (contains(leftTaskList, currentChooseTask)) {
                        leftTaskList = removeByObj(leftTaskList, currentChooseTask);
                    }
                    currentChooseTask.bind(coderList[i]);
                }
                exitSelectMode();
                update();
            } else {
                isOnSelect = true;
                currentChooseCoder = coderList[i];
                this.style.backgroundColor = 'red';
            }
        };

        container.appendChild(child);
    }
}

//-------------------------------------------------------------------------------------------//

function exitSelectMode() {
    isOnSelect = false;
    currentChooseTask = null;
    currentChooseCoder = null;
}

function update() {
    // var children = document.getElementsByTagName('p');
    // for (var i = 0; i < children.length; i++) {
    //     children[i].style.backgroundColor = 'transparent';
    // }

    removeAllChildren('coder');
    renderCoders();

    removeAllChildren('task');
    renderTasks();
}

function removeAllChildren(containerName) {
    var container = document.getElementById(containerName);
    var childNodes = container.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        container.removeChild(childNodes[i]);
    }
}

function removeTasks() {
    var container = document.getElementById('coder');
}

function renderTasks() {
    for (var i = 0; i < coderList.length; i++) {
        renderTaskGroup(coderList[i].ownTaskList);
    }
    renderTaskGroup(leftTaskList);
}

//-------------------------------------------------------------------------------------------//

function output() {
    ttt = prompt("enter");

    if (ttt == "aaa") {
        document.getElementById("console").innerHTML = "输入正确！";
    }
}

//-------------------------------------------------------------------------------------------//

function Coder(name) {
    this.name = name;
    this.ownTaskList = [];

    this.getAllTime = function () {
        var sum = 0;
        for (var i = 0; i < this.ownTaskList.length; i++) {
            sum += this.ownTaskList[i].hour; // 这个是字符串相加还是数字？
        }
        return sum;
    };

    this.bind = function (task) {
        if (!contains(this.ownTaskList, task)) {
            this.ownTaskList.push(task);
            task.bind(this);
        }
    };

    this.unbind = function (task) {
        if (contains(this.ownTaskList, task)) {
            this.ownTaskList = removeByObj(this.ownTaskList, task);
            task.unbind();
        }
    };
}

function Task(name, hour) {
    this.name = name;
    this.hour = hour;
    this.owner = null;

    this.bind = function (coder) {
        if (this.owner !== coder) {
            this.unbind();
            this.owner = coder;
            coder.bind(this);
        }
    };

    this.unbind = function () {
        if (this.owner !== null) {
            var temp = this.owner;
            this.owner = null;
            temp.unbind(this);
        }
    };
}

//-------------------------------------------------------------------------------------------//

function readFile(filename) {
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var f = fso.OpenTextFile(filename, 1);
    var s = "";
    while (!f.AtEndOfStream)
        s += f.ReadLine() + "\n";
    f.Close();
    return s;
}

function removeByObj(array, obj) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === obj) {
            return array.splice(i, 1);
        }
    }
}

function contains(array, obj) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === obj) return true;
    }
    return false;
}