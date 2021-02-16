// phina.js をグローバル領域に展開
phina.globalize();

var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 960;

var GRID_SIZE = SCREEN_WIDTH / 4;  // グリッドのサイズ
var PIECE_SIZE = GRID_SIZE * 0.95; // ピースの大きさ
var PIECE_NUM_XY = 4;              // 縦横のピース数
var PIECE_OFFSET = GRID_SIZE / 2;  // オフセット値

var group;
var x=[];
var y=[];
var coins =["coin1","coin5","coin10","coin50","coin100","coin500"];
var price =[1,5,10,50,100,500];
var ans=0;
var time=0;
var now=0;
var countdown;
var score=0;

var ASSETS = {
  image: {
    'coin1': 'coin/money_coin_heisei_1.png',
    'coin5': 'coin/money_coin_blank_5.png',
    'coin10': 'coin/money_coin_heisei_10.png',
    'coin50': 'coin/money_coin_heisei_50.png',
    'coin100': 'coin/money_coin_heisei_100.png',
    'coin500': 'coin/money_coin_reiwa_500_new.png',
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
    this.label = Label('Count Coins').addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = this.gridY.center()-50; // y 座標
    this.label.fill = 'white'; // 塗りつぶし色
    this.label.setScale(1.5);

    this.label = Label('Tap to Start').addChildTo(this);
    this.label.x = this.gridX.center(); // x 座標
    this.label.y = this.gridY.center()+50; // y 座標
    this.label.fill = 'white'; // 塗りつぶし色



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

    sum=6;
    time = 20 * sum;
    console.log("sum:"+sum +" time:"+ time+" now:"+now);

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

    /*
    var angle = Math.floor( Math.random() * 360 );
    var x = 10 * Math.cos( angle * (Math.PI / 180) ) ;
    var y = 10 * Math.sin( angle * (Math.PI / 180) ) ;

    var coin = Sprite('coin10')
    .addChildTo(this)
    .setPosition(this.gridX.center(), this.gridY.center())
    .setScale(0.2);


    var coin2 = Sprite('coin100')
    .addChildTo(this)
    .setPosition(SCREEN_WIDTH-coin.width*0.1, SCREEN_HEIGHT-coin.height*0.1)
    .setScale(0.2);

    console.log(coin2.height +" "+coin2.width);
    console.log(coin2.x +" "+coin2.y);
    */
    ans=0;
    group = DisplayElement().addChildTo(this);
    for(n=0;n<sum;n++){
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
          group.children[i].moveBy(x[i], y[i]);


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
      var button=[];
      // 背景色を指定
      this.backgroundColor = '#444';
      // ラベルを生成
      this.label = Label('答えを入力').addChildTo(this);
      this.label.x = this.gridX.center(); // x 座標
      this.label.y = this.gridY.center()/4; // y 座標
      this.label.fill = 'white'; // 塗りつぶし色

      var gauge2 = Gauge({
        x: SCREEN_WIDTH/2, y: SCREEN_HEIGHT-15,        // x,y座標
        width: SCREEN_WIDTH,            // 横サイズ
        height: 30,            // 縦サイズ
        cornerRadius: 0,      // 角丸み
        maxValue: 500,         // ゲージ最大値
        value: 500,         // ゲージ初期値
        fill: 'white',         // 後ろの色
        gaugeColor: 'skyblue', // ゲージ色
        stroke: 'silver',      // 枠色
        strokeWidth: 5,        // 枠太さ
      }).addChildTo(this);


      var number=['1','2','3','4','5','6','7','8','9'];
      var n=0;
      for(var i=0;i<3;i++){
        for(var j=0;j<3;j++){
            button[n] = Button({
            x: 320+175*j-175,             // x座標
            y: 480-175*i+175,             // y座標
            width: 150,         // 横サイズ
            height: 150,        // 縦サイズ
            text: number[n],     // 表示文字
            fontSize: 32,       // 文字サイズ
            fontColor: 'white', // 文字色
            cornerRadius: 10,   // 角丸み
            fill: 'skyblue',    // ボタン色
            stroke: 'blue',     // 枠色
            strokeWidth: 5,     // 枠太さ
            // 他にも指定できる…？
          }).addChildTo(this);
          n++;
        }
      }
      button.onpointstart=function(){
        console.log("push");
      }

      countdown = function(){
        gauge2.value --;
      };
      setInterval(countdown, 50);
      gauge2.onempty = function(){
        clearInterval(countdown);
        self.exit();
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
    init: function(message) {
      // 親クラス初期化
      this.superInit();
      // 背景色を指定
      this.backgroundColor = '#444';
      // ラベルを生成
      this.label = Label('正解:'+ans+"円").addChildTo(this);
      this.label.x = this.gridX.center(); // x 座標
      this.label.y = this.gridY.center()-50; // y 座標
      this.label.fill = 'white'; // 塗りつぶし色

      var result="正解！";
      this.label = Label(result).addChildTo(this);
      this.label.x = this.gridX.center(); // x 座標
      this.label.y = this.gridY.center()+50; // y 座標
      this.label.fill = 'white'; // 塗りつぶし色
    },

    onpointstart: function() {
      this.exit("title");//ゲームオーバーの場合
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
