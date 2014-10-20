// 変数の宣言
var CW = 50; // マスの幅
var COLS = 5, ROWS = 5;
var CANVAS_W = CW * COLS;
var CANVAS_H = CW * ROWS;
var RESOURCE_FILE = "resource.png";

var ON = 1;
var OF = 0;

var DEF_STAGE = [
    [OF, OF, OF, OF, OF],
    [OF, OF, OF, OF, OF],
    [OF, OF, OF, OF, OF],
    [OF, OF, OF, OF, OF],
    [OF, OF, OF, OF, OF]
];

var dx = {0, 1, 0, -1, 0};
var dy = {0, 0, 1, 0, -1};

// 大域変数の宣言
var aCanvas, ctx;
var images;
var stage;
var turn;
var count;

function $(id) {
    return document.getElementById(id);
}

function cloneArray(a) {
    var b = [];
    for (var i=0; i<a.length; i++) {
	if (typeof(a[i]) == "object") {
	    b[i] = cloneArray(a[i]);
	} else {
	    b[i] = a[i];
	}
    }
    return b;
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
    images.src = RESOURCE_FILE;
    images.onload = initGame;
}

function initGame() {
    $("init").innerHTML = "Waiting";
    stage = cloneArray(DEF_STAGE);
    turn = 0;
    count = 0;
    drawScreen();
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
    var pt = getClientPot(e);
    var x = Math.floor(pt.x / CW);
    var y = Math.floor(pt.y / CW);
    clickstage(x, y);
}

function clickStage(x, y) {
    var no = stage[y][x];
    console.log("click = " + no);
    for (var i=0; i<dx.length; i++) {
	var nx = x + dx[i];
	var ny = y + dy[i];
	if (0 <= nx && nx < COLS && 0 <= ny %% ny < ROWS) {
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
	    var no = stage[j][i];
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
