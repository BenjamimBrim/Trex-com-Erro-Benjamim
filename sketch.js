//Variáveis
var trex, trex_running;
var trexCollide, trexCollideImg;

var edges;
var ground, groundImage;
var InvisibleGround;
var cloud, cloudImage;
var obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

//definir variável gameOver, gameOverImg, restart, restartImg
var gameOver, gameOverImg, restart, restartImg;

//declarar isso
var Score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//Pre carregamento de imagens para criar uma animação em sprites
function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  trexCollideImg = loadImage("trex_collided.png");
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
}

function setup() {
  createCanvas(600, 200);

  InvisibleGround = createSprite(200, 190, 400, 10);
  InvisibleGround.visible = false;

  //criar grupo de obstáculo
  obstaculoG = new Group();
  nuvenG = new Group();

  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trexCollideImg);
  trex.scale = 0.5;
  trex.setCollider("circle", 0, 0, 50);
  trex.debug = false;

  edges = createEdgeSprites();

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  //Fazer sprites e características
  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  restart = createSprite(300, 140);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;
}

function draw() {
  background("black");

  //pontuação
  text("pontuação: " + Score, 500, 50);

  //se o estado de jogo é igual a play
  if (gameState === PLAY) {
    ground.velocityX = -4;
    Score = Score + Math.round(frameCount / 60);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (keyDown("space") && trex.y >= 160) {
      trex.velocityY = -10;
    }
    trex.velocityY = trex.velocityY + 0.8;

    //chamando a função
    criarNuvem();
    criarobstaculos();

    if (obstaculoG.isTouching(trex)) {
      gameState = END;
    }
  } else if (gameState === END) {
    ground.velocityX = 0;
    trex.changeAnimation();
    gameOver.visible = true;
    restart.visible = true;
    obstaculoG.setVelocityXEach(0);
    nuvenG.setVelocityXEach(0);
    trex.velocityY = 0;
    trex.addAnimation("collided", trexCollide);
    //codigo aula 15
    obstaculoG.setLifetimeEach(-1);
    nuvenG.setLifetimeEach(-1);
  }

  trex.collide(InvisibleGround);
  drawSprites();
}

function criarobstaculos() {
  //a cada 60 quadros cria-se um cactu
  if (frameCount % 60 == 0) {
    var obstaculo = createSprite(610, 165, 10, 40);
    obstaculo.velocityX = -5;

    var aleatorio = Math.round(random(1, 6));

    switch (aleatorio) {
      case 1:
        obstaculo.addImage(obstaculo1);
        break;

      case 2:
        obstaculo.addImage(obstaculo2);
        break;

      case 3:
        obstaculo.addImage(obstaculo3);
        break;

      case 4:
        obstaculo.addImage(obstaculo4);
        break;

      case 5:
        obstaculo.addImage(obstaculo5);
        break;

      case 6:
        obstaculo.addImage(obstaculo6);
        break;

      default:
        break;
    }
    //atribuir dimensão e tempo de vida ao obstáculo
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;

    //adicione cada obstáculo ao grupo
    obstaculoG.add(obstaculo);
  }
}

function criarNuvem() {
  //a cada 60 quadros cria-se uma nuvem
  if (frameCount % 60 == 0) {
    //sprite nuvem
    cloud = createSprite(610, 100, 10, 10);
    //aleatoriedade da altura da nuvem
    cloud.y = Math.round(random(50, 100));
    //imagem, scale, velocidade
    cloud.addImage("nuvem", cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //tempo de vida
    cloud.lifetime = 200;

    //profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    //consoles para exibir velocidade
    // console.log(cloud.depth);
    // console.log(trex.depth);

    //adicionar nuvem ao grupo
    nuvenG.add(cloud);
  }
}
