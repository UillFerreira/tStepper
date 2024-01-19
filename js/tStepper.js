/*
Example:
    var r = new tStepper({
        "type" : "vertical",
        "steps" : [
            {"title": "Queue 1", "description" : "blalsdaskm kasdaks kasdkamdd", "time" : ""},
            {"title": "Queue 2", "description" : "blalsdaskm kasdaks kasdkamdd", "time" : ""},
            {"title": "Queue 3", "description" : "blalsdaskm kasdaks kasdkamdd", "time" : "", "active" : true},
            {"title": "Queue 4", "description" : "blalsdaskm kasdaks kasdkamdd", "time" : ""}
        ]
    });

*/
function tStepper (properties) {
    this.classType = "tStepper";
    // Default type
    this.type = "vertical";
    // Dafault active
    this.activePos = undefined;
    if (properties.steps != undefined) { 
        this.steps          = properties.steps;
        this.stepsLength    = (this.steps).length;
        this.content        = document.createElement("div");
        this.content.appendChild(this.createStepper(this.steps));
        if(this.activePos != undefined && this.steps[this.activePos].active != undefined) this.setActive(this.steps[this.activePos].title);
    }
    if(properties.type != undefined) this.type = properties.type;
    console.log(properties);
}
tStepper.constructor = tStepper;

tStepper.prototype.createStepper = function (steps) {
    let ol = document.createElement("ol");
    let act;
    ol.setAttribute("class", "c-timeline");

    for ( let i = 0; i < steps.length; i++) {
        ol.appendChild(this.createList(steps[i]));
        if ((steps[i].active != undefined) && steps[i].active === true) this.activePos = i;
    }
    return ol;
}
tStepper.prototype.createList = function (step) {
    // li
    let li = document.createElement("li");
    li.setAttribute("class", "c-timeline__item");
    // div
    let div = document.createElement("div");
    div.setAttribute("class", "c-timeline__content");
    // h3
    let h3 = document.createElement("div");
    h3.setAttribute("class", "c-timeline__title");
    h3.innerText = step.title;
    // p
    let p = document.createElement("p");
    p.setAttribute("class", "c-timeline__desc");
    p.innerText = step.description;
    // time
    let time = document.createElement("time");
    time.innerText = step.time;

    li.appendChild(div);
    div.appendChild(h3);
    div.appendChild(p);
    li.appendChild(time);

    return li;
}

tStepper.prototype.returnElm = function (pos) {
    return this.content.children[0].children[pos];
}
tStepper.prototype.updateName = function (pos, value) {
    let elm     = this.returnElm(pos);
    let div     = elm.children[0];
    let title   = div.children[0];
    title.innerText         = value;
    // Update json
    this.steps[pos]["title"] = value;

}
tStepper.prototype.updateDescription = function (pos, value) {
    let elm     = this.returnElm(pos);
    let div     = elm.children[0];
    let desc    = div.children[1];
    desc.innerText                  = value;
    // Update json
    this.steps[pos]["description"]  = value;

}
tStepper.prototype.updateTime = function (pos, value) {
    let elm         = this.returnElm(pos);
    let time        = elm.children[1];
    time.innerText  = value;
    // Update json
    this.steps[pos]["time"]  = value;
}
tStepper.prototype.destroyList = function () {
    while(this.content.firstChild) {
        this.content.removeChild(this.content.lastChild);
    }
}
tStepper.prototype.updateAll = function (steps) {
    this.steps = steps;
    this.destroyList();
    this.content.appendChild(this.createStepper(steps));
    if(this.activePos != undefined && this.steps[this.activePos].active != undefined) this.setActive(this.steps[this.activePos].title);
}
tStepper.prototype.updateStep = function (title, step) {
    for ( let i = 0; i < this.steps.length; i++) {
        if (title == this.steps[i]["title"]) {
            this.updateName(i, step.title);
            this.updateDescription(i, step.description);
            this.updateTime(i, step.time);
            break;
        }
    }
}
tStepper.prototype.findByName = function (title) {
    for ( let i = 0; i < this.steps.length; i++) {
        if (title == this.steps[i]["title"]) {
            return i;
            break;
        } 
    }
    return false;
}
tStepper.prototype.setActive = function (title) {
    var act     = this.findByName(title);
    if (act === false) {
        console.error("Did not find the element with the title that was sent, please check if the title is correct. Title sent to function \"%s\" was \"%s\"", "setActive", title);
        return false;
    }
    for ( var i = 0; i < this.steps.length; i++) {
        if (i < act) {
            let elm = this.returnElm(i);
            elm     = elm.children[0];
            elm.setAttribute("class", "c-timeline__content c-timeline__content_previous");
        } 
        if (i > act) {
            let elm = this.returnElm(i);
            elm     = elm.children[0];
            elm.setAttribute("class", "c-timeline__content");
        }
        if (act == i) {
            let elm = this.returnElm(i);
            elm     = elm.children[0];
            elm.setAttribute("class", "c-timeline__content c-timeline__content_active");
            this.activePos = i;
        }
    }
}
