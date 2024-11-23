class Snake {
  constructor(game, x, y, speedX, speedY, color, name, image) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.color = color;
    this.width = this.game.cellSize;
    this.height = this.game.cellSize;
    this.moving = true;
    this.score = 0;
    this.length = 3;
    this.segments = [];
    for (let i = 0; i < this.length; i++) {
      if (i > 0) {
        this.x += this.speedX;
        this.y += this.speedY;
      }

      this.segments.unshift({ x: this.x, y: this.y, frameX: 0, frameY: 0 });
    }
    this.readyToTurn = true;
    this.name = name;
    this.image = image;
    this.spriteWidth = 200;
    this.spriteHeight = 200;
  }
  update() {
    this.readyToTurn = true;
    //collisions
    if (this.game.checkCollision(this, this.game.food)) {
      if (this.game.food.frameY === 1) {
        //not edibele
        this.score--;
        if (this.length > 2) {
          this.length--;
          if (this.segments.length > this.length) this.segments.pop();
        }
      } else {
        //reg food
        this.score++;
        this.length++;
      }
      this.game.food.reset();
    }
    // boundaries
    if (
      (this.x <= 0 && this.speedX < 0) ||
      (this.x >= this.game.columns - 1 && this.speedX > 0) ||
      (this.y <= this.game.topMargin && this.speedY < 0) ||
      (this.y >= this.game.rows - 1 && this.speedY > 0)
    ) {
      this.moving = false;
    }

    if (this.moving) {
      this.x += this.speedX;
      this.y += this.speedY;
      this.segments.unshift({ x: this.x, y: this.y, frameX: 0, frameY: 0 });
      if (this.segments.length > this.length) {
        this.segments.pop();
      }
    }
    //win condition
    if (this.score >= this.game.winningScore) {
      this.game.gameUI.triggerGameOver(this);
    }
  }
  draw() {
    this.segments.forEach((segment, i) => {
      if (this.game.debug) {
        if (i === 0) this.game.ctx.fillStyle = "gold";
        else this.game.ctx.fillStyle = this.color;
        this.game.ctx.fillRect(
          segment.x * this.game.cellSize,
          segment.y * this.game.cellSize,
          this.width,
          this.height
        );
      }
      this.setSpriteFrame(i);
      this.game.ctx.drawImage(
        this.image,
        segment.frameX * this.spriteWidth,
        segment.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        segment.x * this.game.cellSize,
        segment.y * this.game.cellSize,
        this.width,
        this.height
      );
    });
  }
  turnUp() {
    if (
      this.speedY === 0 &&
      this.y >= this.game.topMargin &&
      this.readyToTurn
    ) {
      this.speedX = 0;
      this.speedY = -1;
      this.moving = true;
      this.readyToTurn = false;
    }
  }
  turnDown() {
    if (this.speedY === 0 && this.y < this.game.rows - 1 && this.readyToTurn) {
      this.speedX = 0;
      this.speedY = 1;
      this.moving = true;
      this.readyToTurn = false;
    }
  }
  turnLeft() {
    if (this.speedX === 0 && this.x > 0 && this.readyToTurn) {
      this.speedX = -1;
      this.speedY = 0;
      this.moving = true;
      this.readyToTurn = false;
    }
  }
  turnRight() {
    if (
      this.speedX === 0 &&
      this.x < this.game.columns - 1 &&
      this.readyToTurn
    ) {
      this.speedX = 1;
      this.speedY = 0;
      this.moving = true;
      this.readyToTurn = false;
    }
  }
  setSpriteFrame(index) {
    const segment = this.segments[index];
    const prevSegment = this.segments[index - 1] || 0;
    const nextSegment = this.segments[index + 1] || 0;
    if (index === 0) {
      //head
      if (segment.y < nextSegment.y) {
        //up
        if (
          this.game.food.y === segment.y - 1 &&
          this.game.food.x === segment.x
        ) {
          segment.frameX = 7;
          segment.frameY = 1;
        } else {
          segment.frameX = 1;
          segment.frameY = 2;
        }
      } else if (segment.y > nextSegment.y) {
        //down
        if (
          this.game.food.y === segment.y + 1 &&
          this.game.food.x === segment.x
        ) {
          segment.frameX = 7;
          segment.frameY = 3;
        } else {
          segment.frameX = 0;
          segment.frameY = 4;
        }
      } else if (segment.x < nextSegment.x) {
        //left
        if (
          this.game.food.x === segment.x - 1 &&
          this.game.food.y === segment.y
        ) {
          segment.frameX = 2;
          segment.frameY = 4;
        } else {
          segment.frameX = 4;
          segment.frameY = 2;
        }
      } else if (segment.x > nextSegment.x) {
        //right
        if (
          this.game.food.x === segment.x + 1 &&
          this.game.food.y === segment.y
        ) {
          segment.frameX = 4;
          segment.frameY = 4;
        } else {
          segment.frameX = 6;
          segment.frameY = 3;
        }
      }
    } else if (index === this.segments.length - 1) {
      //tail
      if (prevSegment.y < segment.y) {
        //up
        segment.frameX = 1;
        segment.frameY = 4;
      } else if (prevSegment.y > segment.y) {
        segment.frameX = 0; //down
        segment.frameY = 2;
      } else if (prevSegment.x < segment.x) {
        segment.frameX = 2; //left
        segment.frameY = 0;
      } else if (prevSegment.x > segment.x) {
        //right
        segment.frameX = 0;
        segment.frameY = 1;
      }
    } else {
      //body
      if (nextSegment.x < segment.x && prevSegment.x > segment.x) {
        segment.frameX = 5; //horizontal right
        segment.frameY = 3;
      } else if (prevSegment.x < segment.x && nextSegment.x > segment.x) {
        segment.frameX = 5; //horizontal left
        segment.frameY = 2;
      } else if (prevSegment.y < segment.y && nextSegment.y > segment.y) {
        segment.frameX = 1; //ver up
        segment.frameY = 3;
      } else if (nextSegment.y < segment.y && prevSegment.y > segment.y) {
        segment.frameX = 0; //ver down
        segment.frameY = 3;
      } else if (prevSegment.x < segment.x && nextSegment.y > segment.y) {
        segment.frameX = 4; // up left
        segment.frameY = 0;
      } else if (prevSegment.y > segment.y && nextSegment.x > segment.x) {
        segment.frameX = 3; //lft dwn
        segment.frameY = 0;
      } else if (prevSegment.x > segment.x && nextSegment.y < segment.y) {
        segment.frameX = 3; //down right
        segment.frameY = 1;
      } else if (prevSegment.y < segment.y && nextSegment.x < segment.x) {
        segment.frameX = 4; // right lft
        segment.frameY = 1;
        //bend clockwise
      } else if (nextSegment.x < segment.x && prevSegment.y > segment.y) {
        segment.frameX = 3; // right dwn
        segment.frameY = 2;
      } else if (nextSegment.y < segment.y && prevSegment.x < segment.x) {
        segment.frameX = 3; //  dwn left
        segment.frameY = 3;
      } else if (nextSegment.x > segment.x && prevSegment.y < segment.y) {
        segment.frameX = 2; // lft up
        segment.frameY = 3;
      } else if (nextSegment.y > segment.y && prevSegment.x > segment.x) {
        segment.frameX = 2; // lft up
        segment.frameY = 2;
      } else {
        segment.frameX = 6;
        segment.frameY = 0;
      }
    }
  }
}
class Keyboard1 extends Snake {
  constructor(game, x, y, speedX, speedY, color, name, image) {
    super(game, x, y, speedX, speedY, color, name, image);

    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") this.turnUp();
      else if (e.key === "ArrowDown") this.turnDown();
      else if (e.key === "ArrowLeft") this.turnLeft();
      else if (e.key === "ArrowRight") this.turnRight();
    });
  }
}

class Keyboard2 extends Snake {
  constructor(game, x, y, speedX, speedY, color, name, image) {
    super(game, x, y, speedX, speedY, color, name, image);

    window.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "w") this.turnUp();
      else if (e.key.toLowerCase() === "s") this.turnDown();
      else if (e.key.toLowerCase() === "a") this.turnLeft();
      else if (e.key.toLowerCase() === "d") this.turnRight();
    });
  }
}

class ComputerAi extends Snake {
  constructor(game, x, y, speedX, speedY, color, name, image) {
    super(game, x, y, speedX, speedY, color, name, image);
    this.turnTimer = 0;
    this.turnInterval;
  }
  update() {
    super.update();
    if (
      (this.x === this.game.food.x && this.spedY === 0) ||
      (this.y === this.game.food.y && this.speedX === 0)
    ) {
      this.turn();
    } else {
      if (this.turnTimer < this.turnInterval) {
        this.turnTimer += 1;
      } else {
        this.turn();
        this.turnInterval = Math.floor(Math.random() * 8) + 5;
      }
    }
  }

  turn() {
    this.turnTimer = 0;
    if (this.speedY === 0) {
      this.game.food.y < this.y ? this.turnUp() : this.turnDown();
    } else if (this.speedX === 0) {
      this.game.food.x < this.x ? this.turnLeft() : this.turnRight();
    }
  }
}
