// ------------フレーム処理
FPS = 35; 
let stime, etime, ptime;
// ==============大域変数=======================

const gameState = {
    scene: 'title',
    score: 0,
    hiscore: 0,
    // ポーズ
    pause_active : false,
    game_active : false,
    // ゲーム回数計測
    kaisu: 0
}

const animateState = {
    spiralRadius : 400,
    i : 0,
    kiraX: [],
    kiraY: 500,
    k_active: [],
    k_count: [],
    KIRA_MAX: 24,
    witchX: 0,
    witchY: 300,
    w_active: false
}

const buttonState ={
    guideX : 200,
    guideY : 390,
    btnfocus : "hato_beans2",
    vecbtn_active : false
}


// 地面の変数
const rect_quantity = 24;
const rect_size = 32;
let ground_rect = new Array(rect_quantity); // 地面の四角trueだと歩けるfalseだと歩けない

//　トリの変数
const toriState = {
    x : 0,
    y : 490,
    direction : true, // トリの向いている方向 true:right false:left
    d_button : true, // 途中で変わらないように
    d_num : 2
}

const toriAttackState = {
    x : toriState.x + 30,
    y : toriState.y,
    xs : 45, // speed
    ys : 50, // speed
    count : 1,
    active : false
}

const panState = {
    quantity : 12, // この中のnewArrayの数字はquantityの値
    syurui : new Array(12),
    x : new Array(12), // ランダムにした後は一定
    y : new Array(12),
    s : new Array(12),
    active : new Array(12),
    level : 1,
    levelMAX : 5
}

const panattackState = {
    x : new Array(panState.quantity),
    y : new Array(panState.quantity),
    xs : new Array(panState.quantity),
    ys : new Array(panState.quantity),
    active : new Array(panState.quantity)
}

init();
loop();

function init()
{
    SetCanvas(768, 576); // 本家比率

    loadImg(0, "image/finger.png");
    //loadImg(1, "image/ground.png");
    loadImg(2, "image/hato.png");
    loadImg(3, "image/ghato.png");
    loadImg(4, "image/hato_mopen.png");
    loadImg(5, "image/ghato_mopen.png");
    loadImg(6, "image/hato_break.png");
    
    loadImg(7, "image/melon.png");
    loadImg(8, "image/melon_break.png");
    loadImg(9, "image/france.png");
    loadImg(10, "image/france_break.png");
    loadImg(11, "image/kurowa.png");
    loadImg(12, "image/kurowa_break.png");
    loadImg(13, "image/witch_kurowa.png");
    loadImg(14, "image/mattack.png");
    loadImg(15, "image/bg_spring.png");
    loadImg(16, "image/bg_summer.png");
    loadImg(17, "image/bg_fall.png");
    loadImg(18, "image/bg_winter.png");
    loadImg(19, "image/hatoflyhigh.png");
    loadImg(20, "image/hatoflylow.png");
    loadImg(21, "image/kirakira.png");
    loadImg(22, "image/gkirakira.png");

    ctx.font = 'bold 20px "ベストテンDOT", sans-serif';
    input_focus("hato_beans2");
    document.getElementById("hiscore_text").textContent = gameState.hiscore;
}
function loop()
{
    stime = Date.now();      // 処理開始時刻を取得

    // ===========ここからフレーム内の処理を追加===========================
    if(gameState.scene=='title')
    {
        ctx.fillStyle = "#FFE9F3";
        ctx.fillRect(0, 0, 768, 576);
        drawImg(0, buttonState.guideX, buttonState.guideY);
        drawSpiral();
        vectorButtunPress(38, 40);
    }
    else if(gameState.scene=='game_playing')
    {
        backgroundfill();
        
        if(gameState.game_active==false) // gameover
        {
            gameoverMove();
        }

        // pause時動作
        pauseMove();

        moveTori();

        if(key[32] > 0 && gameState.game_active==true && gameState.pause_active==false)
        {
            setAttack();
        }
        drawAttack();

        setMame();    
        drawMame();
        drawmattack();

        drawRect();

        motion();
    }
    else
    {
        ctx.fillStyle = "#FFE9F3";
        ctx.fillRect(0, 0, 768, 576);
    }

    // ===========ここまでフレーム内の処理を追加===============-==
    
    etime = Date.now(); // 処理終了時刻を取得
    ptime = etime - stime; // 処理にかかった時間
    setTimeout("loop()", parseInt(1000/FPS- ptime)); // 再呼び出し
}

// ====================関数=================================


// 準備

function initGame()
{
    initTori();
    initRect();
    initMame();
    initmattack();
    gameState.score = 0;
    gameState.game_active = true;
    gameState.kaisu++;
    buttonState.vecbtn_active = false;
    for(let i=0; i<animateState.KIRA_MAX; i++)
    {
        animateState.k_active[i] = false;
    }
    console.log(gameState.kaisu);
}

function scoreUpdate()
{
    level_up();
    if(gameState.score > gameState.hiscore)
    {
        gameState.hiscore = gameState.score;
    }
}

function initTori()
{
    toriState.x = 0;
    toriState.y = 490;
    toriState.direction = true;
    toriState.d_button = true;
    toriState.d_num = 2;
    
}

function moveTori()
{
    if(key[39]>0 && toriState.x < (cvs.width)-12 && gameState.game_active==true && gameState.pause_active==false) // → 
    {
        toriState.direction = true;
        toriState.d_num = 2;
        if(ground_rect[Math.round((toriState.x+rect_size)/rect_size)])
        { // 足場ないところには進めないようにする
            toriState.x += 12;
        }
    }
    else if(key[37]>0 && toriState.x > 0 && gameState.game_active==true && gameState.pause_active==false) // ←
    {
        toriState.direction = false;
        toriState.d_num = 3;
        if(ground_rect[Math.round((toriState.x-rect_size/2)/rect_size)]) // なんかtorix-r/2だとあうよくわからん
        { // 足場ないところには進めないようにする
            toriState.x -= 12;
        }
    }
    drawTori();
}

function drawTori()
{
    if(key[32]>0)
    {
        drawImg(toriState.d_num+2, toriState.x, toriState.y-2);
    }
    else if(gameState.game_active == false)
    {
        drawImg(6, toriState.x, toriState.y);
    }
    else
    {
        drawImg(toriState.d_num, toriState.x, toriState.y);
    }
}

function gameOver_tori()
{
    toriState.y += 1;
}

function initRect() // ボタン押したときのみ実行
{
    for(let i=0; i<rect_quantity; i++)
    {
        ground_rect[i] = true;
    }   
}

function setRect() // ボタン押したときのみ実行
{
    for(let i=0; i<rect_quantity; i++)
    {
        if(ground_rect[i]==false)
        {
            ground_rect[i] = true;
        }
    }   
}

function drawRect()
{
    for(let i=0; i<rect_quantity; i++)
    {
        if(ground_rect[i]==true)
        {
            drawdot(Math.floor((panState.level%8)/2), i*rect_size, 540);
        }
    }
    
}

function setAttack()
{
    if(toriAttackState.active == false && gameState.game_active==true && gameState.pause_active==false)
    {
        toriState.d_button = toriState.direction;
        if(toriState.d_button)
        {
            toriAttackState.x = toriState.x + 35;
        }
        else
        {
            toriAttackState.x = toriState.x - 10; // 10は四角に重ならないように調整した値
        }
        toriAttackState.y = toriState.y + 15;
        toriAttackState.active = true;
    }
}

function drawAttack()
{
    if(toriAttackState.active && gameState.game_active==true && gameState.pause_active==false)
    {
        ctx.fillStyle = "black";
        ctx.fillRect(toriAttackState.x, toriAttackState.y, 12, 12);
        if(toriState.d_button)
        {
            toriAttackState.x = toriAttackState.x + toriAttackState.xs;
        }
        else
        {
            toriAttackState.x = toriAttackState.x - toriAttackState.xs;
        }
        toriAttackState.y = toriAttackState.y - toriAttackState.ys; // 上向きなので-
        if(toriAttackState.x <= 0 || toriAttackState.x >= (cvs.width) || toriAttackState.y >= (cvs.height))
        {
            toriAttackState.count = 1;
            toriAttackState.active = false;
        }
    }
}

function initMame() // ボタン押したときのみ実行
{
    for(let i=0; i<panState.quantity; i++)
    {
        panState.active[i] = false;
    }
    panState.level = 1;
    panState.quantity = 3;
}

function setMame() 
{
    if(gameState.pause_active==false)
    {
        for(let i=0; i<panState.quantity; i++)
        {
            
            const kakuritu = rnd(100);
            if(panState.active[i] == false && kakuritu < 1)
            {
                let syurui_kakuritu = rnd(100);
                if(syurui_kakuritu<85)
                {
                    panState.syurui[i] = 7;
                }
                else if(syurui_kakuritu>=85 && syurui_kakuritu<99)
                {
                    if(syurui_kakuritu<92)
                    {
                        panState.syurui[i] = 9;
                    }
                    else if(panState.level>3 && syurui_kakuritu>=92)
                    {
                        panState.syurui[i] = 11; // kurowassan
                    }
                    else
                    {
                        panState.syurui[i] = 7;
                    }
                }
                panState.x[i] = rnd(cvs.width-rect_size);
                panState.y[i] = 0;
                panState.s[i] = rnd(2) + (panState.level*1.5);
                panState.active[i] = true;

                if(panattackState.active[i]==false) // setmattack()
                {
                    if(panState.active[i])
                    {
                        panattackState.x[i] = panState.x[i];
                        panattackState.y[i] = panState.y[i] + 40;
                        panattackState.xs[i] = rnd(1);
                        panattackState.ys[i] = panState.s[i] + 1.3;
                        panattackState.active[i] = true;
                    } 
                }

            }
        }
    }
    
}


function drawMame()
{
    for(let i=0; i<panState.quantity; i++)
    {
        if(panState.active[i]) 
        {
            //console.log("draw" + i + "unko" + panState.quantity);
            
            drawImg(panState.syurui[i], panState.x[i], panState.y[i]);;
            //ctx.fillRect(panState.x[i], panState.y[i], rect_size, 40);
            if(gameState.pause_active==false)
            {
                panState.y[i] = panState.y[i] + panState.s[i];
                if(panState.y[i] >= 540) // 床についたら
                {
                    panState.active[i] = false;
                    ground_rect[Math.round(panState.x[i]/rect_size)] = false;
                    //console.log("ground_rect:"+Math.round(panState.x[i]/rect_size)+ground_rect[Math.round(panState.x[i]/rect_size)]);
                }

                if(gameState.game_active)
                {
                    let dx = Math.abs(toriAttackState.x - panState.x[i]);
                    let dy = Math.abs(toriAttackState.y - panState.y[i]);

                    if(dx<(12/2+img[panState.syurui[i]].width/2) && dy<(12/2+img[panState.syurui[i]].height/2))
                    {
                        drawImg(panState.syurui[i]+1, panState.x[i], panState.y[i]);
                        gameState.score += 50 * toriAttackState.count;
                        ctx.fillStyle = "blue";
                        ctx.fillText(50 * toriAttackState.count, toriAttackState.x, toriAttackState.y);
                        toriAttackState.count++;
                        scoreUpdate();
                        pansyurui_action(panState.syurui[i]);
                        panState.active[i] = false;
                        console.log("level:" + panState.level);
                    }
                    
                    dx = Math.abs(toriState.x - panState.x[i]);
                    dy = Math.abs(toriState.y - panState.y[i]);

                    if(dx<(img[2].width/2+img[panState.syurui[i]].width/2) && dy<(img[2].height/2+img[panState.syurui[i]].height/2))
                    {
                        gameState.game_active = false;
                    }
                }
                
            }
            
        }
    }
    
}


function initmattack()
{
    for(let i=0; i<panState.quantity; i++)
    {
        panattackState.active[i] = false;
    }
}

function drawmattack()
{
    for(let i=0; i<panState.quantity; i++)
    {
        if(panattackState.active[i])
        {
            drawImg(14, panattackState.x[i], panattackState.y[i]);
            if(gameState.pause_active==false)
            {
                panattackState.x[i] = panattackState.x[i] + panattackState.xs[i];
                panattackState.y[i] = panattackState.y[i] + panattackState.ys[i];

                let r1 = (12+12) /4; // 弾の横幅, 縦幅
                let r3 = (img[2].width/2+img[2].width/2) /4; // トリの横幅, 縦幅

                let x1 = toriState.x + img[2].width/2;
                let y1 = toriState.y + img[2].height/2;
                let x2 = panattackState.x[i] + 12;
                let y2 = panattackState.y[i] + 12;

                let d = getDistance(x1, y1, x2, y2);
                if(d<(r3+r1)) // トリとの当たり判定
                {
                    // gameover
                    console.log("しんだ");
                    gameState.game_active = false;
                }

                if(panattackState.x[i] <= 0 || panattackState.x[i] >= (cvs.width) || panattackState.y[i] >= (cvs.height))
                {
                    panattackState.active[i] = false;
                }
            }
            
        }

    }
}

function pansyurui_action(pansyurui)
{
    switch(pansyurui)
    {
        case 9:     
                let nearest_rect = 30; // 地面の総数よりも大きくしてエラーにならないように.. nearestrectはあくまで距離
                let hozon_j;
                for(let j=0; j<rect_quantity; j++)
                {
                    if(ground_rect[j]==false && (nearest_rect > Math.abs(Math.round(toriState.x/rect_size) - j)))
                    { // 今トリがいる地面 - ない地面
                        nearest_rect = Math.abs(Math.round(toriState.x/rect_size) - j); 
                        hozon_j = j;
                        console.log(nearest_rect);
                    }
                }
                if(nearest_rect != 30)
                {
                    ground_rect[hozon_j] = true;
                    set_motion("france", hozon_j*rect_size);
                }
            break;
        case 11:
            // 足場がfalseだったら、全部trueにする　今trueになってるマメをすべてfalseにしてスコアゲット
            
            for(let j=0; j<rect_quantity; j++)
            {
                if(ground_rect[j]==false)
                { // 今トリがいる地面 - ない地面
                    set_motion("kurowa", "");
                    ground_rect[j] = true;
                }
            }
            
            for(let j=0; j<panState.quantity; j++)
            {
                if(panState.active[j])
                {
                    gameState.score += 50;
                    ctx.fillStyle = "blue";
                    ctx.fillText(50, panState.x[j], panState.y[j]);
                    panState.active[j] = false;
                }
            }
            scoreUpdate();
            break;
    }
}

function level_up()
{
    // console.log(panState.quantity);
    if(gameState.score >= (1000*panState.level) && gameState.score <= (1040*panState.level))
    {
        panState.level++;
        console.log(panState.level);
        if(panState.level < panState.levelMAX) // これどうなってるか気になる
        {
            panState.quantity += 3;
        }
    }
    else if(Math.floor(gameState.score/1000)+1 > panState.level) // 同時うちでレベル上がった時
    {
        panState.level++;
        console.log("!" + panState.level);
        if(panState.level < panState.levelMAX) // これどうなってるか気になる
        {
            panState.quantity += 3;
        }
    }
    console.log("mamequa:"+ panState.quantity);
}

function set_motion(panumber, rectX)
{
    if(panumber == "france")
    {
        for(let i=0; i<animateState.KIRA_MAX; i++)
        {
            console.log(animateState.k_active[i]);
            if(animateState.k_active[i]==false)
            {
                animateState.k_active[i] = true;
                animateState.k_count[i] = 1;
                animateState.kiraX[i] = rectX;
            }
        }
        
    }
    else if(panumber == "kurowa")
    {
        animateState.w_active = true;
        animateState.witchX = 0;
    }
}

function motion()
{
    witchKurowa_motion();
    kirakira_motion();
}

function kirakira_motion()
{
    
    for(let i=0; i<animateState.KIRA_MAX; i++)
    {
        if(animateState.k_active[i])
        {
            drawImg(21+(animateState.k_count[i]%2), animateState.kiraX[i], animateState.kiraY);
            animateState.k_count[i]++;
            
            if(animateState.k_count[i] > 3)
            {
                animateState.k_active[i] = false;
            }
        }
    }
    
}

function witchKurowa_motion()
{
    if(animateState.witchX<768 && animateState.w_active==true)
    {
        animateState.witchX += 20;
        drawImg(13, animateState.witchX, animateState.witchY);
        if(animateState.witchX >= 768)
        {
            animateState.w_active = false;
        }
    }
}

