interface Observer {
     onChange(task:TaskConditionContext);
}


class TaskPanel extends egret.DisplayObjectContainer implements Observer{ 
    myphoto:egret.Bitmap;
    textField:egret.TextField[]=[];
    cancelButton:egret.Bitmap;
    nowtaskList:Task[]=[];
    stageH=1136;
    stageW=640;
    constructor(){
        super();
        this.myphoto=this.createBitmapByName("任务panel_png");
        this.cancelButton=this.createBitmapByName("取消_png");
        this.cancelButton.touchEnabled=true;
        this.addChild(this.myphoto);
        this.addChild(this.cancelButton);
        this.cancelButton.x=this.cancelButton.width;
        this.cancelButton.y=this.cancelButton.height;
        this.cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onButtonClick,this);

    }
    onChange(task:Task) {
        if(task.status>=2&&task.status<4){
            var k=0;
            for(let i=0;i<this.nowtaskList.length;i++){
                if(task.id==this.nowtaskList[i].id){
                    this.nowtaskList.splice(i,1,task);
                    k++;
                }
            }
            if(k==0){
                this.nowtaskList.push(task);
            }

        }if(task.status==4){
            for(let i=0;i<this.nowtaskList.length;i++){
                if(task.id==this.nowtaskList[i].id){
                    this.nowtaskList.splice(i,1);
                    
                }
            }
        }

    }
    onButtonClick() {
        this.onClose();
    }
    onShow() {
        var i=0;
        for(i;i<this.nowtaskList.length&&this.nowtaskList.length!=0;i++){
            var tx=new egret.TextField();
            this.textField.push(tx);
            this.textField[i].text=this.nowtaskList[i].name+"  "+this.nowtaskList[i].desc+" "+this.nowtaskList[i].howso();
            this.addChild(this.textField[i]);
            this.textField[i].x=50;
            this.textField[i].y=100+100*i;
        }
        
        
    }
    onClose() {
        for(let i=0;i<this.textField.length;i++){
            this.removeChild(this.textField[i]);
        }
        this.textField.splice(0,this.textField.length);
        this.parent.removeChild(this);
    }
     private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}

class DialoguePanel extends egret.DisplayObjectContainer{ 
    isPanelShow:boolean;
    NPCName:egret.TextField=new egret.TextField();
    textField:egret.TextField=new egret.TextField();
    photo:egret.Bitmap;
    stageH=1136;
    stageW=640;
    taskstatus=0;
    taskid:string;
    acceptButton:egret.Bitmap;
    cancelButton:egret.Bitmap;
    finishButton:egret.Bitmap;
    constructor(){
        super();
        this.isPanelShow=false;
        this.photo=this.createBitmapByName("对话框_png");
        this.x=0;
        this.y=this.stageH-this.photo.height;
        this.acceptButton=this.createBitmapByName("接受_png");
        this.cancelButton=this.createBitmapByName("取消_png");
        this.finishButton=this.createBitmapByName("完成_png");
        this.acceptButton.x=this.finishButton.x=this.stageW-this.acceptButton.width*3-this.x;
        this.acceptButton.y=this.finishButton.y=this.stageH-this.acceptButton.height*2-this.y;
        this.cancelButton.x=this.stageW-this.acceptButton.width*1.5-this.x;
        this.cancelButton.y=this.stageH-this.acceptButton.height*2-this.y;
        this.NPCName.x=30;
        this.NPCName.y=50;
        this.textField.x=30;
        this.textField.y=100;
        this.textField.text="";
        this.addChild(this.photo);
        this.addChild(this.NPCName);     
        this.addChild(this.textField); 
        this.addChild(this.cancelButton);
        this.cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.Close,this);
        this.acceptButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onButtonClick,this);
        this.finishButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onButtonClick,this);


    }
 
    public Close() {
      
             if(this.taskstatus==1){
              this.removeChild(this.acceptButton);
              this.taskstatus=0;
               this.acceptButton.touchEnabled=false;
          }
           if(this.taskstatus==3){
              this.removeChild(this.finishButton);
              this.taskstatus=0;
              this.finishButton.touchEnabled=false;
          }
          this.parent.removeChild(this);
          this.isPanelShow=false;
          this.NPCName.text="";
          this.textField.text="";
          this.cancelButton.touchEnabled=false;
        
    }
    public showTask(task:Task){
         if( this.isPanelShow==true ) {
              this.Close();
          }
        this.taskid=task.id;
        this.textField.text=task.desc;
        this.isPanelShow=true;  
        this.cancelButton.touchEnabled=true;   
        this.finishButton.touchEnabled=true;  
        this.acceptButton.touchEnabled=true;  
        if(task.status==1) {
            this.addChild(this.acceptButton);
            this.taskstatus=1;
        }
        if(task.status==3) {
            this.addChild(this.finishButton);
            this.taskstatus=3;
        }
 
    }
    onButtonClick() {
        if(this.taskstatus==1){
            var tas:TaskService=TaskService.getInstance();
            tas.accept(this.taskid);
          
            
        }
        if(this.taskstatus==3){
            var tas:TaskService=TaskService.getInstance();
            tas.finish(this.taskid);
        }
        this.Close();

    }
    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}

class TaskCondition {
    total:number=-100;
    onAccept(Task){}
    onsubmit(Task){}
    onChange(taCC:TaskConditionContext){
    }
}

class NPCTalkTaskCondition extends TaskCondition {

    total:number=0;
    onAccept(Task){}
    onsubmit(Task){}

    onChange(taCC:TaskConditionContext){
        var cur=taCC.getcurrent();
        cur++;
        taCC.setcurrent(cur);
    }
}


class KillMonsterTaskCondition extends TaskCondition implements Observer {

   
    total:number=0;
    constructor(total:number) {
        super();
        this.total=total;
    }

    onAccept(task:Task) {

    }
    onsubmit(task:Task) {

    }

    onChange(taCC:TaskConditionContext){

        var cur=taCC.getcurrent();
        cur++;
        taCC.setcurrent(cur);
    }
}

interface TaskConditionContext {
    getcurrent();
    setcurrent(number);
}


class Task implements TaskConditionContext{
 id:string;
 name:string;
 desc:string;
 status:TaskStatus;
 fromNPCid:string;
 toNPCid:string;

 current:number=0;
 total:number=-1;
 taskCondition:TaskCondition;

 nextTaskid:string;

constructor(id,name,desc,status,fromNPCid,toNPCid,condition,neTaId) {
    this.id=id;
    this.desc=desc;
    this.name=name;
    this.desc=desc;
    this.status=status;
    this.fromNPCid=fromNPCid;
    this.toNPCid=toNPCid;
    this.taskCondition=condition;
    this.total=this.taskCondition.total;
    this.nextTaskid=neTaId;

}
    getcurrent():number{
        return this.current;
    }
    setcurrent(newcurreny:number){
        this.current=newcurreny;
        this.checkStatus();
    }
     onCanAccept() {
        this.status=1;
        var tasS:TaskService=TaskService.getInstance();
        tasS.notify(this);
     
    }

    onAccept() {
        this.status=2;
        var tasS:TaskService=TaskService.getInstance();
        tasS.notify(this);
        this.checkStatus();
    }
    onReach() {
        this.status=3;
        var tasS:TaskService=TaskService.getInstance();
        tasS.notify(this);
    }

    onFinish(){
        this.status=4;
        var tasS:TaskService=TaskService.getInstance();
        tasS.notify(this);
        if(this.nextTaskid!=null) {
            tasS.canAccept(this.nextTaskid);
        }

    }

    checkStatus() {
        if(this.current>=this.total){
            this.onReach();
        }
    }
    getMyCondition() {
        return this.taskCondition;
    }
    howso():string{
        
        var so="("+this.current+"/"+this.total+")";
        if(this.total<=0) {
            so="";
        }


        return so;
    }
}


class NPC extends egret.DisplayObjectContainer implements Observer {
    id:string;
    name:string;
    emoji:egret.Bitmap;
    photo:egret.Bitmap;
    wrod:string;
    panel:DialoguePanel;
    constructor(i:number,dp:DialoguePanel) {
        super();
        this.id=NPCs[i].id;
        this.name=NPCs[i].name;
        this.photo=this.createBitmapByName(NPCs[i].photo);
        this.addChild(this.photo);
        this.emoji=this.createBitmapByName(emojis[0].name);
        this.addChild(this.emoji);
        this.emoji.x+=this.photo.width/5;
        this.emoji.y-=this.photo.height/4;
        this.panel=dp;
        this.wrod=NPCs[i].wrod;
    }
    onChange(task:Task) {
      if(task.fromNPCid==this.id) {
          if(task.status==1)
         this.emoji.texture=RES.getRes(emojis[1].name);   
         if(task.status>=2)   
          this.emoji.texture=RES.getRes(emojis[0].name);   
       }
       if(task.toNPCid==this.id&&task.status>1) {
           var i;
           for(i=0;true;i++) {
              if(TaskStatus[TaskStatus[i]]==task.status) {
                   this.emoji.texture=RES.getRes(emojis[i].name);
                   break;
               }
           }
          
       }
    }

    onNPCClick() {

        var ruleOne:Function=(tasklist):Task => {
        var task:Task;
        for(let i=0;i<tasklist.length;i++) {
             if(tasklist[i].toNPCid==this.id) {
                if(tasklist[i].status==2||tasklist[i].status==3){
                         task=tasklist[i];       
                         return task;         
            } 
             }
            if(tasklist[i].fromNPCid==this.id) {
                if(tasklist[i].status==1){
                         task=tasklist[i];  
                             return task;                      
                        }
            }
        }return null;  

    }
        this.panel.NPCName.text=this.name;
        var taskService:TaskService=TaskService.getInstance();
        var task=taskService.getTaskBYCustomRule(ruleOne);
      
        if(task!=null){
             this.panel.showTask(task);
        }else  {
            this.panel.cancelButton.touchEnabled=true;
            this.panel.textField.text=this.wrod;
        }
    }

    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

}
/*fail
interface  EventEmitter {

//    addObserver();
    notify();

}
*/

class TaskService {

    public observerList:Observer[]=[];
    public taskList:Task[]=[];
    private static instance;
    private static count =0;
    constructor (){
     
        TaskService.count++;
        if(TaskService.count >1){
            throw 'singleton';
        }

    }
    public static getInstance() {
        if(TaskService.instance ==null) {
            TaskService.instance =new TaskService();
        }
        return TaskService.instance;
    }

    finish (id:String) {
        for(let ta of this.taskList) {
            if(ta.id==id) {
                ta.onFinish();
            }
        }
    }
    accept (id:String) {
         for(let task of this.taskList) {
            if(task.id==id) {
                task.onAccept();
            }
        }

    }
    canAccept (id:String) {
         for(let task of this.taskList) {
            if(task.id==id) {
                task.onCanAccept();
            }
        }

    }
   
    public getTaskBYCustomRule(rule:Function):Task{
            return  rule(this.taskList);
    }

    notify(ta:Task) {
        for(let ob of this.observerList) {
            ob.onChange(ta);
        }
    }

}

class SenService {

    public observerList:Observer[]=[];

    notify(ta:Task) {
        for(let ob of this.observerList) {
            ob.onChange(ta);
        }
    }

}
class MonsterKillButton extends egret.DisplayObjectContainer{
    photo:egret.Bitmap;
    mySS:SenService;

    onButtonClick(ta:Task) {
        if(ta.status==2){
            this.mySS.notify(ta);
        }
      
    }

}


enum TaskStatus {
    UNACCEPTABLE=0,
    ACCEPTABLE=1,
    DURING=2,
    CAN_SUBMIT=3,
    SUBMITTED=4,
}

let Tasks= [
    {id:"task_00",name:"",desc:"找到NPC2",status:1,fromNPCid:"npc_0",toNPCid:"npc_1",condition:new NPCTalkTaskCondition(),nexttaskid:"task_01"},
    {id:"task_01",name:"",desc:"请点击怪物10次",status:0,fromNPCid:"npc_1",toNPCid:"npc_1",condition:new KillMonsterTaskCondition(10),nexttaskid:null},
]

let NPCs=[
    {id:"npc_0",name:"提示",wrod:"",photo:"npc0_01_png"},
    {id:"npc_1",name:"提示",wrod:"",photo:"npc1__01_png"},
]

let emojis=[
    {name:""},
    {name:"叹号_png"},
    {name:"问号灰_png"},
    {name:"问号黄_png"},
    {name:""},
]