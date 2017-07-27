var isInSelectMode = false;

function inputTask() {
  var container = document.getElementById('task');
  var tasksString = prompt("inputTask");
  var tasks = new Array();
  tasks = tasksString.split(",");
  for (i = 0; i < tasks.length; i++) {
    var child = document.createElement('p');
    child.innerHTML = tasks[i] + " task";
    child.style.padding = 5;
    child.onmouseover = function() {
      // 用this而不是child，否则会绑定成最后一个
      this.style.backgroundColor = 'green'
    };
    child.onmouseout = function() {
      if (this.style.backgroundColor == 'green') {
        this.style.backgroundColor = 'transparent'
      }
    };
    child.onclick = function() {
      if (isInSelectMode) {
        isInSelectMode = false;
        this.style.backgroundColor = 'red';
        update();
      } else {
        isInSelectMode = true;
        this.style.backgroundColor = 'red';
      }
    }
    container.appendChild(child);
  }
}

function inputCoder() {
  var container = document.getElementById('coder');
  var codersString = prompt("inputCoder");
  var coders = new Array();
  coders = codersString.split(",");
  for (i = 0; i < coders.length; i++) {
    var child = document.createElement('p');
    child.innerHTML = coders[i] + " coder";
    child.style.padding = 5;
    child.onmouseover = function() {
      // 用this而不是child，否则会绑定成最后一个
      this.style.backgroundColor = 'blue'
    };
    child.onmouseout = function() {
      if (this.style.backgroundColor == 'blue') {
        this.style.backgroundColor = 'transparent'
      }
    };
    child.onclick = function() {
      if (isInSelectMode) {
        isInSelectMode = false;
        this.style.backgroundColor = 'red';
        update();
      } else {
        isInSelectMode = true;
        this.style.backgroundColor = 'red';
      }
    }
    container.appendChild(child);
  }
}

function update() {
  var children = document.getElementsByTagName('p');
  for (i = 0; i < children.length; i++) {
    children[i].style.backgroundColor = 'transparent';
  }
}

function output() {
  ttt = prompt("enter");

  if (ttt == "aaa") {
    document.getElementById("console").innerHTML = "输入正确！";
  }
}

function readFile(filename) {
  var fso = new ActiveXObject("Scripting.FileSystemObject");
  var f = fso.OpenTextFile(filename, 1);
  var s = "";
  while (!f.AtEndOfStream)
    s += f.ReadLine() + "\n";
  f.Close();
  return s;
}

// 1,2,3,4,5,6,7,8,9
