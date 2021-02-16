// phina.js をグローバル領域に展開
phina.globalize();

var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 960;

var GRID_SIZE = SCREEN_WIDTH / 4;  // グリッドのサイズ
var PIECE_SIZE = GRID_SIZE * 0.95; // ピースの大きさ
var PIECE_NUM_XY = 4;              // 縦横のピース数
var PIECE_OFFSET = GRID_SIZE / 2;  // オフセット値

var x=[];
var y=[];

var coins =["coin1","coin5","coin10","coin50","coin100","coin500"];
var price =[1,5,10,50,100,500];

var ans=0;
var time=0;

var countdown;

var score=0;
var input = 0;

var level = 5;
var speed = 1;

var clear=0;

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
};

// Title クラスを定義
phina.define('Title', {
  superClass: 'CanvasScene',
  init: function() {
    this.superInit();
    // 背景色を指定
    this.backgroundColor = '#444';
    // ラベルを生成
    this.label = Label({text:'Count Coins', fontSize: 48}).addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = this.gridY.center()-50; // y 座標
    this.label.fill = 'white'; // 塗りつぶし色

    this.label = Label('Tap to Start').addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = this.gridY.center()+50; // y 座標
    this.label.fill = 'white'; // 塗りつぶし色

    score=0;
    clear=0;

    for(let i in coins){
      var coin = Sprite(coins[i])
      .addChildTo(this)
      .setPosition(this.gridX.center()-250+100*i, this.gridY.center()-200)
      .setScale(0.2);
    }

    for(let i in coins){
      var coin = Sprite(coins[i])
      .addChildTo(this)
      .setPosition(this.gridX.center()+250-100*i, this.gridY.center()+200)
      .setScale(0.2);
    }


  },

  onpointstart: function() {
    this.exit();
  },

});

// MainScene クラスを定義
phina.define('Main', {
  superClass: 'CanvasScene',
  init: function() {
    this.superInit();
    var self=this;
    // 背景色を指定
    this.backgroundColor = '#444';
    // ラベルを生成
    this.label = Label('How Much?').addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = this.gridY.center()-50; // y 座標
    this.label.fill = 'white'; // 塗りつぶし色

    ans = 0;
    input =0;
    time = 100 + (level-5)*7.5;
    console.log(time/20);

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

    countdown = function(){
      gauge.value --;
    };
    setInterval(countdown, 50);
    gauge.onempty = function(){
      clearInterval(countdown);
      self.exit();
    };

    var group = DisplayElement().addChildTo(this);
    for(n=0;n<level;n++){
      var r = Math.floor( Math.random() * coins.length );
      var angle = Math.floor( Math.random() * 360 );
      var sprite = Sprite(coins[r]).addChildTo(group)
      .setPosition(
        100+Math.floor(Math.random() * (SCREEN_WIDTH-200)),
        100+Math.floor(Math.random() * (SCREEN_HEIGHT-200)))
        .setScale(0.2);
        x[n] = 10 * Math.cos( angle * (Math.PI / 180) ) ;
        y[n] = 10 * Math.sin( angle * (Math.PI / 180) ) ;
        ans += price[r];
      }

      this.label = Label(ans).addChildTo(this);
      this.label.x = this.gridX.center(); // x 座標
      this.label.y = this.gridY.center()+50; // y 座標
      this.label.fill = 'white'; // 塗りつぶし色

      group.update= function(){
        for(i=0;i<group.children.length;i++){
          group.children[i].moveBy(x[i]*0.8, y[i]*0.8);


          //console.log(coin.x +", "+coin.y);
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

      // 背景色を指定
      this.backgroundColor = '#444';
      // ラベルを生成
      this.label = Label('答えを入力').addChildTo(this);
      this.label.x = this.gridX.center(); // x 座標
      this.label.y = 75; // y 座標
      this.label.fill = 'white'; // 塗りつぶし色


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
        width: 150,         // 横サイズ
        height: 150,        // 縦サイズ
        text: "OK",     // 表示文字
        fontSize: 48,       // 文字サイズ
        fontColor: 'red', // 文字色
        cornerRadius: 10,   // 角丸み
        fill: "lightsalmon",    // ボタン色
        stroke: 'red',     // 枠色
        strokeWidth: 5,     // 枠太さ
        // 他にも指定できる…？
      }).addChildTo(piecegroup)
      .onpointstart = function() {

        clearInterval(countdown);
        self.exit("result");

      };

      //ボタンBACK
      var button = Button({
        x: 320-175,             // x座標
        y: 480+350,             // y座標
        width: 150,         // 横サイズ
        height: 150,        // 縦サイズ
        text: "←",     // 表示文字
        fontSize: 48,       // 文字サイズ
        fontColor: 'black', // 文字色
        cornerRadius: 10,   // 角丸み
        fill: 'lightgray',    // ボタン色
        stroke: 'black',     // 枠色
        strokeWidth: 5,     // 枠太さ
        // 他にも指定できる…？
      }).addChildTo(piecegroup)
      .onpointstart = function() {

        if(input < 10){input = 0;}
        else{input = Math.floor(input * 0.1);}
        label.text = input;

        console.log(this.text);
      };

      //ボタン0
      var button = Button({
        x: 320,             // x座標
        y: 480+350,             // y座標
        width: 150,         // 横サイズ
        height: 150,        // 縦サイズ
        text: 0,     // 表示文字
        fontSize: 48,       // 文字サイズ
        fontColor: 'blue', // 文字色
        cornerRadius: 10,   // 角丸み
        fill: 'skyblue',    // ボタン色
        stroke: 'blue',     // 枠色
        strokeWidth: 5,     // 枠太さ
        // 他にも指定できる…？
      }).addChildTo(piecegroup)
      .onpointstart = function() {

        if(input==0){input=this.text;}
        else{input = input * 10 + this.text;}
        label.text = input;

        console.log(this.text);
      };

      //ボタン1-9
      for(var n=0;n<9;n++){
        var i= Math.floor(n/3);
        var j= n%3;
        var button = Button({
          x: 320+175*j-175,             // x座標
          y: 480-175*i+175,             // y座標
          width: 150,         // 横サイズ
          height: 150,        // 縦サイズ
          text: n+1,     // 表示文字
          fontSize: 48,       // 文字サイズ
          fontColor: 'blue', // 文字色
          cornerRadius: 10,   // 角丸み
          fill: 'skyblue',    // ボタン色
          stroke: 'blue',     // 枠色
          strokeWidth: 5,     // 枠太さ
          // 他にも指定できる…？
        }).addChildTo(piecegroup)
        .onpointstart = function() {

          if(input==0){input=this.text;}
          else{input = input * 10 + this.text;}
          label.text = input;

          console.log(this.text);
        };
      }


      countdown = function(){
        gauge2.value --;
      };
      setInterval(countdown, 50);

      gauge2.onempty = function(){
        clearInterval(countdown);
        input = -1;
        self.exit("result");
      };



    },

    /*
    onpointstart: function() {
    this.exit();
  },
  */
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

    if(ans==input){
      result1="正解！";
      result2="Tap to Next Level";
      text ="次へ";
      level++;
      clear++;
      next = "main";
      score += ans;
      var mark="maru";
    }

    if(ans!=input){
      if(input==-1){result1="時間切れ！";}
      else{ result1="不正解！";}
      result2="ゲームオーバー";
      result3="スコア："+score;
      text= "タイトルへ";
      next = "title";
      var mark="batsu";
    }

    // 背景色を指定
    this.backgroundColor = '#444';
    // ラベルを生成
    this.label = Label({text:'正解:'+ans+"円",fontSize:48}).addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = this.gridY.center()-48; // y 座標
    this.label.fill = 'white'; // 塗りつぶし色

    this.label = Label({text:result1,fontSize:48}).addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = 75; // y 座標
    this.label.fill = 'white'; // 塗りつぶし色

    this.label = Label({text:result2,fontSize:48}).addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = this.gridY.center()+48; // y 座標
    this.label.fill = 'white'; // 塗りつぶし色

    this.label = Label({text:result3,fontSize:32}).addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = this.gridY.center()+96; // y 座標
    this.label.fill = 'white'; // 塗りつぶし色

    var sprite = Sprite(mark).addChildTo(this)
    .setPosition(SCREEN_WIDTH/2,240).setScale(0.5);

    var button = Button({
      x: 320,             // x座標
      y: 480+240,             // y座標
      width: 300,         // 横サイズ
      height: 150,        // 縦サイズ
      text: text,     // 表示文字
      fontSize: 48,       // 文字サイズ
      fontColor: 'blue', // 文字色
      cornerRadius: 10,   // 角丸み
      fill: 'skyblue',    // ボタン色
      stroke: 'blue',     // 枠色
      strokeWidth: 5,     // 枠太さ
      // 他にも指定できる…？
    }).addChildTo(this)
    .onpointstart = function() {

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
        nextLabel: 'main',
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
  // 実行
  app.run();
});
