// phina.js をグローバル領域に展開
phina.globalize();

var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 960;

var x=[];
var y=[];

var coins =["coin1","coin5","coin50","coin100","coin10","coin500"];
var price =[1,5,50,100,10,500];

var ans=0;
var time=0;

var countdown;

var score=0;
var input = 0;

var startlevel=5;
var level;
var speed = 0.5;
//var scale = 0.2;

var addpoint=0;

var clear=0;

var up=true;

var ASSETS = {
  image: {
    'coin1': 'img/money_coin_heisei_1.png',
    'coin5': 'img/money_coin_blank_5.png',
    'coin10': 'img/money_coin_heisei_10.png',
    'coin50': 'img/money_coin_heisei_50.png',
    'coin100': 'img/money_coin_heisei_100.png',
    'coin500': 'img/money_coin_reiwa_500_new.png',
    'maru': 'img/mark_maru.png',
    'batsu': 'img/mark_batsu.png',
  },
  sound: {
    'bgm1': 'sound/bgm1.mp3',
    'bgm2': 'sound/bgm2.mp3',
    'timer': 'sound/timer.mp3',
    'button': 'sound/button.mp3',
    'maru': 'sound/maru.mp3',
    'batsu': 'sound/batsu.mp3',

  },
};

// Title クラスを定義
phina.define('Title', {
  superClass: 'CanvasScene',
  init: function() {
    this.superInit();
    var self=this;
    SoundManager.playMusic('bgm1');

    // 背景色を指定
    this.backgroundColor = '#444';
    // ラベルを生成

    this.label = Label({
      text:'Count Coins',
      fontSize: 48,
      x:this.gridX.center(),
      y:this.gridY.center()-50,
      fill:'white',
      stroke:'blue',
      strokeWidth:5,
    }).addChildTo(this);

    this.label = Label({
      text:'Tap to Start',
      fontSize: 32,
      x:this.gridX.center(),
      y:this.gridY.center()+50,
      fill:'white',
    }).addChildTo(this);

    var button = Button({
      x: 320,             // x座標
      y: 120,             // y座標
      width: 240,         // 横サイズ
      height: 120,        // 縦サイズ
      text: "設定",     // 表示文字
      fontSize: 48,       // 文字サイズ
      fontColor: 'black', // 文字色
      cornerRadius: 10,   // 角丸み
      fill: 'lightgray',    // ボタン色
      stroke: 'black',     // 枠色
      strokeWidth: 5,     // 枠太さ
    }).addChildTo(this)
    .onpointstart = function() {
      SoundManager.play('button');
      self.exit("setting");
    };

    var button = Button({
      x: 320,             // x座標
      y: 480+350,             // y座標
      width: 320,         // 横サイズ
      height: 160,        // 縦サイズ
      text: "スタート",     // 表示文字
      fontSize: 48,       // 文字サイズ
      fontColor: 'blue', // 文字色
      cornerRadius: 10,   // 角丸み
      fill: 'skyblue',    // ボタン色
      stroke: 'blue',     // 枠色
      strokeWidth: 5,     // 枠太さ
    }).addChildTo(this)
    .onpointstart = function() {
      level=startlevel;
      self.exit("main");
    };

    score=0;
    clear=0;


    for(let i in coins){
      var coin = Sprite(coins[i])
      .addChildTo(this)
      .setPosition(this.gridX.center()-250+100*i, this.gridY.center()-175)
      .setScale(0.2);
    }

    for(let i in coins){
      var coin = Sprite(coins[i])
      .addChildTo(this)
      .setPosition(this.gridX.center()+250-100*i, this.gridY.center()+175)
      .setScale(0.2);
    }


  },

  onpointstart: function() {
    level=startlevel;
    this.exit("main");
  },

});

// SettingScene
phina.define('Setting', {
  superClass: 'CanvasScene',
  init: function() {
    this.superInit();
    var self=this;

    // 背景色を指定
    this.backgroundColor = '#444';
    // ラベルを生成


    this.label = Label({
      text:'設定',
      fontSize: 64,
      x:this.gridX.center(),
      y:64,
      fill:'white',
      stroke:'black',
      strokeWidth:5,
    }).addChildTo(this);

    this.label = Label({
      text:'Level\n(1-20)',
      fontSize: 32,
      x:this.gridX.center(),
      y:240-64,
      fill:'white',
      stroke:'black',
      strokeWidth:5,
    }).addChildTo(this);

    this.label = Label({
      text:'Speed\n(0.0-2.0)',
      fontSize: 32,
      x:this.gridX.center(),
      y:480-64,
      fill:'white',
      stroke:'black',
      strokeWidth:5,
    }).addChildTo(this);

    this.label = Label({
      text:'レベル固定モード',
      fontSize: 42,
      x:SCREEN_WIDTH/3+20,
      y:SCREEN_HEIGHT*2/3,
      fill:'white',
      stroke:'black',
      strokeWidth:5,
    }).addChildTo(this);

    var label1 = Label({x:320,y:240+16,fontSize:64,fill:'white',text:startlevel}).addChildTo(this);
    var label2 = Label({x:320,y:480+16,fontSize:64,fill:'white',text:speed}).addChildTo(this);

    var button = Button({
      x: 320,             // x座標
      y: 480+350,             // y座標
      width: 320,         // 横サイズ
      height: 160,        // 縦サイズ
      text: "戻る",     // 表示文字
      fontSize: 48,       // 文字サイズ
      fontColor: 'black', // 文字色
      cornerRadius: 10,   // 角丸み
      fill: 'lightgray',    // ボタン色
      stroke: 'black',     // 枠色
      strokeWidth: 5,     // 枠太さ
    }).addChildTo(this)
    .onpointstart = function() {
      self.exit("title");
    };

    var button1 = Button({
      x: 160-10,             // x座標
      y: 240-10,             // y座標
      width: 160,         // 横サイズ
      height: 160,        // 縦サイズ
      text: "-",     // 表示文字
      fontSize: 48,       // 文字サイズ
      fontColor: 'black', // 文字色
      cornerRadius: 10,   // 角丸み
      fill: 'lightgray',    // ボタン色
      stroke: 'black',     // 枠色
      strokeWidth: 5,     // 枠太さ
    }).addChildTo(this)
    .onpointstart = function() {
      if(startlevel>1){startlevel--;}
      label1.text=startlevel;
      SoundManager.play("button");
    };

    var button2 = Button({
      x: 480+10,             // x座標
      y: 240-10,             // y座標
      width: 160,         // 横サイズ
      height: 160,        // 縦サイズ
      text: "+",     // 表示文字
      fontSize: 48,       // 文字サイズ
      fontColor: 'black', // 文字色
      cornerRadius: 10,   // 角丸み
      fill: 'lightgray',    // ボタン色
      stroke: 'black',     // 枠色
      strokeWidth: 5,     // 枠太さ
    }).addChildTo(this)
    .onpointstart = function() {
      if(startlevel<30){startlevel++;}
      label1.text=startlevel;
      SoundManager.play("button");
    };

    var button3 = Button({
      x: 160-10,             // x座標
      y: 480-10,             // y座標
      width: 160,         // 横サイズ
      height: 160,        // 縦サイズ
      text: "-",     // 表示文字
      fontSize: 48,       // 文字サイズ
      fontColor: 'black', // 文字色
      cornerRadius: 10,   // 角丸み
      fill: 'lightgray',    // ボタン色
      stroke: 'black',     // 枠色
      strokeWidth: 5,     // 枠太さ
    }).addChildTo(this)
    .onpointstart = function() {
      if(speed>0){speed-=0.1;}
      speed = Math.round(speed*10)/10;
      label2.text=speed.toFixed(1);
      SoundManager.play("button");
    };

    var button4 = Button({
      x: 480+10,             // x座標
      y: 480-10,             // y座標
      width: 160,         // 横サイズ
      height: 160,        // 縦サイズ
      text: "+",     // 表示文字
      fontSize: 48,       // 文字サイズ
      fontColor: 'black', // 文字色
      cornerRadius: 10,   // 角丸み
      fill: 'lightgray',    // ボタン色
      stroke: 'black',     // 枠色
      strokeWidth: 5,     // 枠太さ
    }).addChildTo(this)
    .onpointstart = function() {
      if(speed<2){speed+=0.1;}
      speed = Math.round(speed*10)/10;
      label2.text=speed.toFixed(1);
      SoundManager.play("button");
    };

    var button = Button({
      x: 480+10,             // x座標
      y: SCREEN_HEIGHT*2/3,             // y座標
      width: 100,         // 横サイズ
      height: 100,        // 縦サイズ
      text: "□",     // 表示文字
      fontSize: 48,       // 文字サイズ
      fontColor: 'black', // 文字色
      cornerRadius: 10,   // 角丸み
      fill: 'lightgray',    // ボタン色
      stroke: 'black',     // 枠色
      strokeWidth: 5,     // 枠太さ
    }).addChildTo(this)
    .onpointstart = function() {
      up = !up;
      if(up){
        this.text="□";
      }
      else{
        this.text="☑";
      }
      SoundManager.play("button");
    };

  },
});

// MainScene クラスを定義
phina.define('Main', {
  superClass: 'CanvasScene',
  init: function() {
    this.superInit();
    var self=this;
    var val=[];

    // 背景色を指定
    this.backgroundColor = '#444';

    var how = Label({x:320,y:this.gridY.center()-50,fontSize:32,fill:'white',text:'How Much?'}).addChildTo(this);
    var howtime=15;

    SoundManager.playMusic("bgm2");

    ans = 0;

    time = level *30;
    //time = 150 + (level-5)*30*0.5; // level * fps

    var gauge = Gauge({
      x: SCREEN_WIDTH/2, y: SCREEN_HEIGHT-15,        // x,y座標
      width: SCREEN_WIDTH,            // 横サイズ
      height: 30,            // 縦サイズ
      cornerRadius: 0,      // 角丸み
      maxValue: time,         // ゲージ最大値
      value: time,         // ゲージ初期値
      fill: 'white',         // 後ろの色
      gaugeColor: 'skyblue', // ゲージ色
      stroke: 'silver',      // 枠色
      strokeWidth: 5,        // 枠太さ
    }).addChildTo(this);

    var label = Label({x:320,y:SCREEN_HEIGHT-16,fontSize:32,fill:'black',text:time}).addChildTo(this);

    how.update=function(){
      if(how.alpha>0){
        how.alpha = how.alpha- 0.03;
      }
      if(how.alpha<=0){
        how.alpha=0;
      }
    }


    gauge.update=function(){
      gauge.value --;
      label.text= (Math.floor(gauge.value/30*10)/10).toFixed(1) ;

      /*
      if(howtime==0){
      how.text="";
    }
    else{
    howtime--;
  }*/
}


gauge.onempty = function(){
  clearInterval(countdown);
  self.exit();
};

var group = DisplayElement().addChildTo(this);


for(var i=0; i<level; i++){
  var r = Math.floor( Math.random() * coins.length );
  val.push(r);
}

val.sort();
val.reverse();

for(var n in val){
  var angle = Math.floor( Math.random() * 360 );
  var sprite = Sprite(coins[val[n]]).addChildTo(group)
  .setPosition(
    55+Math.floor(Math.random() * (SCREEN_WIDTH-110)),
    55+Math.floor(Math.random() * (SCREEN_HEIGHT-110-30)))
    .setScale(0.2);
    x[n] = 10 * Math.cos( angle * (Math.PI / 180) ) ;
    y[n] = 10 * Math.sin( angle * (Math.PI / 180) ) ;
    ans += price[val[n]];
    console.log(sprite.width);
  }

  console.log(ans+'円');


  group.update= function(){
    for(i=0;i<group.children.length;i++){
      group.children[i].moveBy(x[i]*speed, y[i]*speed);

      if (group.children[i].x < 0+group.children[i].width*0.1 || group.children[i].x>SCREEN_WIDTH-group.children[i].width*0.1) {
        x[i] *= -1;
      }

      if (group.children[i].y < 0+group.children[i].height*0.1 || group.children[i].y>SCREEN_HEIGHT-group.children[i].height*0.1-30) {
        y[i] *= -1;
      }
    }
  }

},

onpointstart: function() {
  clearInterval(countdown);
  this.exit();
},

});

// Result クラスを定義
phina.define('Answer', {
  superClass: 'CanvasScene',
  init: function() {
    // 親クラス初期化
    this.superInit();
    var self=this;
    SoundManager.pauseMusic("bgm2");
    SoundManager.playMusic('timer');
    // 背景色を指定
    this.backgroundColor = '#444';
    // ラベルを生成
    this.label = Label('答えを入力').addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = 75; // y 座標
    this.label.fill = 'white'; // 塗りつぶし色


    input=0;

    var label = Label({x:320,y:150,fontSize:64,fill:'white',text:input}).addChildTo(this);


    var gauge2 = Gauge({
      x: SCREEN_WIDTH/2, y: SCREEN_HEIGHT-15,        // x,y座標
      width: SCREEN_WIDTH,            // 横サイズ
      height: 30,            // 縦サイズ
      cornerRadius: 0,      // 角丸み
      maxValue: 150,         // ゲージ最大値
      value: 150,         // ゲージ初期値
      fill: 'white',         // 後ろの色
      gaugeColor: 'skyblue', // ゲージ色
      stroke: 'silver',      // 枠色
      strokeWidth: 5,        // 枠太さ
    }).addChildTo(this);

    var piecegroup = DisplayElement().addChildTo(this);

    //ボタンOK
    var button = Button({
      x: 320+175,             // x座標
      y: 480+350,             // y座標
      width: 160,         // 横サイズ
      height: 160,        // 縦サイズ
      text: "OK",     // 表示文字
      fontSize: 48,       // 文字サイズ
      fontColor: 'red', // 文字色
      cornerRadius: 10,   // 角丸み
      fill: "lightsalmon",    // ボタン色
      stroke: 'red',     // 枠色
      strokeWidth: 5,     // 枠太さ
    }).addChildTo(piecegroup)
    .onpointstart = function() {

      SoundManager.stopMusic("timer");

      clearInterval(countdown);
      self.exit("result");

    };

    //ボタンBACK
    var button = Button({
      x: 320-175,             // x座標
      y: 480+350,             // y座標
      width: 160,         // 横サイズ
      height: 160,        // 縦サイズ
      text: "←",     // 表示文字
      fontSize: 48,       // 文字サイズ
      fontColor: 'black', // 文字色
      cornerRadius: 10,   // 角丸み
      fill: 'lightgray',    // ボタン色
      stroke: 'black',     // 枠色
      strokeWidth: 5,     // 枠太さ
    }).addChildTo(piecegroup)
    .onpointstart = function() {
      SoundManager.play("button");
      if(input < 10){input = 0;}
      else{input = Math.floor(input * 0.1);}
      label.text = input;
    };

    //ボタン0
    var button = Button({
      x: 320,             // x座標
      y: 480+350,             // y座標
      width: 160,         // 横サイズ
      height: 160,        // 縦サイズ
      text: 0,     // 表示文字
      fontSize: 48,       // 文字サイズ
      fontColor: 'blue', // 文字色
      cornerRadius: 10,   // 角丸み
      fill: 'skyblue',    // ボタン色
      stroke: 'blue',     // 枠色
      strokeWidth: 5,     // 枠太さ
    }).addChildTo(piecegroup)
    .onpointstart = function() {
      SoundManager.play("button");
      if(input==0){input=this.text;}
      else{input = input * 10 + this.text;}
      label.text = input;

    };

    //ボタン1-9
    for(var n=0;n<9;n++){
      var i= Math.floor(n/3);
      var j= n%3;
      var button = Button({
        x: 320+175*j-175,             // x座標
        y: 480-175*i+175,             // y座標
        width: 160,         // 横サイズ
        height: 160,        // 縦サイズ
        text: n+1,     // 表示文字
        fontSize: 48,       // 文字サイズ
        fontColor: 'blue', // 文字色
        cornerRadius: 10,   // 角丸み
        fill: 'skyblue',    // ボタン色
        stroke: 'blue',     // 枠色
        strokeWidth: 5,     // 枠太さ
      }).addChildTo(piecegroup)
      .onpointstart = function() {
        SoundManager.play("button");
        if(input==0){input=this.text;}
        else{input = input * 10 + this.text;}
        label.text = input;

        console.log(input);
      };
    }

    gauge2.update = function(){
      gauge2.value --;
    };

    gauge2.onempty = function(){
      clearInterval(countdown);
      input = -1;
      SoundManager.stopMusic("timer");
      self.exit("result");
    };



  },

});

// Result クラスを定義
phina.define('Result', {
  superClass: 'CanvasScene',
  init: function() {
    // 親クラス初期化
    this.superInit();
    var self=this;
    var next="";
    var result="";
    var result2="";
    var text="";
    var color="LightBlue";
    var stroke="blue";
    var bcolor="skyblue";
    var btcolor="blue";

    if(ans==input){
      result1="正解！";
      result2="Go to Next Level!";
      text ="次へ";
      if(up){level++;}
      clear++;
      next = "main";
      score += ans;
      result3="スコア："+score;
      var mark="maru";
      SoundManager.play("maru");
    }

    if(ans!=input){
      if(input==-1){result1="時間切れ！";}
      else{ result1="不正解！";}
      color="#FF0000";
      stroke="#FFFFFF";
      bcolor="white";
      btcolor="black";
      result2="ゲームオーバー";
      result3="スコア："+score+"("+clear+"問)";
      text= "タイトルへ";
      next = "title";
      var mark="batsu";
      SoundManager.play("batsu");
    }

    // 背景色を指定
    this.backgroundColor = '#444';
    // ラベルを生成
    this.label = Label({text:'答え:'+ans+"円",fontSize:48}).addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = this.gridY.center()-48; // y 座標
    this.label.fill = 'yellow'; // 塗りつぶし色

    this.label = Label({text:result1,fontSize:48}).addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = this.gridY.center()-128; // y 座標
    this.label.fill = color; // 塗りつぶし色
    this.label.stroke = stroke;
    this.label.strokeWidth = 3;

    this.label = Label({text:result2,fontSize:48}).addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = this.gridY.center()+48; // y 座標
    this.label.fill = 'white'; // 塗りつぶし色

    this.label = Label({text:result3,fontSize:32}).addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = this.gridY.center()+96; // y 座標
    this.label.fill = 'white'; // 塗りつぶし色

    var sprite = Sprite(mark).addChildTo(this)
    .setPosition(SCREEN_WIDTH/2,192).setScale(0.5);

    var button = Button({
      x: 320,             // x座標
      y: 480+240,             // y座標
      width: 300,         // 横サイズ
      height: 150,        // 縦サイズ
      text: text,     // 表示文字
      fontSize: 48,       // 文字サイズ
      fontColor: btcolor, // 文字色
      cornerRadius: 10,   // 角丸み
      fill: bcolor,    // ボタン色
      stroke: bcolor,     // 枠色
      strokeWidth: 5,     // 枠太さ
      // 他にも指定できる…？
    }).addChildTo(this)
    .onpointstart = function() {
      if (next=="main"){

      }

      if (next=="title"){
      }

      self.exit(next);
    };

  },



});


// メイン処理
phina.main(function() {

  // アプリケーションを生成
  var app = GameApp({
    query: '#canvas',
    // Scene01 から開始
    startLabel: 'title',
    assets: ASSETS,
    // シーンのリストを引数で渡す
    scenes: [
      {
        className: 'Title',
        label: 'title',
      },
      {
        className: 'Setting',
        label: 'setting',
        nextLabel:'title'
      },


      {
        className: 'Main',
        label: 'main',
        nextLabel: 'answer',
      },
      {
        className: 'Answer',
        label: 'answer',
        nextLabel: 'result',
      },
      {
        className: 'Result',
        label: 'result',
      },
    ]
  });

  app.domElement.addEventListener('touchend', function dummy() {
    var s = phina.asset.Sound();
    s.loadFromBuffer();
    s.play().stop();
    app.domElement.removeEventListener('touchend', dummy);
  });

  // 実行
  app.run();
});
