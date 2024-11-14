let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d");
let key = new Array(256);

let img = new Array(256);
let img_loaded = new Array(256);

function SetCanvas(width, height)
{
    cvs.width = width;
    cvs.height = height;
}
//キー操作

function onKey(event) {
    key[event.keyCode] = 1;
}
function offKey(event) {
    key[event.keyCode] = 0;
}

window.addEventListener("keyup", offKey);
window.addEventListener("keydown", onKey);

function showScene(sceneId)
{
    //　すべてのシーンを非表示
    document.querySelectorAll('.scene').forEach(scene => {
        scene.classList.remove('active');
    })
    document.getElementById(sceneId).classList.add('active');
    gameState.scene = sceneId;
}

//画像読み込み
function loadImg(n, filename)
{
    img_loaded[n] = false;
    img[n] = new Image();
    //イベントハンドラ
    img[n].onload = function()
    {
        img_loaded[n] = true;
    }
    img[n].src = filename;
}

function drawImg(n, x, y)
{
    if(img_loaded[n] == true)
    {
        ctx.drawImage(img[n], x, y);
    }
}

function rnd(max)
{
    return parseInt(Math.random()*max);
}

function getDistance(x1, y1, x2, y2)
{
    return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2); // math.sprtは二乗根
}

function input_focus(inputId) // 入力フォームにフォーカスする
{
    const input = document.getElementById(inputId);
    if (input) {
        input.focus();
    }
    if(gameState.scene=="title" || (gameState.scene=="game_playing" && gameState.pause_active))
    {
        buttonState.btnfocus = inputId;
    }
}
function next_focus()
{
    console.log(buttonState.btnfocus);
    if(buttonState.btnfocus=="hato_beans2")
    {
        input_focus("hato_beans_rule");
        buttonState.guideX = 265;
        buttonState.guideY = 490;
    }
    else if(buttonState.btnfocus=="hato_beans_rule")
    {
        input_focus("hato_beans2");
        buttonState.guideX = 200;
        buttonState.guideY = 390;
    }
    else if(buttonState.btnfocus=="continue")
    {
        input_focus("quit");
        buttonState.guideX = 390;
    }
    else if(buttonState.btnfocus=="quit")
    {
        input_focus("continue");
        buttonState.guideX = 270;
    }
}

function backgroundfill()
{
    drawImg(15+Math.floor((panState.level%8)/2), 0, 0);
    ctx.fillStyle = "black";
    ctx.fillText("SCORE  " + gameState.score + "  HI SCORE  " + gameState.hiscore, 270, 20);
}

function gameoverMove()
{
    ctx.fillStyle = "black";
    ctx.fillText("GAME OVER", 350, 230);
    toriAttackState.active = false;
    gameOver_tori();
    if(key[13]>0)
    {
        buttonState.guideX = 200;
        buttonState.guideY = 390;
        document.getElementById("hiscore_text").textContent = gameState.hiscore;
        showScene('title');
        input_focus("hato_beans2");
    }
}

function pauseMove()
{
    if(key[27]>0  && gameState.game_active==true && gameState.pause_active==false) // escape pause
    { // ボタンが押されるまで
        buttonState.vecbtn_active = false;
        gameState.pause_active = true;
        createButton();
    }
    
    else if(gameState.pause_active)
    {
        let a = document.getElementById("canvas");
        a.style.filter = 'grayscale(70%)';
        ctx.fillStyle = "black";
        ctx.fillText("PAUSE", 350, 230);
        ctx.fillText("つづける   やめる", 300, 300);
        drawImg(0, buttonState.guideX, buttonState.guideY);
        vectorButtunPress(37, 39);
        if(key[13]>0)
        {
            let a = document.getElementById("canvas");
            a.style.filter = 'none';
            const button1 = document.getElementById('continue');
            const button2 = document.getElementById('quit');
            button1.remove();
            button2.remove();
            buttonState.guideX = 200;
            buttonState.guideY = 390;
            gameState.pause_active = false;
            if(buttonState.btnfocus == "quit")
            {
                gameState.game_active = false;
                buttonState.btnfocus = "hato_beans2";
                showScene('title');
                input_focus("hato_beans2");
            }
        }
    }
}

function createButton()
{
    const button1 = document.createElement('button');
    button1.id = "continue";
    button1.style.visibility = "hidden";
    const button2 = document.createElement('button');
    button2.id = "quit";
    button2.style.visibility = "hidden";

    // コンテナにボタンを追加
    const container = document.getElementById('game_playing');
    container.appendChild(button1);
    container.appendChild(button2);

    buttonState.btnfocus = "continue";
    buttonState.guideX = 270;
    buttonState.guideY = 310;
}

function vectorButtunPress(key1, key2)
{
    if((key[key1]>0 || key[key2]>0) && buttonState.vecbtn_active==false)
    {
        buttonState.vecbtn_active = true;
        next_focus();
    }
    else if(key[key1]==0 && key[key2] == 0)
    {
        buttonState.vecbtn_active = false;
    }
}

const block_data = [
    [
        "3PK", "1PK", "1PK", "1PK", "1PK", "1PK", "1PK", "0PK",
        "4PK", "2PK", "2PK", "2PK", "2PK", "2PK", "2PK", "1PK",
        "4PK", "2PK", "2PK", "2PK", "2PK", "2PK", "2PK", "1PK",
        "4PK", "2PK", "2PK", "2PK", "2PK", "2PK", "2PK", "1PK",
        "4PK", "2PK", "2PK", "2PK", "2PK", "2PK", "2PK", "1PK",
        "4PK", "2PK", "2PK", "2PK", "2PK", "2PK", "2PK", "1PK",
        "4PK", "2PK", "2PK", "2PK", "2PK", "2PK", "2PK", "1PK",
        "4PK", "4PK", "4PK", "4PK", "4PK", "4PK", "4PK", "3PK", 
    ],
    [
        "3GR", "1GR", "1GR", "1GR", "1GR", "1GR", "1GR", "0GR",
        "4GR", "2GR", "2GR", "2GR", "2GR", "2GR", "2GR", "1GR",
        "4GR", "2GR", "2GR", "2GR", "2GR", "2GR", "2GR", "1GR",
        "4GR", "2GR", "2GR", "2GR", "2GR", "2GR", "2GR", "1GR",
        "4GR", "2GR", "2GR", "2GR", "2GR", "2GR", "2GR", "1GR",
        "4GR", "2GR", "2GR", "2GR", "2GR", "2GR", "2GR", "1GR",
        "4GR", "2GR", "2GR", "2GR", "2GR", "2GR", "2GR", "1GR",
        "4GR", "4GR", "4GR", "4GR", "4GR", "4GR", "4GR", "3GR", 
    ],
    [
        "3YL", "1YL", "1YL", "1YL", "1YL", "1YL", "1YL", "0YL",
        "4YL", "2YL", "2YL", "2YL", "2YL", "2YL", "2YL", "1YL",
        "4YL", "2YL", "2YL", "2YL", "2YL", "2YL", "2YL", "1YL",
        "4YL", "2YL", "2YL", "2YL", "2YL", "2YL", "2YL", "1YL",
        "4YL", "2YL", "2YL", "2YL", "2YL", "2YL", "2YL", "1YL",
        "4YL", "2YL", "2YL", "2YL", "2YL", "2YL", "2YL", "1YL",
        "4YL", "2YL", "2YL", "2YL", "2YL", "2YL", "2YL", "1YL",
        "4YL", "4YL", "4YL", "4YL", "4YL", "4YL", "4YL", "3YL", 
    ],
    [
        "3GL", "1GL", "1GL", "1GL", "1GL", "1GL", "1GL", "0GL",
        "4GL", "2GL", "2GL", "2GL", "2GL", "2GL", "2GL", "1GL",
        "4GL", "2GL", "2GL", "2GL", "2GL", "2GL", "2GL", "1GL",
        "4GL", "2GL", "2GL", "2GL", "2GL", "2GL", "2GL", "1GL",
        "4GL", "2GL", "2GL", "2GL", "2GL", "2GL", "2GL", "1GL",
        "4GL", "2GL", "2GL", "2GL", "2GL", "2GL", "2GL", "1GL",
        "4GL", "2GL", "2GL", "2GL", "2GL", "2GL", "2GL", "1GL",
        "4GL", "4GL", "4GL", "4GL", "4GL", "4GL", "4GL", "3GL", 
    ]
    
];

function getColor(colorType)
{
    var colorHash = {
        "0PK":"#FFC9D1",
        "1PK":"#FF9FB3",
        "2PK":"#FFA1C7", // 真ん中の色
        "3PK":"#FF85AF",
        "4PK":"#FF6BC8",
        "0GR":"#B5FFB8",
        "1GR":"#00FF30",
        "2GR":"#00CE27",
        "3GR":"#00D828",
        "4GR":"#009A13",
        "0YL":"#FEFF9A",
        "1YL":"#FDFF00",
        "2YL":"#FFE400",
        "3YL":"#E2F000",
        "4YL":"#E0C800",
        "0GR":"#E9E9E9",
        "1GL":"#DDDDDD",
        "2GL":"#BCBCBC",
        "3GL":"#CDCDCD",
        "4GL":"#909090"
    };
    return colorHash[colorType];
}

function drawdot(n, x, y)
{
    const size = 3.75;
    for(let i=0; i<block_data[n].length; i++)
    {
        let dotx = x + (i % 8) * size;
        let doty = y + Math.floor(i / 8) * size;
        ctx.fillStyle = getColor(block_data[n][i]);
        ctx.fillRect(dotx, doty, size, size);  
    }
}


function drawSpiral()
{
    const radius = -animateState.spiralRadius + animateState.i;
    const x = 768/2 - radius * Math.cos(animateState.i * 0.04);
    const y = 576/2 - radius * Math.sin(animateState.i * 0.04);
    drawImg(19+(animateState.i%2), x, y);
    drawImg(19+(animateState.i%2), x-60, y+100);
    
    if(animateState.i < 300)
    {
        animateState.i++;
    }
    else if(key[13]>0)
    {
        animateState.i = 0;
    }
    else
    {
        animateState.i = 0;
    }
}