// 変数の宣言
var CW = 50; // マスの幅
var COLS = 5, ROWS = 5;
var CANVAS_W = CW * COLS;
var CANVAS_H = CW * ROWS;
var RESOURCE_FILE = "resource.png";

var ON = 1;
var OF = 0;

var PLAYING = 0, MAKING = 1;

var dx = [0, 1, 0, -1, 0];
var dy = [0, 0, 1, 0, -1];

// 大域変数の宣言
var aCanvas, ctx;
var images;
var defStage = [];
var stage = [];
var turn;
var count;
var state;

function $(id) {
    return document.getElementById(id);
}

window.onload = function() {
    // キャンバス
    aCanvas = $("aCanvas");
    aCanvas.width = CANVAS_W;
    aCanvas.height = CANVAS_H;
    // キャンバスをクリックしたらclickHandlerを開始
    aCanvas.onclick = clickHandler;
    ctx = aCanvas.getContext("2d");
    // リソースファイルを読み込む
    $("info").innerHTML = "画像読み込み中";
    images = new Image();
    images.src = RESOURCE_FILE;
    // 2次元配列の作成
    for (var col=0; col<COLS; col++) {
        defStage[col] = new Array();
        stage[col] = new Array();
    }
    images.onload = buttonInit; // 括弧をつけてはいけない。
}

// 状態の遷移に関係する関数

function makeGame() {
    $("info").innerHTML = "問題を作成してください";
    for (var col=0; col<COLS; col++) {
	for (var row=0; row<ROWS; row++) {
            stage[row][col] = OF;
        }
    }
    state = MAKING;
    drawScreen();
}

function initGame() {
    $("info").innerHTML = "Start!";
    for (var col=0; col<COLS; col++) {
	for (var row=0; row<ROWS; row++) {
            stage[row][col] = defStage[row][col];
        }
    }
    state = PLAYING;
    turn = 0;
    count = 0;
    drawScreen();
}

function buttonInit() {
    for (var col=0; col<COLS; col++) {
	for (var row=0; row<ROWS; row++) {
            defStage[row][col] = OF;
        }
    }
    // 共通処理
    makeGame();
}

function buttonStart() {
    if (state == MAKING) { // 問題作成時に押された場合
        for (var col=0; col<COLS; col++) {
	    for (var row=0; row<ROWS; row++) {
                defStage[row][col] = stage[row][col];
            }
        }
    } else if (state == PLAYING) { // プレイ中に押された場合
	
    }
    // 共通処理
    initGame();
}

// マウス処理

function getClientPos(e) {
    var res = { x:0, y:0 };
    var rect = e.target.getBoundingClientRect();
    res.x = e.clientX - rect.left;
    res.y = e.clientY - rect.top;
    return res;
}

function clickHandler(e) {
    var pt = getClientPos(e);
    var x = Math.floor(pt.x / CW);
    var y = Math.floor(pt.y / CW);
    if (state == PLAYING) {
	clickStage(x, y);
    } else {
	editStage(x, y);
    }
}

function editStage(x, y) {
    var no = stage[y][x];
    console.log("click = " + no);
    stage[y][x] = (no+1)%2;
    drawScreen();
}

function clickStage(x, y) {
    console.log("click = " + stage[y][x]);
    for (var i=0; i<dx.length; i++) {
	var nx = x + dx[i];
	var ny = y + dy[i];
	if (0 <= nx && nx < COLS && 0 <= ny && ny < ROWS) {
	    var no = stage[ny][nx];
	    stage[ny][nx] = (no+1)%2; // ONはOFに、OFはONになる。
	}
    }
    drawScreen();
    turn++;
    $("info").innerHTML = turn + "回 押しました。"
    // クリア判定
    if (count == 0) {
	setTimeout(gameClear, 1);
    }
}

function gameClear() {
    alert("ゲームクリア！ (" + turn + "回)");
    initGame();
}

function drawScreen() {
    count = 0;
    for (var col=0; col<COLS; col++) {
	for (var row=0; row<ROWS; row++) {
	    var no = stage[row][col];
	    if (no == ON) {
		count++;
	    } 
	    // 絵画元
	    var sx = no * CW;
	    var sy = 0;
	    var sw = CW;
	    var sh = CW;
	    // 絵画先
	    var tx = col * CW;
	    var ty = row * CW;
	    var tw = CW;
	    var th = CW;
	    ctx.drawImage(images, sx, sy, sw, sh, tx, ty, tw, th);
	}
    }
}

