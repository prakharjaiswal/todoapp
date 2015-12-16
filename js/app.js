var Todoapp = function(element, list, properties) {
    this.list = (list && list instanceof Array) ? list : []
    this.properties = properties ? properties : {}
        //using template to  multiple instantiations
    var template = document.querySelector("template#todo-template");
    var content = document.importNode(template.content, true);
    content.querySelector(".title").innerHTML = properties.title ? properties.title : "Todo List";
    element.appendChild(content);
    // have selectors pre-caching 
    this.todo_form = element.getElementsByClassName("todo-form")[0];
    this.todo_input = element.getElementsByClassName("todo-input")[0];
    this.todo_list = element.getElementsByClassName("todo-list")[0];
    var self = this;

    this.todo_form.addEventListener("submit", function(event) {
        event.preventDefault();
        self.todo_input.value.trim().length ? self.addTask(self.todo_input.value) : false;
        self.todo_input.value = "";
    });
    return this;
};


Todoapp.prototype = {
    appendToList: function(index_added) {
        var self = this;
        var task = this.list[index_added]["task"];
        var node = document.createElement("li");
        var todo_item_element = document.createElement("todo-item");

        todo_item_element.setTodoList(self);
        todo_item_element.setTask(this.list[index_added]);
        node.appendChild(todo_item_element);
        this.todo_list.appendChild(node);
    },
    addTask: function(task) {
        return this.appendToList(this.list.push({
            task: task,
            status: 0 //status 0 to mark incomplete
        }) - 1);
    },
    removeTask: function(index) {
        return this.list.splice(index, 1);
    },
    editTask: function(index, edited) {
        return edited.trim().length > 0 ? (this.list[index]["task"] = edited) : this.removeTask(index);
    },
    markListItemCompleted: function(index, node) {

    },
    markTaskCompleted: function(index) {
        return this.list[index].status = 1;
    },
    tasks: function() {
        return JSON.parse(JSON.stringify(this.list));
    }

};

// Using custom elements to implement to-do list item
var todoitemproto = Object.create(HTMLElement.prototype);
todoitemproto.createdCallback = function() {
    var self = this;
    var template = document.importNode(document.getElementById("todo-item").content, true);
    this.appendChild(template);
    this.querySelector("span").addEventListener("blur", function(event) {
        var index = self.todoList.list.indexOf(self.task); //Calculate index everytime for splice may also happen over the list array
        this.innerHTML.trim().length ? self.todoList.editTask(index, this.innerHTML) : (self.todoList.removeTask() && this.parentNode.remove());
    });
    this.querySelector("button.delete").addEventListener("click", function(event) {
        var index = self.todoList.list.indexOf(self.task);
        self.todoList.removeTask(index);
        self.parentNode.remove();
    });
    this.querySelector("button.markcompleted").addEventListener("click", function(event){
        var index = self.todoList.list.indexOf(self.task);
        self.todoList.markTaskCompleted(index);
        self.querySelector("span").className += "completed";
        this.remove();
    });
};

// Mapping the item with its parent to-do list. Design can be improved a lot here
todoitemproto.setTodoList = function(list) {
    this.todoList = list;
};
todoitemproto.setTask = function(task) {
    this.task = task;
    this.querySelector("span").innerHTML = task.task;
};

document.registerElement("todo-item", {
    prototype: todoitemproto
});