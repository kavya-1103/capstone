var PLAY = 1;
var END = 0;
var gameState = PLAY;
var distance=0;
var win=2

var player, player_running, player_collided,sun;
var ground, invisibleGround, groundImage,sunImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, coin,coinImage
var score;
var gameOverImg


function preload(){
  player_running = loadAnimation("T1.png","T2.png","T3.png","T4.png");
  player_collided = loadAnimation("T1.png");

  coinImage = loadImage("coin.png")
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud-1.png");
  sunImage= loadImage("sun.png");
  
  obstacle1 = loadImage("o1.png");
  obstacle2 = loadImage("o2.png");
  obstacle3 = loadImage("o3.png");
  
  youWin = loadImage("youWin.jpg")
  
  
  gameOverImg = loadImage("gameOver.png")
  
}

function setup() {
  createCanvas(1000, 600);

  var message = "This is a message";
 
  
  ground = createSprite(200,500,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale=1;
  
  player = createSprite(50,160,20,50);
  player.addAnimation("running", player_running);
  player.addAnimation("collided", player_collided);
  

  player.scale = 1;
  
  
  
  sun = createSprite(width-50,25)
  sun.addImage(sunImage);
  sun.scale=0.1
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  
  
 
  gameOver.scale = 0.5;
  
  
  invisibleGround = createSprite(200,450,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  player.setCollider("rectangle",0,0,70,player.height);
  player.debug=false;

  
  score = 0;
  
}

function draw() {
  
  background("lightblue");
  //displaying score
  text("Score: "+ score, 530,40);
  if(gameState==win){
  
    imageMode(CENTER)

    image(youWin,300,150,600,200);
    obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
     
     
    ground.destroy();
    player.destroy();
  }
  
  if(gameState === PLAY){

    
    distance++;
    if(distance>=2000){
      gameState=win
    }

    gameOver.visible = false;
    
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
  
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& player.y >= 100) {
        player.velocityY = -12;
        
    }
    
    //add gravity
    player.velocityY = player.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(player)){
        //player.velocityY = -12;
       
        gameState = END;
        
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
    
     
     //change the player animation
      player.changeAnimation("collided", player_collided);
    
     
     
      ground.velocityX = 0;
      player.velocityY = 0
      
     
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop player from falling down
  player.collide(invisibleGround);
  
  


  drawSprites();
}



function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,415,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
        
              break;
      
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 1;
    obstacle.lifetime = 300;
   obstacle.debug=false;
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    obstacle.setCollider("rectangle",15,0,50,30)
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 200 === 0) {
    var cloud = createSprite(width,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 400;
    
    //adjust the depth
    cloud.depth = player.depth;
    player.depth = player.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

