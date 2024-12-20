class Game {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.ctx = context;
    this.width;
    this.height;
    this.cellSize = 80;
    this.columns;
    this.rows;
    this.topMargin = 2;

    this.eventTimer = 0;
    this.eventInterval = 200;
    this.eventUpdate = false;

    this.gameOver = true;
    //scores
    this.winningScore = 20;

    this.player1;
    this.player2;
    this.player3;
    this.player4;
    this.food;
    this.background;
    this.gameObjects;
    this.debug = false;
    this.gameUI = new UI(this);
    window.addEventListener("keyup", (e) => {
      if (e.key === "-") this.toggleFullScreen();
      else if (e.key === "=") this.debug = !this.debug;
    });
    window.addEventListener("resize", (e) => {
      this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
    });
    this.resize(window.innerWidth, window.innerHeight);
    // this.start();
  }
  resize(width, height) {
    this.canvas.width = width - (width % this.cellSize);
    this.canvas.height = height - (height % this.cellSize);
    this.ctx.fillStyle = "blue";
    this.ctx.font = "30px Impact";
    this.ctx.textBaseline = "top";
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.columns = Math.floor(this.width / this.cellSize);
    this.rows = Math.floor(this.height / this.cellSize);
    this.background = new Background(this);
  }
  initPlayer1() {
    const image = document.getElementById(this.gameUI.player1character.value);
    const name = this.gameUI.player1name.value;
    if (this.gameUI.player1controls.value === "arrows") {
      this.player1 = new Keyboard1(
        this,
        0,
        this.topMargin,
        1,
        0,
        "orangered",
        name,
        image
      );
    } else if (this.gameUI.player1controls.value === "Phone") {
      this.player1 = new Touchscreen(
        this,
        0,
        this.topMargin,
        1,
        0,
        "orangered",
        name,
        image
      );
    } else {
      this.player1 = new ComputerAi(
        this,
        0,
        this.topMargin,
        1,
        0,
        "orangered",
        name,
        image
      );
    }
  }
  initPlayer2() {
    const image = document.getElementById(this.gameUI.player2character.value);
    const name = this.gameUI.player2name.value;
    if (this.gameUI.player2controls.value === "wsad") {
      this.player2 = new Keyboard2(
        this,
        0,
        this.topMargin,
        1,
        0,
        "magenta",
        name,
        image
      );
    } else {
      this.player2 = new ComputerAi(
        this,
        0,
        this.topMargin,
        1,
        0,
        "magenta",
        name,
        image
      );
    }
  }
  initPlayer3() {
    const image = document.getElementById(this.gameUI.player3character.value);
    const name = this.gameUI.player3name.value;
    this.player3 = new ComputerAi(
      this,
      this.columns - 1,
      this.rows - 1,
      -1,
      0,
      "yellow",
      name,
      image
    );
  }
  initPlayer4() {
    const image = document.getElementById(this.gameUI.player4character.value);
    const name = this.gameUI.player4name.value;
    this.player4 = new ComputerAi(
      this,
      0,
      this.rows - 1,
      0,
      -1,
      "darkblue",
      name,
      image
    );
  }
  start() {
    if (!this.gameOver) {
      this.gameUI.triggerGameOver();
    } else {
      this.gameOver = false;
      this.gameUI.gameplayUI();
      this.initPlayer1();
      this.initPlayer2();
      this.initPlayer3();
      this.initPlayer4();
      this.food = new Food(this);
      this.gameObjects = [
        this.player1,
        this.player2,
        this.player3,
        this.player4,
        this.food,
      ];
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }
  drawGrid() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        this.ctx.strokeRect(
          x * this.cellSize,
          y * this.cellSize,
          this.cellSize,
          this.cellSize
        );
      }
    }
  }

  checkCollision(a, b) {
    return a.x === b.x && a.y === b.y;
  }
  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  handlePeriodicEvents(deltaTime) {
    if (this.eventTimer < this.eventInterval) {
      this.eventTimer += deltaTime;
      this.eventUpdate = false;
    } else {
      this.eventTimer = 0;
      this.eventUpdate = true;
    }
  }
  render(deltaTime) {
    this.handlePeriodicEvents(deltaTime);
    if (this.eventUpdate && !this.gameOver) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.background.draw();
      if (this.debug) this.drawGrid();

      this.gameObjects.forEach((object) => {
        object.draw();
        object.update();
      });
      this.gameUI.update();
    }
  }
}

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const game = new Game(canvas, ctx);

  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime + 2;
    lastTime = timeStamp;
    game.render(deltaTime);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
});
