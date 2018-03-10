<template>
  <div id="app">
    <div id="direction-Key" v-if=directionKeyIsShow>
      <div class="direction-Key-btnbox">
        <div class="direction-Key-btn"
          @touchstart="directionTop()"
          @touchend="directionTopEnd()"
        >上</div>
        <div class="direction-Key-btn">下</div>
        <div class="direction-Key-btn">左</div>
        <div class="direction-Key-btn">右</div>
        <div class="close-direction-Key"
             @click="hideDirection()"
        >结束接管</div>
      </div>
      <div class="direction-Key-bottom">
      </div>
    </div>
    <div id="nameInput" :style="{top:canvasClickY,left:canvasClickX}"
    v-if="canvasClicked">
      <input type="text" v-model="canvasInput">
      <button @click="canvasAddDot()">确认</button>
      <i></i>
    </div>
    <div id="canvas-box">
      <canvas id="canvasbg" width="1024" height="682" ref="canvasbg"></canvas>
      <canvas id="canvas" width="1024" height="682" @click.stop="updateHandler($event)"
              ref="canvas"></canvas>
    </div>
    <div class="footer crosswise">
      <ul class="crosswise">
        <li class="footer-left crosswise">
          <span class="footer-img"></span>
          <ul class="lengthways">
            <li class="robot-details">
              <span>机器人1</span>&nbsp;&nbsp;
              ID: <span>123456</span>
              <span class="robot-state">运行</span>
            </li>
            <li class="robot-status">
              <ul class="crosswise">
                <li>
                  <i class="iconfont pad-wenduji" style="font-size: 16px"></i><span>40</span>℃
                </li>
                <li>
                  <i class="iconfont pad-dianchidianliang" style="font-size: 19px"></i><span>75</span>％
                </li>
                <li>
                  <i class="iconfont pad-panel" style="font-size: 19px"></i><span>2</span>m/s
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li class="footer-right">
          <ul class="crosswise">
            <li>
              <ul class="crosswise">
                <li>
                  <i class="iconfont pad-shexiangji"></i>
                  <p>打开视频</p>
                </li>
                <li style="margin-left: 30px;">
                  <i class="iconfont pad-play_fill"></i>
                  <p>开始</p>
                </li>
              </ul>
            </li>
            <li>
              <ul class="crosswise">
                <li @click="openLock()" v-if="!boxIsOpen">
                  <i class="iconfont pad-lock_fill"></i>
                  <p>开箱</p>
                </li>
                <li @click="closeLock()" v-if="boxIsOpen">
                  <i class="iconfont pad-lock_fill"></i>
                  <p>关箱</p>
                </li>
                <li style="margin:0 30px;">
                  <i class="iconfont pad-homepage_fill"></i>
                  <p>召回</p>
                </li>
                <li @click="showDirection()">
                  <i class="iconfont pad-yidong"></i>
                  <p>接管</p>
                </li>
              </ul>
            </li>
            <li>
              <i class="iconfont pad-ditu"></i>
              <p>绘制地图</p>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div id="card-task-manager" class="card"
         :class="{'cardActive':this.taskManagerIsShow}"
         :style="{top:cardTop,left:cardLeft}">
      <div class="card-task-manager-header card-header"
           v-finger:press-move="pressMoveCard.bind(this)">
        <span>当前任务</span>
        <p>
          <span class="iconfont pad-iconjia" @click="newTask()"></span>
          <span class="iconfont pad-liebiao" @click="taskList()"></span>
        </p>
      </div>
      <div class="card-task-manager-body card-body">
        <div class="card-task-manager-body-intro crosswise">
          <ul>
            <li v-if="Object.keys(taskManagerContent)[0]">
             <p>{{Object.keys(taskManagerContent)[0]}}</p>
              <p>{{showDotName}}</p>
            </li>
            <li v-if="!Object.keys(taskManagerContent)[0]">
              无任务
            </li>
            <li>
              暂停中
            </li>
          </ul>
          <i class="iconfont pad-shangxiazuoyou-" @click="taskDetails(Object.values(taskManagerContent)[0])"></i>
        </div>
        <div class="card-task-manager-body-control crosswise">
          <p @click="taskToggle()">
            <i class="iconfont pad-play_fill" ></i>
            <span>继续</span>
          </p>
          <p @click="taskEnd()">
            <i class="iconfont pad-weibiaoti517"></i>
            <span>终止</span>
          </p>
        </div>
      </div>
    </div>
    <div id="card-list" class="card" :class="{'cardActive':this.taskListIsShow}"
         :style="{top:cardTop,left:cardLeft}"
         >
      <div class="card-header"
           v-finger:press-move="pressMoveCard.bind(this)">
        <p v-if="taskListIsCompile"
           style="font-size: 18px;font-weight: 600;margin-left: 10px;"
           @click="taskListQuitCompile()"
        >取消</p>
        <p v-if="taskListIsIng"
           v-finger:tap="taskManager">
          <i class="iconfont pad-left"></i>
          <span>返回</span>
        </p>
        <p v-finger:tap="taskManager"
           v-if="!taskListIsCompile&&!taskListIsIng">
          <i class="iconfont pad-left"></i>
          <span>机器人管理</span>
        </p>
        <p v-finger:tap="listCompile"
           v-if="!taskListIsCompile&&!taskListIsIng">
          编辑
        </p>
      </div>
      <div class="card-list-body card-body"
           :class="{'chengHeight':taskListIsCompile||taskListIsIng}">
        <div class="card-list-shade" v-if="taskListIsCompile"></div>
        <p class="card-list-search" v-finger:tap="taskSearch">
          <i class="iconfont pad-sousuo1"></i>
          <span>搜索</span>
        </p>
        <div class="card-list-tab">
          <ul class="crosswise">
            <li class="card-list-tab-all"
                :class="{'tab-focus':!this.taskListIsIng}"
                v-finger:tap="taskTabAll">
              全部
            </li>
            <li class="card-list-tab-ing"
                :class="{'tab-focus':this.taskListIsIng}"
                v-finger:tap="taskTabIng">
              执行中
            </li>
          </ul>
        </div>
        <div class="card-list-box"
             :class="{'chengHeightBox':taskListIsCompile||taskListIsIng}">
          <ul>
            <li class="card-list-box-item crosswise"
                v-for="(value,key) in this.jsonTaskList"
                v-if="!taskListIsIng"
            @click="cardListBoxItemIsChecked(key)">
              <i class="iconfont"
                 :class="[taskCheckedArr.some(function(value){
                     return value===key;
                 }) ? 'pad-xuanzhong' : 'pad-xuanze']"
                 v-if="taskListIsCompile"></i>
              <div class="card-list-box-item-msg">
                <h3>{{key}}</h3>
                <p>配送中</p>
                <p class="detailed-information" @click="taskDetails(value,key,jsonTaskList)">详细信息</p>
              </div>
            </li>
            <li class="card-list-box-item crosswise"
                v-for="(value,index) in this.taskIngArr"
                v-if="taskListIsIng">
              <div class="card-list-box-item-msg">
                <h3>{{Object.keys(value)[0]}}</h3>
                <p>配送中</p>
                <p class="detailed-information" @click="taskDetails(Object.values(value)[0],index,taskIngArr)">详细信息</p>
                <span class="card-list-box-item-control iconfont pad-icon_threeline_fill"
                      v-finger:press-move="pressMove.bind(this,index,ingHeight)"
                      v-finger:touch-end="touchEnd.bind(this,index,taskIngArr)"></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="card-list-footer card-footer"
           v-if="taskListIsCompile||taskListIsIng"
      >
        <p v-if="taskListIsCompile"
           style="text-align: center"
           @click="addToTaskIngArr()"
        >添加到执行列表</p>
        <p v-if="taskListIsIng">循环执行</p>
      </div>
    </div>
    <div id="card-task" class="card" :class="{'cardActive':this.taskIsShow}"
         :style="{top:cardTop,left:cardLeft}">
      <div class="card-task-header card-header"
           v-if="!teskDetailsIsCompile"
           v-finger:press-move="pressMoveCard.bind(this)">
        <p @click="taskList()" style="width: 100px;">
          <i class="iconfont pad-left"></i>
          <span>全部任务</span>
        </p>
        <p @click="taskCompile()">
          编辑
        </p>
      </div>
      <div class="card-task-header card-header"
           v-if="teskDetailsIsCompile"
           v-finger:press-move="pressMoveCard.bind(this)">
        <p @click="taskCompileQuit()">
          <span>取消</span>
        </p>
        <p @click="taskCompileFinish()">
          <span>完成</span>
        </p>
      </div>
      <div class="card-task-body card-body">
        <div class="card-task-body-box">
          <ul>
            <li class="card-task-body-item crosswise" v-for="(value,index) in this.taskArr">
              <b></b>
              <img src="src/assets/start.png"></img>
              <img src="src/assets/yuan.png"></img>
              <img src="src/assets/end.png"></img>
              <div class="crosswise">
                <span v-if="Object.keys(value)[0]!=='未命名'">{{Object.keys(value)[0]}}</span>
                <div v-if="Object.keys(value)[0]==='未命名'"  class="crosswise">
                  <div class="sugBox" v-if="sugBoxIsShow">
                    <ul>
                      <li v-for="value in retrievedResult"
                          @click="chooseSug(value.title,value.location,taskArr)">
                        {{value.title}}
                      </li>
                    </ul>
                  </div>
                  <select name="bidChoose" v-model="cidSelected">
                    <option v-bind:value="'110100-110000221958'">第三极</option>
                    <option v-bind:value="'440300-440300221973'">腾讯大厦</option>
                  </select>
                  <input type="text"
                         v-model="sug">
                </div>
                <p>
                  <i class="iconfont pad-weibiaoti102"
                     @click="delTaskDot(index)"
                  v-if="teskDetailsIsCompile"></i>
                  <i class="iconfont pad-icon_threeline_fill"
                     v-finger:press-move="pressMove.bind(this,index,evtHeight)"
                     v-finger:touch-end="touchEnd.bind(this,index,taskArr)"
                     v-if="teskDetailsIsCompile"></i>
                </p>
              </div>
            </li>
            <li @click="addDot(taskArr)"
                v-if="teskDetailsIsCompile">
              <p class="card-task-body-add">
                <i class="iconfont pad-icon--1"></i>
                <span>添加途径点</span>
              </p>
            </li>
            <li v-if="!teskDetailsIsCompile"></li>
          </ul>
        </div>


      </div>
      <div class="card-task-footer card-footer">
        <p class="crosswise"
           v-if="!teskDetailsIsCompile&&taskListIsIng">
          <span>暂停</span>
          <span style="color:#FF3B30">终止</span>
        </p>
        <p class="crosswise" style="color:#FF3B30;justify-content: center"
           v-if="teskDetailsIsCompile||!taskListIsIng"
        @click="deleteThisTask()">
          删除任务
        </p>
      </div>
    </div>
    <div id="card-task-compile" class="card" :class="{'cardActive':this.taskCompileIsShow}"
         :style="{top:cardTop,left:cardLeft}">
      <div class="card-header"
           v-finger:press-move="pressMoveCard.bind(this)">
        <p @click="taskManager();newTaskCancel()">取消</p>
        <p @click="newTaskFinish();taskList()">完成</p>
      </div>
      <div class="card-task-compile-body">
        <div class="card-task-compile-body-box">
          <ul>
            <li class="card-task-compile-body-item crosswise"
                v-for="(value,index) in newTaskArr">
              <b></b>
              <img src="src/assets/start.png"></img>
              <img src="src/assets/yuan.png"></img>
              <img src="src/assets/end.png"></img>
              <div class="crosswise">
                <span v-if="Object.keys(value)[0]!=='未命名'">{{Object.keys(value)[0]}}</span>
                <div v-if="Object.keys(value)[0]==='未命名'"  class="crosswise">
                  <div class="sugBox" v-if="sugBoxIsShow">
                    <ul>
                      <li v-for="value in retrievedResult"
                          @click="chooseSug(value.title,value.location,newTaskArr)">
                        {{value.title}}
                      </li>
                    </ul>
                  </div>
                  <select name="bidChoose" id="bidChoose" v-model="cidSelected">
                    <option v-bind:value="'110100-110000221958'">第三极</option>
                    <option v-bind:value="'440300-440300221973'">腾讯大厦</option>
                  </select>
                  <input type="text"
                         v-model="sug">
                </div>

                <p>
                  <i class="iconfont pad-weibiaoti102"
                     @click="delDot(index)"></i>
                  <i class="iconfont pad-icon_threeline_fill"
                     v-finger:press-move="pressMove.bind(this,index,evtHeight)"
                     v-finger:touch-end="touchEnd.bind(this,index,newTaskArr)"></i>
                </p>
              </div>
            </li>
            <li @click="addDot(newTaskArr)">
              <p class="card-task-compile-body-add">
                <i class="iconfont pad-icon--1"></i>
                <span>添加途径点</span>
              </p>
            </li>
          </ul>
        </div>

      </div>
      <div class="card-task-compile-footer card-footer">
        <p @click="taskList();newTaskCancel()">删除任务</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  let ros = new ROSLIB.Ros({
    url : 'ws://192.168.1.101:9090'
  });

  ros.on('connection', function() {
    console.log('Connected to websocket server.');
    alert('握手成功')
  });

  ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
  });

  ros.on('close', function() {
    console.log('Connection to websocket server closed.');
  });
//  var cmdVel = new ROSLIB.Topic({
//    ros : ros,
//    name : '/cmd_vel',
//    messageType : 'geometry_msgs/Twist'
//  });
//----------------------发送消息
  //开关箱
  var LockClient = new ROSLIB.Service({
    ros : ros,
    name : '/LockControl',
    serviceType : 'shield_msgs/LockControl'
  });

  var request0 = new ROSLIB.ServiceRequest({
    id : '',
    cmd : 0  //cmd : 0 close the lock , 1 open the lock
  });
  var request1 = new ROSLIB.ServiceRequest({
    id : '',
    cmd : 1  //cmd : 0 close the lock , 1 open the lock
  });
  //方向控制
  var cmdVel = new ROSLIB.Topic({
    ros : ros,
    name : '/remote/cmd_vel',
    messageType : 'geometry_msgs/Twist'
  });

  var twistTop = new ROSLIB.Message({
    linear : {
      x : 0.1, //x=0.1 forward , x=-0.1 backup
      y : 0,
      z : 0
    },
    angular : {
      x : 0,
      y : 0,
      z : 0  //z=-0.1 right , z=0.1 left
    }
  });
  var posesClient = new ROSLIB.Service({
    ros : ros,
    name : '/RobotTask',
    serviceType : 'shield_msgs/RobotTask'
  });
  var listener = new ROSLIB.Topic({
    ros : ros,
    name : '/amcl_pose',
    messageType : 'geometry_msgs/PoseWithCovarianceStamped'
  });

  listener.subscribe(function(message) {
    console.log('topic',message.pose);
    //listener.unsubscribe();
  });
  // Subscribing to a Topic
//----------------------订阅消息
//  var listener = new ROSLIB.Topic({
//    ros : ros,
//    name :'/status_pub',
//    messageType : 'shield_msgs/Taskstatus'
//  });
//
//  listener.subscribe(function(message) {
//    console.log(message);
//    //this.currentState=message.data.Task_Status;
//    //listener.unsubscribe();
//  });
    //let taskList={"task_1":[{"第三极1101":[112.66699,60.22545]},{"第三极1102":[112.66699,60.22545]},{"第三极1103":[112.66699,60.22545]},{"第三极1104":[112.66699,60.22545]},{"第三极1105":[112.66699,60.22545]}],"task_2":[{"第三极2101":[112.66699,60.22545]},{"第三极2102":[112.66699,60.22545]},{"第三极2103":[112.66699,60.22545]},{"第三极2104":[112.66699,60.22545]},{"第三极2105":[112.66699,60.22545]}],"task_3":[{"第三极3101":[112.66699,60.22545]},{"第三极3102":[112.66699,60.22545]},{"第三极3103":[112.66699,60.22545]},{"第三极3104":[112.66699,60.22545]},{"第三极3105":[112.66699,60.22545]}],"task_4":[{"第三极2101":[112.66699,60.22545]},{"第三极2102":[112.66699,60.22545]},{"第三极2103":[112.66699,60.22545]},{"第三极2104":[112.66699,60.22545]},{"第三极2105":[112.66699,60.22545]}],"task_5":[{"第三极3101":[112.66699,60.22545]},{"第三极3102":[112.66699,60.22545]},{"第三极3103":[112.66699,60.22545]},{"第三极3104":[112.66699,60.22545]},{"第三极3105":[112.66699,60.22545]}],"task_6":[{"第三极2101":[112.66699,60.22545]},{"第三极2102":[112.66699,60.22545]},{"第三极2103":[112.66699,60.22545]},{"第三极2104":[112.66699,60.22545]},{"第三极2105":[112.66699,60.22545]}],"task_7":[{"第三极3101":[112.66699,60.22545]},{"第三极3102":[112.66699,60.22545]},{"第三极3103":[112.66699,60.22545]},{"第三极3104":[112.66699,60.22545]},{"第三极3105":[112.66699,60.22545]}]};
    //console.log(typeof (taskList));
    //localStorage.setItem('localTaskList',JSON.stringify(taskList) );
  import {getRecommend} from './jsonp/jsonp.js'
  export default {
    name: 'app',
    data(){
      return{
        taskManagerIsShow:true,//任务简介卡片是否显示
        taskManagerContent:{},//任务简介显示内容
        taskListIsShow:false,//任务列表卡片是否显示
        taskIsShow:false,//任务卡片是否显示
        taskCompileIsShow:false,//新建任务卡片是否显示
        taskListIsCompile:false,//任务列表是否在编辑状态
        taskListIsIng:false,//任务列表是否切换成ing列表
        teskDetailsIsCompile:false,//任务详情是否在编辑状态
        jsonTaskList:[],//从localStorage中获取到的全部任务
        taskArr:[],//任务详情初始态
        cidSelected:'110100-110000221958',//建筑选择初始态
        newTaskArr:[{'打印区':[116.307464,39.983776]},{'开机点':[116.307594,39.983773]}],//新建任务列表初始态
        newTaskState:true,//新建任务是否为编辑状态
        retrievedResult:[],//检索结果
        sugBoxIsShow:false,//检索结果栏是否显示
        sug:'',//搜索关键词
        evtBegin:0,//拖动的初始标识
        evtHeight:60,//新建任务列表拖动多少可以换位置
        ingHeight:110,//进行中任务列表拖动多少可以换位置
        evtBeginIndex:0,//初始下标
        evtBeginVal:'',//初始元素
        evtEndIndex:0,//最后下标
        taskIngArr:[],//执行中任务列表
        taskCheckedArr:[],//选择中任务列表
        taskIsChoose:'',//任务是否被选中
        whichTaskClicked:[],//哪一个任务被查看
        cardMoveX:0,//卡片移动的横向距离
        cardMoveY:0,//卡片移动的纵向距离
        cardTop:'30px',//卡片的初始位置
        cardLeft:'10px',//卡片的初始位置
        canvasClicked:false,
        canvasClickX:'400px',
        canvasClickY:'300px',
        canvasInput:'',
        canvasWidth:1024,
        canvasHeight:682,
        showDotName:'',//当前执行的点
        allDotCounter:0,//全部目标点计数器
        currentTaskCounter:0,//当前任务指针
        currentDotCounter:0,//当前目标点指针
        currentState:0,//当前目标点任务状态
        boxIsOpen:false,//箱门是否开启
        directionKeyIsShow:false//（接管）方向控制页面是否显示
      }
    },
    watch:{
      sug:function(val){
        this.sugBoxIsShow=true;
        let cid=this.cidSelected.split('-')[0];
        let bid=this.cidSelected.split('-')[1];
        getRecommend(cid,bid,val).then((res)=>{
          if(res.status===0){
            this.retrievedResult=res.data;
          }
        });
      },//模糊检索
      currentState:function () {
        /*if(this.currentState==6){
          var newPosition=Object.values(Object.values(this.taskIngArr[this.currentTaskCounter])[0][this.currentDotCounter])[0]
          var position={
            x : newPosition[0],
            y : newPosition[1],
            z : 0
          }
          var p0= new ROSLIB.Message({
            Floor : "dsj_11f",
            Style : "G",
            Pose : {
              position : position,
              orientation : {
                x : 0,
                y : 0,
                z : 0.707,
                w : 0.707
              }
            },
            Name : "hu"
          });
          var task_list=[]
          task_list.push(p0);
          var c_task= new ROSLIB.Message({
            Robot_ID : '11111',
            MSG_ID : 22222,
            Robot_Goals : task_list
          });


          var srvs = new ROSLIB.ServiceRequest({
            task : c_task
          });
          console.log('hahahhaha ')
          posesClient.callService(srvs, function(result) {
            console.log('Result for service call on '
              + posesClient.name
              + result.res);
          });
          this.currentState=0;
          let thisLength=Object.values(this.taskIngArr[this.currentTaskCounter])[0].length;
          console.log(this.currentTaskCounter,this.currentDotCounter);
          if(this.currentDotCounter===thisLength){
            this.currentTaskCounter++;
            this.currentDotCounter=0;
          }else{
            this.currentDotCounter++;
          }
        }*/
      },//根据机器人上传的订单状态决定是否下发新的任务点
    },
    created(){
      this.jsonTaskList=JSON.parse(localStorage.getItem('localTaskList'))
    },
    mounted(){
      this.funCanvas();
      this.$refs.canvasbg.width=this.canvasWidth;
      this.$refs.canvasbg.height=this.canvasHeight;
      this.$refs.canvas.width=this.canvasWidth;
      this.$refs.canvas.height=this.canvasHeight;
    },
    methods: {
      showDirection:function () {
        this.directionKeyIsShow=true
      },//显示接管页
      hideDirection:function () {
        this.directionKeyIsShow=false
      },//隐藏接管页
      directionTop:function () {
        var topInterval=setInterval(function () {
            cmdVel.publish(twistTop)
          },100)
      },//开始点击向上按钮
      directionTopEnd:function () {
        clearInterval(topInterval)
      },//松开向上按钮
      openLock:function () {
        LockClient.callService(request1, function(result) {
          console.log('Result for service call on '
            + LockClient.name);
        });
        this.boxIsOpen=true;
      },//开箱
      closeLock:function () {
        LockClient.callService(request0, function(result) {
          console.log('Result for service call on '
            + LockClient.name);
        });
        this.boxIsOpen=false;
      },//关箱
      pressMoveCard:function (evt) {
        evt.preventDefault();
        this.cardMoveX+=evt.deltaX;
        this.cardMoveY+=evt.deltaY;
        this.cardTop=parseFloat(this.cardTop)+evt.deltaY+'px';
        this.cardLeft=parseFloat(this.cardLeft)+evt.deltaX+'px';
      },//卡片移动计算函数
      pressMove: function(num,height,evt) {
        evt.preventDefault();
        this.evtBegin+=evt.deltaY;
        this.evtEndIndex=num+parseInt(this.evtBegin/height);
      },//任务序列移动距离计算函数
      touchEnd: function(index,arr,evt) {
        let beginNum=arr[index];
        if(this.evtEndIndex<=0){
          this.evtEndIndex=0;
        } else if(this.evtEndIndex>=arr.length-1){
          console.log(this.evtEndIndex);
          console.log(arr.length);
          this.evtEndIndex=arr.length-1;
        }
        this.$set(arr,index,arr[this.evtEndIndex]);
        this.$set(arr,this.evtEndIndex,beginNum);
        this.evtBegin=0;
        this.canvasUpdate(arr)

      },//任务序列数组顺序更新函数
      newTask:function () {
        console.log('新建任务');
        this.taskListIsShow=false;
        this.taskManagerIsShow=false;
        this.taskIsShow=false;
        this.taskCompileIsShow=true;
        this.canvasUpdate(this.newTaskArr)
      },//唤出新建任务卡片
      taskList:function () {
        console.log('任务列表');
        this.taskListIsShow=true;
        this.taskManagerIsShow=false;
        this.taskIsShow=false;
        this.taskCompileIsShow=false;
        this.canvasEmpty();
      },//唤出任务列表卡片
      taskDetails:function (data,index,arr,e) {
          this.taskListIsShow=false;
          this.taskManagerIsShow=false;
          this.taskIsShow=true;
          this.taskCompileIsShow=false;
          this.taskArr=data;
          this.whichTaskClicked=[];
          this.whichTaskClicked=[index,arr];
          this.canvasUpdate(this.taskArr)


      },//唤出任务详情卡片，并记录是哪一个任务
      taskListQuitCompile(){
        this.taskListIsCompile=false;
      },//任务列表退出编辑状态
      taskToggle:function () {
        if(this.currentTaskCounter<this.taskIngArr.length){
          this.taskManagerContent=this.taskIngArr[this.currentTaskCounter];
          var newPosition=Object.values(Object.values(this.taskIngArr[this.currentTaskCounter])[0][this.currentDotCounter])[0];
          var newName=Object.keys(Object.values(this.taskIngArr[this.currentTaskCounter])[0][this.currentDotCounter])[0];
          this.showDotName = newName;
          var position={
            x : newPosition[0],
            y : newPosition[1],
            z : 0
          }
          var p0= new ROSLIB.Message({
            Floor : "dsj_11f",
            Style : "M",
            Pose : {
              position : position,
              orientation : {
                x : 0,
                y : 0,
                z : 0.707,
                w : 0.707
              }
            },
            Name : newName
          });
          var task_list=[]
          task_list.push(p0);
          var c_task= new ROSLIB.Message({
            Robot_ID : '11111',
            MSG_ID : 22222,
            Robot_Goals : task_list
          });
          var srvs = new ROSLIB.ServiceRequest({
            task : c_task
          });
          posesClient.callService(srvs, function(result) {
            console.log('Result for service call on '
              + posesClient.name
              + result.res);
          });
          this.currentState=0;
          let thisLength=Object.values(this.taskIngArr[this.currentTaskCounter])[0].length;
          console.log(this.currentTaskCounter,this.currentDotCounter);
          if(this.currentDotCounter===thisLength-1){
            this.currentTaskCounter++;
            console.log(this.currentTaskCounter);
            this.currentDotCounter=0;
          }else{
            this.currentDotCounter++;
          }
//          if(this.currentState>6){
//            this.currentState=0
//          }
//        this.currentState++;


        }else{
          alert("再次点击会重复执行此轮任务");
          this.currentTaskCounter=0;
          this.currentDotCounter=0;
          //this.taskManagerContent=this.taskIngArr[this.currentTaskCounter]
        }
        console.log('任务开始暂停切换')
      },//切换任务的开始和暂停
      cardListBoxItemIsChecked:function(e){
        if(this.taskListIsCompile){
          if(this.taskCheckedArr.indexOf(e)==-1){
            this.taskCheckedArr.push(e);
          }else {
            this.taskCheckedArr.splice(this.taskCheckedArr.indexOf(e),1);
          }
        }
        //console.log(this.taskCheckedArr.indexOf(e));

      },//记录任务列表中哪一个任务被选中
      addToTaskIngArr:function () {
        let wantArr=this.taskCheckedArr.map(function(value){
          return {[value]:this.jsonTaskList[value]}
        }.bind(this));
        wantArr.forEach(function(val){
          this.taskIngArr.push(val);
        }.bind(this));
        var newPosition=Object.values(this.taskIngArr[this.currentTaskCounter])[0][this.currentDotCounter];
        console.log(newPosition);
        console.log(typeof (newPosition));
        console.log(Object.values(newPosition));
        console.log(Object.values(newPosition)[0][0]);
        this.taskManagerContent=this.taskIngArr[0];
        this.taskCheckedArr=[];
        this.taskListIsCompile=false;
        this.taskListIsIng=true;
        console.log(this.taskIngArr);
      },//将被选中的任务加入到进行中任务里
      taskEnd:function () {
        console.log('任务终止')
      },//任务终止
      taskManager:function () {
        console.log('任务简述');
        this.taskListIsShow=false;
        this.taskManagerIsShow=true;
        this.taskIsShow=false;
        this.taskCompileIsShow=false;
      },//唤出当前执行中任务卡片
      listCompile:function () {
        console.log('任务列表编辑');
        this.taskListIsCompile=true;
      },//任务列表进入编辑状态
      taskCompileQuit(){
        this.teskDetailsIsCompile=false;
      },//任务详情退出编辑状态
      taskCompileFinish:function () {
        this.teskDetailsIsCompile=false;
        localStorage.setItem('localTaskList',JSON.stringify(this.jsonTaskList) );
      },//任务详情编辑完成
      taskSearch:function () {
        console.log('任务搜索')
      },//任务检索函数
      taskTabAll:function () {
        console.log('全部任务');
        this.taskListIsIng=false;
      },//切换为全部任务列表
      taskTabIng:function () {
        console.log('进行中任务');
        this.taskListIsIng=true;
      },//切换为进行中任务列表
      taskCompile:function () {
        console.log('任务编辑');
        this.teskDetailsIsCompile=true;
      },//任务详情进入编辑状态
      newTaskCancel:function () {
        console.log('取消新建任务');
        this.newTaskArr=[{'打印区':[116.307464,39.983776]},{'开机点':[116.307594,39.983773]}];
        this.canvasEmpty();
      },//取消新建任务
      newTaskFinish:function () {
        let name1=Object.keys(this.newTaskArr[0])[0];
        let name2=Object.keys(this.newTaskArr[this.newTaskArr.length-1])[0];
        let name12=name1+"-"+name2+"("+this.newTaskArr.length+")";
        this.$set(this.jsonTaskList,name12,this.newTaskArr);
        this.newTaskArr=[{'打印区':[116.307464,39.983776]},{'开机点':[116.307594,39.983773]}];
        localStorage.setItem('localTaskList',JSON.stringify(this.jsonTaskList) );
        this.canvasEmpty()
      },//完成新建任务
      addDot:function (arr) {
        console.log(arr.length);
        if(this.newTaskState){
          arr.splice(length-1,0,{"未命名":[]});
          this.newTaskState=false;
          this.sugBoxIsShow=false;
          console.log(arr)
        }
      },//列表中添加地点
      delDot:function(index){
        this.newTaskArr.splice(index,1);
        this.newTaskState=true;
        this.sug='';
        this.retrievedResult=[];
        this.canvasUpdate(this.newTaskArr)
      },//newTaskArr列表中删除任务
      delTaskDot:function(index){
        this.taskArr.splice(index,1);
        this.newTaskState=true;
        this.canvasUpdate(this.taskArr)
      },//taskArr列表中删除任务
      chooseSug:function(sugname,sugval,arr){
        arr.splice(length-2,1,{[sugname]:[sugval.lng,sugval.lat]});
        this.newTaskState=true;
        this.sug='';
        this.retrievedResult=[];
      },//选择地点提示
      deleteThisTask:function(){
        this.$delete(this.whichTaskClicked[1],this.whichTaskClicked[0]);
        localStorage.setItem('localTaskList',JSON.stringify(this.jsonTaskList) );
        this.taskList();
      },//删除当前任务
      funCanvas:function (){
      let canvasbg = document.getElementById("canvasbg");
      let context = canvasbg.getContext("2d");
      let img = new Image();
      img.src = "src/map/dsj_11f.png";
      img.onload = function() {
        context.drawImage(img, 0, 0,canvasbg.width,canvasbg.height);//
      };
    },//加载canvas
      updateHandler:function (e) {
          if(this.taskCompileIsShow||this.teskDetailsIsCompile){
            let canvas = document.getElementById("canvas");
            // canvas 为你的 canvas ctx 变量
            const box = canvas.getBoundingClientRect();
            const mouseX = (e.clientX - box.left) * canvas.width / box.width;
            const mouseY = (e.clientY - box.top) * canvas.height / box.height;
            this.canvasClickX=mouseX-100+'px';
            this.canvasClickY=mouseY-43+'px';
            this.canvasClicked=true;
            console.log([mouseX, mouseY])
          }

    },//canvas上的点击事件
      canvasAddDot:function () {
          if(this.canvasInput!==''){
            if(this.taskCompileIsShow){
              this.newTaskArr.splice(length-1,0,{[this.canvasInput]:[parseFloat(this.canvasClickX)+100,parseFloat(this.canvasClickY)+43]});
              this.canvasUpdate(this.newTaskArr)
            }else if(this.teskDetailsIsCompile){
              this.taskArr.splice(length-1,0,{[this.canvasInput]:[parseFloat(this.canvasClickX)+100,parseFloat(this.canvasClickY)+43]})
              this.canvasUpdate(this.taskArr)
            }
          }
        this.canvasInput='';
        this.canvasClicked=false;
      },
      canvasUpdate:function (arr) {
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");
        console.log(canvas.width,canvas.height);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.font="30px Arial";
        for(let i in arr){
          ctx.strokeText(Object.keys(arr[i])[0],Object.values(arr[i])[0][0],Object.values(arr[i])[0][1]);
        }
      },
      canvasEmpty:function () {

        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,canvas.width,canvas.height);
      },
    }
  }
</script>
<style scoped lang="less" rel="stylesheet/less">
  @import "common/less/page.less";
  @import "common/icon.css";
</style>
