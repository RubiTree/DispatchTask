var isOnSelect = false;
var leftTaskList = [];
var coderList = [];
var currentChooseTask = null;
var currentChooseCoder = null;

//-------------------------------------------------------------------------------------------//

function inputTask() {
    // initTasksData(prompt("inputTask"));
    initTasksData(document.getElementById('input_task_area').value); // 不是自动提示的textContent
    renderTaskGroup(leftTaskList);
}

function initTasksData(tasksText) {
    if (tasksText === null || tasksText === "") return;

    var taskStringList = tasksText.split("\n");
    // 迷之不可以，代码提示完全不好用
    // for (var taskString in taskStringList) {
    //     var splitedTaskString = taskString.split(" ");
    //     leftTaskList.push({name: splitedTaskString[0], hour: splitedTaskString[1]});
    // }
    for (var i = 0; i < taskStringList.length; i++) {
        var splitedTaskString = taskStringList[i].split(" ");
        leftTaskList.push(new Task(splitedTaskString[0], parseInt(splitedTaskString[1])));
    }
}

function renderTaskGroup(taskGroup) {
    if (taskGroup.length === 0) return;

    var container = document.getElementById('task');
    // container.remove
    for (var i = 0; i < taskGroup.length; i++) {
        var child = document.createElement('div');

        var ownerName = "";
        if (taskGroup[i].owner !== null) {
            ownerName = taskGroup[i].owner.name;
        }
        child.innerHTML = taskGroup[i].name + " : " + taskGroup[i].hour + "h -> " + ownerName;
        child.style.padding = 10;

        child.onmouseover = function () {
            // 用this而不是child，否则会绑定成最后一个
            if (this.style.backgroundColor === "") {
                this.style.backgroundColor = 'green'
            }
        };
        child.onmouseout = function () {
            if (this.style.backgroundColor === 'green') {
                this.style.backgroundColor = ""
            }
        };

        child.onclick = (function (inner_task, inner_child) {
            return function () {
                if (isOnSelect) {
                    if (currentChooseCoder !== null) {
                        if (contains(leftTaskList, inner_task)) {
                            removeByObj(leftTaskList, inner_task);
                        }
                        currentChooseCoder.bind(inner_task);
                    } else {
                        // 点的是这个，而且这个之前被绑定了
                        if (currentChooseTask === inner_task && currentChooseTask.owner !== null) {
                            currentChooseTask.unbind();
                            if (!contains(leftTaskList, currentChooseTask)) {
                                leftTaskList.push(currentChooseTask);
                            }
                        }
                    }
                    exitSelectMode();
                    update();
                } else {
                    isOnSelect = true;
                    currentChooseTask = inner_task;
                    inner_child.style.backgroundColor = 'red';
                }
            }
        }(taskGroup[i], child));

        container.appendChild(child);
    }
}

//-------------------------------------------------------------------------------------------//

function inputCoder() {
    // initCodersData(prompt("inputCoder"));
    initCodersData(document.getElementById('input_coder_area').value);
    renderCoders();
}

function initCodersData(codersText) {
    if (codersText === null || codersText === "") return;

    var coderStringList = codersText.split("\n");
    for (var i = 0; i < coderStringList.length; i++) {
        coderList.push(new Coder(coderStringList[i]));
    }
}

function renderCoders() {
    if (coderList.length === 0) return;

    var container = document.getElementById('coder');
    for (var i = 0; i < coderList.length; i++) {
        var child = document.createElement('div');
        child.innerHTML = coderList[i].name + " : " + coderList[i].getAllTime() + "h";
        child.style.padding = 10;

        child.onmouseover = function () {
            // 用this而不是child，否则会绑定成最后一个
            if (this.style.backgroundColor === "") {
                this.style.backgroundColor = 'blue'
            }
        };
        child.onmouseout = function () {
            if (this.style.backgroundColor === 'blue') {
                this.style.backgroundColor = ""
            }
        };

        child.onclick = (function (inner_coder, inner_child) {
            return function () {
                if (isOnSelect) {
                    if (currentChooseTask !== null) {
                        if (contains(leftTaskList, currentChooseTask)) {
                            removeByObj(leftTaskList, currentChooseTask);
                        }
                        currentChooseTask.bind(inner_coder);
                    }
                    exitSelectMode();
                    update();
                } else {
                    isOnSelect = true;
                    currentChooseCoder = inner_coder;
                    inner_child.style.backgroundColor = 'red';
                }
            }
        }(coderList[i], child));

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
    removeAllChildren('task');

    renderCoders();
    renderTasks();
}

function removeAllChildren(containerName) {
    var container = document.getElementById(containerName);
    var childNodes = container.childNodes;
    var length = childNodes.length; // 得拿出来，length也在变
    for (var i = 0; i < length; i++) {
        container.removeChild(childNodes[0]); // 删除时index在变，不能用i
    }
}

function renderTasks() {
    for (var i = 0; i < coderList.length; i++) {
        renderTaskGroup(coderList[i].ownTaskList);
    }
    renderTaskGroup(leftTaskList);
}

//-------------------------------------------------------------------------------------------//

function output() {
    copyToClipboard(getDispatchTaskResult());
}

function getDispatchTaskResult() {
    return getDispatchedTaskInfo() + getUnDispatchedTaskInfo();
}

function getDispatchedTaskInfo() {
    var result = "任务分配情况<br /><br />";
    for (var i = 0; i < coderList.length; i++) {
        result += getOneCoderTaskInfo(coderList[i]);
    }
    return result;
}

function getOneCoderTaskInfo(coder) {
    if (coder.ownTaskList.length !== 0) {
        var result = coder.name + " (" + coder.getAllTime() + "h)<br />";
        for (var i = 0; i < coder.ownTaskList.length; i++) {
            result += coder.ownTaskList[i].name + " - " + coder.ownTaskList[i].hour + "h<br />";
        }
        return result + "<br />";
    } else {
        return "";
    }
}

function getUnDispatchedTaskInfo() {
    if (leftTaskList.length !== 0) {
        var coder = new Coder("<br />未分配任务 ");
        coder.ownTaskList = leftTaskList;
        return getOneCoderTaskInfo(coder);
    } else {
        return "";
    }
}

function copyToClipboard(txt) {
    txt=replaceAll(txt,'<br />','\n'); // 使用textarea时需要转，使用prompt则不用
    document.getElementById("output_area").innerHTML = txt;
}

//-------------------------------------------------------------------------------------------//

function Coder(name) {
    this.name = name;
    this.ownTaskList = [];

    this.getAllTime = function () {
        var sum = 0;
        for (var i = 0; i < this.ownTaskList.length; i++) {
            sum += this.ownTaskList[i].hour; // 这个是字符串相加还是数字？是字符串！
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
            removeByObj(this.ownTaskList, task);
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
        s += f.ReadLine() + "<br />";
    f.Close();
    return s;
}

function removeByObj(array, obj) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === obj) {
            array.splice(i, 1);
            break;
        }
    }
}

function contains(array, obj) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === obj) return true;
    }
    return false;
}

function replaceAll(source,oldString,newString){
    return source.replace(new RegExp(oldString,"gm"),newString);
}
