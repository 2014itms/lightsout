// 変数の宣言
var CW = 50; // マスの幅
var COLS = 5, ROWS = 5;
var CANVAS_W = CW * COLS;
var CANVAS_H = CW * ROWS;
var RESOURCE_FILE = "resource.png";

// ライツアウトで、光っているボタンをON、消えているボタンをOFで表現する。
const ON = 1, OF = 0;

// PLAYINGはライツアウトで遊んでいるところ。MAKINGはライツアウトの問題を作成しているところ。
const PLAYING = 0, MAKING = 1;

const dx = [0, 1, 0, -1, 0];
const dy = [0, 0, 1, 0, -1];

// 大域変数の宣言
var aCanvas, ctx;
var images;
var defStage = []; // 問題を格納しておく。
var stage = []; // 画面に描画するステージ。
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
    // キャンバスをクリックしたらclickHandlerを開始。
    aCanvas.onclick = clickHandler;
    ctx = aCanvas.getContext("2d");
    // リソースファイルを読み込む。
    $("info").innerHTML = "画像読み込み中";
    images = new Image();
    images.src = RESOURCE_FILE;
    // 2次元配列を作成作成する。
    for (var col=0; col<COLS; col++) {
        defStage[col] = new Array();
        stage[col] = new Array();
    }
    images.onload = buttonInit; // 括弧をつけてはいけない。
}

// 状態の遷移に関係する関数

function makeGame() { // 問題を作るパート。状態をMAKINGにする。
    $("info").innerHTML = "問題を作成してください";
    for (var col=0; col<COLS; col++) {
	for (var row=0; row<ROWS; row++) {
            stage[row][col] = OF;
        }
    }
    state = MAKING;
    drawScreen();
}

function initGame() { // プレイするパート。状態をPLAYINGにする。
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
    // MAKING→MAKINGにしても、PLAYING→MAKINGにしても、画面をクリアする。
    for (var col=0; col<COLS; col++) {
	for (var row=0; row<ROWS; row++) {
            defStage[row][col] = OF;
        }
    }
    makeGame();
}

function buttonStart() {
    if (state == MAKING) { // MAKING→PLAYINGの場合は、現在の状態を問題として記録する。PLAYING→PLAYINGの場合はこの処理はいらない。
        for (var col=0; col<COLS; col++) {
	    for (var row=0; row<ROWS; row++) {
                defStage[row][col] = stage[row][col];
            }
        }
    }
    initGame();
}

// マウス処理

function getClientPos(e) { // クリックした位置のピクセル単位での座標を求める。
    var res = { x:0, y:0 };
    var rect = e.target.getBoundingClientRect();
    res.x = e.clientX - rect.left;
    res.y = e.clientY - rect.top;
    return res;
}

function clickHandler(e) { // クリックした位置のボタン単位での座標を求め、それをclickStageまたはeditStageに渡す。
    var pt = getClientPos(e);
    var x = Math.floor(pt.x / CW);
    var y = Math.floor(pt.y / CW);
    if (state == PLAYING) {
	clickStage(x, y);
    } else {
	editStage(x, y);
    }
}

function editStage(x, y) { // クリックした位置の座標だけ反転させる。
    var no = stage[y][x];
    console.log("click = " + no);
    stage[y][x] = (no+1)%2; // ONはOFに、OFはONになる。
    drawScreen();
}

function clickStage(x, y) {
    console.log("click = " + stage[y][x]);
    for (var i=0; i<dx.length; i++) { // editStageと異なり、隣のマスも反転させる必要がある。そこでdxとdyを用意していた。
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
    if (count == 0) { // 光っているマスがなければクリア
	setTimeout(gameClear, 1); // setTimeoutを使う理由はやや難しいので説明しません。
    }
}

function gameClear() { // ゲームクリアしたときに呼び出される。自分の感性でアレンジしましょう。
    alert("ゲームクリア！ (" + turn + "回)");
    initGame();
}

function drawScreen() {
    count = 0;
    for (var col=0; col<COLS; col++) {
	for (var row=0; row<ROWS; row++) {
	    var no = stage[row][col];
	    if (no == ON) { // countに光っているボタンの数を格納する。
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

