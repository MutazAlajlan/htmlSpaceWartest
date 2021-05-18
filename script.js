let canv = document.querySelector("canvas");
let cont = canv.getContext("2d");
canv.width = 800;
canv.height = 600;
// cont.beginPath();
// cont.rect(370,550,70,20);
// cont.stroke();
// cont.closePath();
//invalidate();
let stage = 1;
let bullets = [];
let enemies = [];
let bossBullets = [];
let rocks = [];
let frame = 0;
let score = 0;
let isLost = false;
let isWon = false;

class Player {
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 20;
        //this.health = 1;
        this.movement = 8;
        //for powerup.
        // this.movementModifier = 0;
        //for powerup
        // this.fireRate = 1;
        this.isMovingRight = false,
        this.isMovingLeft = false,
        this.isAlive = true,
        this.isFiring = false
    }
    actionTrigger()
    {
        if(this.isMovingRight && this.health > 0)
         {
             if( (canv.width - 100) /*fixed size*/ >= (this.x + this.movement) )
             {
                this.x += this.movement;
             }
        }
        else if(this.isMovingLeft && this.health > 0)
        {
            //canv start from 0.
            if(0 < (this.x - this.movement) )
            {
                this.x -= this.movement;
            }
        }
        if(this.isFiring && this.health > 0)
        {
            bullets.push(new Bullet(this.x, this.y + 15));
        }
    }
    render()
    {
        if(this.health > 0)
        {
            cont.beginPath();
            cont.rect(this.x,this.y,this.width,this.height);
            cont.stroke();
            cont.closePath();
        }
    }
}

function updatePlayer()
{
    
    player.actionTrigger();
    player.render()

    for(let i = 0; i < enemies.length; i++) 
    {
        if(player && isHit(player, enemies[i]))
        {
            isLost = true;
        }
    }
    if(boss.isAlive && isHit(player, boss))
    {
        isLost = true;
    }
}

class Bullet
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.width = 7;
        this.height = 4;
        this.movement = 11;
    }

    actionTrigger()
    {
        this.y -= this.movement;
    }

    render()
    {

        context.fillStyle = 'brown';
        context.beginPath();
        context.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        context.fill();
    }
}

function updateBullet()
{
    for(let i = 0; i < bullets.length; i++)
    {
        bullets[i].actionTrigger();
        bullets[i].render();

        for(let ii = 0; ii < enemies.length; ii++)
        {
            if(enemies[ii] && bullets[i] && isHit(bullets[i], enemies[ii]) )
            {
                enemies[ii].health = 0;
                bullets.splice(i, 1);
                i--;
            }
        }
        if(stage == 2 && bullets[i] && isHit(bullets[i], boss))
        {
            boss.health--;
            bullets.splice(i, 1);
            i--;
        }
        if(bullets[i] && bullets[i].y < 20)
        {
            bullets.splice(i, 1);
            i--;
        }
    }
}

class Rock 
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 30;

    }

    render()
    {
        cont.fillStyle = "Black";
        cont.fillRect(this.x, this.y, this.width, this.height);
    }
}

function renderRock()
{
    rocks.push(new Rock(Math.random() * 400 + 40, Math.random() * 550 + 40));
    rocks.push(new Rock(Math.random() * 400, Math.random() * 550));
}
renderRock();

function manageRocks()
{
    for(let i = 0; i < rocks.length; i++)
    {
        rocks[i].render();
        for(let ii = 0; ii < enemies.length; ii++)
        {
            if(enemies[ii] && rocks[i] && isHit(enemies[ii], rocks[i]))
            {
                enemies.splice(ii, 1);
                ii++;
            }
        }

        for(let ii = 0; ii < bullets.length; ii++)
        {
            if(bullets[ii] && rocks[i] && isHit(bullets[ii], rocks[i]))
            {
                bullets.splice(ii, 1);
                ii--;
            }
        }
    }
}
class Enemy
{
    constructor(x)
    {
        this.x = x;

        this.y = 30;
        this.width = 30;
        this.height = 20;
        this.fallSpeed = 5;
        this.health = 1;
    }
    actionTrigger()
    {
        this.y += this.fallSpeed;
    }
    
    render()
    {
        //cont.beginPath();
        cont.fillStyle = "blue";
        cont.fillRect(this.x, this.y, this.width, this.height);
        //cont.stroke();
        //cont.closePath();
    }
}

function enemyManager()
{
    
    for(let i = 0; i < enemies.length; i++)
    {
        enemies[i].actionTrigger();
        enemies[i].render();
        if(enemies[i].health == 0)
        {
            if(score < 50)
            {
                score++;
            }
            enemies.splice(i, 1);
        }
        else if(enemies[i].y >= canv.height - enemies[i].height)
        {
            enemies.splice(i, 1);
            i--;
        }
    }
    if(stage == 1)
    {
        let enemyX = Math.random() * (canv.width - Enemy.width);
        enemies.push(new Enemy(enemyX));
    }
}
let bossFiring;
class Boss 
{
    constructor(x)
    {
        this.x = x;
        this.y = 30;
        this.width = 150;
        this.height = 110;
        this.xModifier = Math.random() * 10;
        this.yModifier = Math.random() * 7;
        this.health = 20;
        this.isAlive = true;
    }
    actionTrigger()
    {
        if(this.health > 0)
        {
            if(this.x >= canv.width - this.width || 0 >= this.x)
            {
                this.xModifier *= -1;
            }
            else if(this.y >= canv.height - this.height || 0 >= this.y)
            {
                this.yModifier *= -1;
            }
            for(let i = 0; i < rocks.length; i++)
            {
                if(isHit(this, rocks[i]))
                {
                    this.xModifier *= -1;
                    this.yModifier *= -1;
                }
            }
            this.x += this.xModifier;
            this.y += this.yModifier;

            bossFiring = setInterval(() => {
                if (Math.floor(Math.random() * 14) % 2 == 0)
                    bossBullets.push(new bossBullet(boss.x, boss.y))
            }, 400);
        }
    }

    render()
    {
        if(this.isAlive)
        {
            cont.fillStyle = "red";
            cont.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
let boss = new Boss(230);

function updateBoss()
{
    if(stage == 2)
    {
        boss.actionTrigger();
        boss.render();
    }
}

class bossBullet
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.movement = 10;
    }

    actionTrigger()
    {
        this.y += this.movement;
    }

    render()
    {
        cont.fillStyle = "black";
        context.beginPath();
        context.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        context.fill();
    }
}

function updateBossBullets()
{
    for(let i = 0; i < bossBullets.length; i++)
    {
        bossBullets[i].actionTrigger();
        bossBullets[i].render();
    

    for(let ii = 0; ii < rocks.length; ii++)
    {
        if(bossBullets[i] && isHit(bossBullets[i], rocks[ii]))
        {
            bossBullets.splice(i, 1);
            i--;
        }
    }
    if(bossBullets[i] && isHit(player, bossBullets[i]))
    {
        isLost = true;
        bossBullets.splice(i, 1);
        i--;
    }
    if(bossBullets[i])
    {
        if(bossBullets[i].x > canv.width || bossBullets[i].x < 0 || bossBullets[i].y > canv.height ||
            bossBullets[i].y < 0)
            {
                bossBullets.splice(i, 1);
            }
    }
    }
}

function gameScreen()
{
    cont.fillStyle = "black";
    cont.font = "27px Arial";
    cont.fillText("Score: " + score, 25, 30);

    if(score == 50)
    {
        stage = 2;
    }

    if(isLost)
    {
        alert("Sorry, you lost.");
        player.isAlive = false;
    }
    if(isWon)
    {
        alert("Congratulations, you won!!!");
    }
}

function gameLoop() 
{
    cont.clearRect(0, 0, canv.width, canv.height);
    updatePlayer();
    enemyManager();
    manageRocks();
    updateBullet();
    enemyManager();
    updateBoss();
    updateBossBullets();
    requestAnimationFrame(gameLoop);
}
let player = new Player(370, 550); 
gameLoop();


function isHit(obj1, obj2) 
{
    if ( !(obj1.x > obj2.x + obj2.width || obj1.x + obj1.width < obj2.x || obj1.y > obj2.y + obj2.height ||
        obj1.y + obj1.height < obj2.y) ) 
    {
      return true
    }
  }
  

window.addEventListener('keydown', this.checkKeyDown, false);
function checkKeyDown(e) 
{
    let keyCode = e.keyCode;

    switch (keyCode) 
    {
        case 13: //13 is the code for "Enter" key.
            {
                player.isFiring = true;
                break;
            }
        case 32: //32 is the code for "Space" key.
            {
                player.isFiring = true;

                break;
            }
        case 37: //37 is the code for the "Left Arrow" key.
        {
            player.isMovingLeft = true;
           // alert("Left"); 
            break; 
        }
        case 39: //39 is the code for "Right Arrow" key.
        {
            player.isMovingRight = true;
            //alert("Right"); 
            break;
         } 
        default: break; // catch unexpected value.
    }
}

window.addEventListener("keyup", this.checkKeyUp, false);
function checkKeyUp(e) 
{
    let keyCode = e.keyCode;

    switch (keyCode) 
    {
        case 13: //13 is the code for "Enter" key.
            {
                player.isFiring = false;
                break;
            }
        case 32: //32 is the code for "Space" key.
            {
                player.isFiring = false;

                break;
            }
        case 37: //37 is the code for the "Left Arrow" key.
        {
            player.isMovingLeft = false;
           // alert("Left"); 
            break; 
        }
        case 39: //39 is the code for "Right Arrow" key.
        {
            player.isMovingRight = false;
           // alert("Right"); 
            break;
         } 
        default: break; // catch unexpected value.
    }
}



