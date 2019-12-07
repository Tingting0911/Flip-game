//父元素 level
//渲染
//监听事件

//1 2*2->(1*2)*(1*2)  宽度：50%   高度：50%
//2 4*4->(2*2)*(2*2)
//3 6*6->(3*2)*(3*2)

var game={
  el:null,//父元素
  level:0,//游戏等级
  blocks:0,//游戏显示"牌"的总数
  gameWidth:600,//游戏区域高度
  gameHeight:600,//游戏区域高度
  dataArr:[],//数据数组，存放“牌”的信息
  judgeArr:[],//判断数组，存放被翻转的牌的信息
  picsNum:20,//牌的总数
  turnNum:0,
  init:function(options){
    //this
   this.initData(options);
   this.render();
   this.handle();
  },
  initData:function(options){
    var el=options.el;
    var level=options.level>3?3:options.level;
    var blocks=(level*2)*(level*2);
       
    this.el=el;
    this.level=level;
    this.blocks=blocks;
    this.getdataArr();
  },  
  render:function(){
    //渲染
    var blocks=this.blocks;
    var gameWidth=this.gameWidth;
    var gameHeight=this.gameHeight;
    var blockWidth=gameWidth/(this.level*2);
    var blockHeight=gameHeight/(this.level*2);
    var dataArr=this.dataArr;
    
    // 根据所需blocks数量，动态创建dom元素
    for(var i=0;i<blocks;i++){
        var info=dataArr[i];
      var oBlock=document.createElement('div');
      var oPic=document.createElement('div');
      oPic.style.backgroundImage= 'url(' + info.url + ')';
      oPic.setAttribute('class','pic');
      oBlock.setAttribute('class','block');
      oBlock.style.width=blockWidth+'px';
      oBlock.style.height=blockHeight+'px';
      oBlock.picid = info.id;
      oBlock.appendChild(oPic);
      this.el.appendChild(oBlock);
    }
    this.el.style.width=this.gameWidth+'px';
    this.el.style.height=this.gameWidth+'px';
  },
  handle:function(){
    /*
    *监听父元素的点击事件
    *通过事件委托判断点击的元素是否为 未翻转的牌
    */
   var self=this;
   this.el.onclick=function(e){
       var dom=e.target;
       var isBlock=dom.classList.contains('block');
       if(isBlock){
           self.handleBlock(dom);
       }
   }
  },
  handleBlock:function(dom){
    var picid=dom.picid;
    var judgeArr=this.judgeArr;
    var judgeLength=judgeArr.push({
        id:picid,
        dom:dom
    });
    dom.classList.add('on');
    
    if(judgeLength===2){
        //如果等于2判断翻开的两张牌是否一样
        this.judgePic();
    }
    this.judgewin();
  },
  judgePic:function(){
    // 两张牌相等，则class添加on，否则取消这两张牌的class中的on
    //如何判断是否相等？比较两个dom的picId是否相等
    var judgeArr = this.judgeArr; 
    // 判断两张图片是否相同
    var isSame=judgeArr[0].id===judgeArr[1].id;
   
    if(isSame){
        // 相同，则两张图片处于翻开状态，并记录翻开状态的牌的数量，用于判断是否所有的牌均处于翻开状态，即：判断是否成功
        this.turnNum+=2;
    }else{
        //先后翻开的牌中图片不相同，两张牌均需要去除on，回到反面朝上的状态
        var picDom1=judgeArr[0].dom;
        var picDom2=judgeArr[1].dom;
        // 这里使用setTimeout延迟，缓慢显示反面朝上的动作
        setTimeout(() => {
            picDom1.classList.remove('on');
            picDom2.classList.remove('on');
        }, 800);     
    }
    judgeArr.length=0;
  },
  judgewin:function(){   
      if(this.turnNum===this.blocks){
          alert("胜利啦！")
      }
  },
  getdataArr:function(){
    // 获取数据数组
    var halfBlocks=this.blocks/2;//得到排数的一半,需要的牌数量
    var dataArr=[];
    //使用randomArr函数打乱图像资源命名数组，并从头获取所需数量的图像（数量为halfBlocks）
    var randomArr=this.randomArr(this.picsNum,halfBlocks);
    var length=randomArr.length;
    for(var i=0;i<length;i++){
        var num=randomArr[i];
        // 这里使用info是为了方便下面比较两张图片是否相同，其中id相同，则图片相同
        var info={
            url: './images/' + num + '.png',
            id:num
        }
        // 相同info对象push两次，翻牌小游戏基本需要：图像必须两两相同
        dataArr.push(info,info);
    }
    //循环push之后,得到的是有序的数组，需要打乱顺序进行显示
    this.dataArr=this.shuffle(dataArr);
  },
  randomArr:function(count,halfBlocks){
    /*
    获取数字数组
    数组中的每一项为0 到count数字(count是所有资源图像的数量)
     */
    var arr=[];
    for(var i=0;i<count;i++){
        // 将所有牌的名字push进数组
        arr.push(i+1);
    }
    // 使用shuffle函数打乱所有牌，再使用splice函数抽取前halfblocks数量的牌
    return this.shuffle(arr).splice(0,halfBlocks);
  },
  shuffle:function(arr){
      return arr.sort(function(){
        // Math.random函数产生的是[0-1)范围内的数字，这里使用0.5-就可以随机产生正数和负数
          return 0.5-Math.random();
      });
  }
}

game.init({
    el: document.getElementById('game'),
    level: 3
})
