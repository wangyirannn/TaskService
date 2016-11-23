var TaskPanel = (function (_super) {
    __extends(TaskPanel, _super);
    function TaskPanel() {
        _super.call(this);
        this.textField = [];
        this.nowtaskList = [];
        this.stageH = 1136;
        this.stageW = 640;
        this.myphoto = this.createBitmapByName("任务panel_png");
        this.cancelButton = this.createBitmapByName("取消_png");
        this.cancelButton.touchEnabled = true;
        this.addChild(this.myphoto);
        this.addChild(this.cancelButton);
        this.cancelButton.x = this.cancelButton.width;
        this.cancelButton.y = this.cancelButton.height;
        this.cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
    }
    var d = __define,c=TaskPanel,p=c.prototype;
    p.onChange = function (task) {
        if (task.status >= 2 && task.status < 4) {
            var k = 0;
            for (var i = 0; i < this.nowtaskList.length; i++) {
                if (task.id == this.nowtaskList[i].id) {
                    this.nowtaskList.splice(i, 1, task);
                    k++;
                }
            }
            if (k == 0) {
                this.nowtaskList.push(task);
            }
        }
        if (task.status == 4) {
            for (var i = 0; i < this.nowtaskList.length; i++) {
                if (task.id == this.nowtaskList[i].id) {
                    this.nowtaskList.splice(i, 1);
                }
            }
        }
    };
    p.onButtonClick = function () {
        this.onClose();
    };
    p.onShow = function () {
        var i = 0;
        for (i; i < this.nowtaskList.length && this.nowtaskList.length != 0; i++) {
            var tx = new egret.TextField();
            this.textField.push(tx);
            this.textField[i].text = this.nowtaskList[i].name + "  " + this.nowtaskList[i].desc + " " + this.nowtaskList[i].howso();
            this.addChild(this.textField[i]);
            this.textField[i].x = 50;
            this.textField[i].y = 100 + 100 * i;
        }
    };
    p.onClose = function () {
        for (var i = 0; i < this.textField.length; i++) {
            this.removeChild(this.textField[i]);
        }
        this.textField.splice(0, this.textField.length);
        this.parent.removeChild(this);
    };
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return TaskPanel;
}(egret.DisplayObjectContainer));
egret.registerClass(TaskPanel,'TaskPanel',["Observer"]);
var DialoguePanel = (function (_super) {
    __extends(DialoguePanel, _super);
    function DialoguePanel() {
        _super.call(this);
        this.NPCName = new egret.TextField();
        this.textField = new egret.TextField();
        this.stageH = 1136;
        this.stageW = 640;
        this.taskstatus = 0;
        this.isPanelShow = false;
        this.photo = this.createBitmapByName("对话框_png");
        this.x = 0;
        this.y = this.stageH - this.photo.height;
        this.acceptButton = this.createBitmapByName("接受_png");
        this.cancelButton = this.createBitmapByName("取消_png");
        this.finishButton = this.createBitmapByName("完成_png");
        this.acceptButton.x = this.finishButton.x = this.stageW - this.acceptButton.width * 3 - this.x;
        this.acceptButton.y = this.finishButton.y = this.stageH - this.acceptButton.height * 2 - this.y;
        this.cancelButton.x = this.stageW - this.acceptButton.width * 1.5 - this.x;
        this.cancelButton.y = this.stageH - this.acceptButton.height * 2 - this.y;
        this.NPCName.x = 30;
        this.NPCName.y = 50;
        this.textField.x = 30;
        this.textField.y = 100;
        this.textField.text = "";
        this.addChild(this.photo);
        this.addChild(this.NPCName);
        this.addChild(this.textField);
        this.addChild(this.cancelButton);
        this.cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.acceptButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
        this.finishButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
    }
    var d = __define,c=DialoguePanel,p=c.prototype;
    p.Close = function () {
        if (this.taskstatus == 1) {
            this.removeChild(this.acceptButton);
            this.taskstatus = 0;
            this.acceptButton.touchEnabled = false;
        }
        if (this.taskstatus == 3) {
            this.removeChild(this.finishButton);
            this.taskstatus = 0;
            this.finishButton.touchEnabled = false;
        }
        this.parent.removeChild(this);
        this.isPanelShow = false;
        this.NPCName.text = "";
        this.textField.text = "";
        this.cancelButton.touchEnabled = false;
    };
    p.showTask = function (task) {
        if (this.isPanelShow == true) {
            this.Close();
        }
        this.taskid = task.id;
        this.textField.text = task.desc;
        this.isPanelShow = true;
        this.cancelButton.touchEnabled = true;
        this.finishButton.touchEnabled = true;
        this.acceptButton.touchEnabled = true;
        if (task.status == 1) {
            this.addChild(this.acceptButton);
            this.taskstatus = 1;
        }
        if (task.status == 3) {
            this.addChild(this.finishButton);
            this.taskstatus = 3;
        }
    };
    p.onButtonClick = function () {
        if (this.taskstatus == 1) {
            var tas = TaskService.getInstance();
            tas.accept(this.taskid);
        }
        if (this.taskstatus == 3) {
            var tas = TaskService.getInstance();
            tas.finish(this.taskid);
        }
        this.Close();
    };
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return DialoguePanel;
}(egret.DisplayObjectContainer));
egret.registerClass(DialoguePanel,'DialoguePanel');
var TaskCondition = (function () {
    function TaskCondition() {
        this.total = -100;
    }
    var d = __define,c=TaskCondition,p=c.prototype;
    p.onAccept = function (Task) { };
    p.onsubmit = function (Task) { };
    p.onChange = function (taCC) {
    };
    return TaskCondition;
}());
egret.registerClass(TaskCondition,'TaskCondition');
var NPCTalkTaskCondition = (function (_super) {
    __extends(NPCTalkTaskCondition, _super);
    function NPCTalkTaskCondition() {
        _super.apply(this, arguments);
        this.total = 0;
    }
    var d = __define,c=NPCTalkTaskCondition,p=c.prototype;
    p.onAccept = function (Task) { };
    p.onsubmit = function (Task) { };
    p.onChange = function (taCC) {
        var cur = taCC.getcurrent();
        cur++;
        taCC.setcurrent(cur);
    };
    return NPCTalkTaskCondition;
}(TaskCondition));
egret.registerClass(NPCTalkTaskCondition,'NPCTalkTaskCondition');
var KillMonsterTaskCondition = (function (_super) {
    __extends(KillMonsterTaskCondition, _super);
    function KillMonsterTaskCondition(total) {
        _super.call(this);
        this.total = 0;
        this.total = total;
    }
    var d = __define,c=KillMonsterTaskCondition,p=c.prototype;
    p.onAccept = function (task) {
    };
    p.onsubmit = function (task) {
    };
    p.onChange = function (taCC) {
        var cur = taCC.getcurrent();
        cur++;
        taCC.setcurrent(cur);
    };
    return KillMonsterTaskCondition;
}(TaskCondition));
egret.registerClass(KillMonsterTaskCondition,'KillMonsterTaskCondition',["Observer"]);
var Task = (function () {
    function Task(id, name, desc, status, fromNPCid, toNPCid, condition, neTaId) {
        this.current = 0;
        this.total = -1;
        this.id = id;
        this.desc = desc;
        this.name = name;
        this.desc = desc;
        this.status = status;
        this.fromNPCid = fromNPCid;
        this.toNPCid = toNPCid;
        this.taskCondition = condition;
        this.total = this.taskCondition.total;
        this.nextTaskid = neTaId;
    }
    var d = __define,c=Task,p=c.prototype;
    p.getcurrent = function () {
        return this.current;
    };
    p.setcurrent = function (newcurreny) {
        this.current = newcurreny;
        this.checkStatus();
    };
    p.onCanAccept = function () {
        this.status = 1;
        var tasS = TaskService.getInstance();
        tasS.notify(this);
    };
    p.onAccept = function () {
        this.status = 2;
        var tasS = TaskService.getInstance();
        tasS.notify(this);
        this.checkStatus();
    };
    p.onReach = function () {
        this.status = 3;
        var tasS = TaskService.getInstance();
        tasS.notify(this);
    };
    p.onFinish = function () {
        this.status = 4;
        var tasS = TaskService.getInstance();
        tasS.notify(this);
        if (this.nextTaskid != null) {
            tasS.canAccept(this.nextTaskid);
        }
    };
    p.checkStatus = function () {
        if (this.current >= this.total) {
            this.onReach();
        }
    };
    p.getMyCondition = function () {
        return this.taskCondition;
    };
    p.howso = function () {
        var so = "(" + this.current + "/" + this.total + ")";
        if (this.total <= 0) {
            so = "";
        }
        return so;
    };
    return Task;
}());
egret.registerClass(Task,'Task',["TaskConditionContext"]);
var NPC = (function (_super) {
    __extends(NPC, _super);
    function NPC(i, dp) {
        _super.call(this);
        this.id = NPCs[i].id;
        this.name = NPCs[i].name;
        this.photo = this.createBitmapByName(NPCs[i].photo);
        this.addChild(this.photo);
        this.emoji = this.createBitmapByName(emojis[0].name);
        this.addChild(this.emoji);
        this.emoji.x += this.photo.width / 5;
        this.emoji.y -= this.photo.height / 4;
        this.panel = dp;
        this.wrod = NPCs[i].wrod;
    }
    var d = __define,c=NPC,p=c.prototype;
    p.onChange = function (task) {
        if (task.fromNPCid == this.id) {
            if (task.status == 1)
                this.emoji.texture = RES.getRes(emojis[1].name);
            if (task.status >= 2)
                this.emoji.texture = RES.getRes(emojis[0].name);
        }
        if (task.toNPCid == this.id && task.status > 1) {
            var i;
            for (i = 0; true; i++) {
                if (TaskStatus[TaskStatus[i]] == task.status) {
                    this.emoji.texture = RES.getRes(emojis[i].name);
                    break;
                }
            }
        }
    };
    p.onNPCClick = function () {
        var _this = this;
        var ruleOne = function (tasklist) {
            var task;
            for (var i = 0; i < tasklist.length; i++) {
                if (tasklist[i].toNPCid == _this.id) {
                    if (tasklist[i].status == 2 || tasklist[i].status == 3) {
                        task = tasklist[i];
                        return task;
                    }
                }
                if (tasklist[i].fromNPCid == _this.id) {
                    if (tasklist[i].status == 1) {
                        task = tasklist[i];
                        return task;
                    }
                }
            }
            return null;
        };
        this.panel.NPCName.text = this.name;
        var taskService = TaskService.getInstance();
        var task = taskService.getTaskBYCustomRule(ruleOne);
        if (task != null) {
            this.panel.showTask(task);
        }
        else {
            this.panel.cancelButton.touchEnabled = true;
            this.panel.textField.text = this.wrod;
        }
    };
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return NPC;
}(egret.DisplayObjectContainer));
egret.registerClass(NPC,'NPC',["Observer"]);
/*fail
interface  EventEmitter {

//    addObserver();
    notify();

}
*/
var TaskService = (function () {
    function TaskService() {
        this.observerList = [];
        this.taskList = [];
        TaskService.count++;
        if (TaskService.count > 1) {
            throw 'singleton';
        }
    }
    var d = __define,c=TaskService,p=c.prototype;
    TaskService.getInstance = function () {
        if (TaskService.instance == null) {
            TaskService.instance = new TaskService();
        }
        return TaskService.instance;
    };
    p.finish = function (id) {
        for (var _i = 0, _a = this.taskList; _i < _a.length; _i++) {
            var ta = _a[_i];
            if (ta.id == id) {
                ta.onFinish();
            }
        }
    };
    p.accept = function (id) {
        for (var _i = 0, _a = this.taskList; _i < _a.length; _i++) {
            var task = _a[_i];
            if (task.id == id) {
                task.onAccept();
            }
        }
    };
    p.canAccept = function (id) {
        for (var _i = 0, _a = this.taskList; _i < _a.length; _i++) {
            var task = _a[_i];
            if (task.id == id) {
                task.onCanAccept();
            }
        }
    };
    p.getTaskBYCustomRule = function (rule) {
        return rule(this.taskList);
    };
    p.notify = function (ta) {
        for (var _i = 0, _a = this.observerList; _i < _a.length; _i++) {
            var ob = _a[_i];
            ob.onChange(ta);
        }
    };
    TaskService.count = 0;
    return TaskService;
}());
egret.registerClass(TaskService,'TaskService');
var SenService = (function () {
    function SenService() {
        this.observerList = [];
    }
    var d = __define,c=SenService,p=c.prototype;
    p.notify = function (ta) {
        for (var _i = 0, _a = this.observerList; _i < _a.length; _i++) {
            var ob = _a[_i];
            ob.onChange(ta);
        }
    };
    return SenService;
}());
egret.registerClass(SenService,'SenService');
var MonsterKillButton = (function (_super) {
    __extends(MonsterKillButton, _super);
    function MonsterKillButton() {
        _super.apply(this, arguments);
    }
    var d = __define,c=MonsterKillButton,p=c.prototype;
    p.onButtonClick = function (ta) {
        console.log("经验+1");
        if (ta.status == 2) {
            this.mySS.notify(ta);
        }
    };
    return MonsterKillButton;
}(egret.DisplayObjectContainer));
egret.registerClass(MonsterKillButton,'MonsterKillButton');
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["UNACCEPTABLE"] = 0] = "UNACCEPTABLE";
    TaskStatus[TaskStatus["ACCEPTABLE"] = 1] = "ACCEPTABLE";
    TaskStatus[TaskStatus["DURING"] = 2] = "DURING";
    TaskStatus[TaskStatus["CAN_SUBMIT"] = 3] = "CAN_SUBMIT";
    TaskStatus[TaskStatus["SUBMITTED"] = 4] = "SUBMITTED";
})(TaskStatus || (TaskStatus = {}));
var Tasks = [
    { id: "task_00", name: "瞎**乱点", desc: "请跟右边的小女孩对话", status: 1, fromNPCid: "npc_0", toNPCid: "npc_1", condition: new NPCTalkTaskCondition(), nexttaskid: "task_01" },
    { id: "task_01", name: "使劲点，点！", desc: "请点击小怪物", status: 0, fromNPCid: "npc_1", toNPCid: "npc_1", condition: new KillMonsterTaskCondition(10), nexttaskid: null },
];
var NPCs = [
    { id: "npc_0", name: "屠龙宝刀点击也不送", wrod: "哦，天啊，去搞任务好吗？", photo: "npc0_01_png" },
    { id: "npc_1", name: "他说的是真的", wrod: "再这样没事儿点我算你骚扰哦", photo: "npc1__01_png" },
];
var emojis = [
    { name: "" },
    { name: "叹号_png" },
    { name: "问号灰_png" },
    { name: "问号黄_png" },
    { name: "" },
];
//# sourceMappingURL=Task.js.map