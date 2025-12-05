class MiniGameSancho {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");

        this.isRunning = false;
        this.gameLoopId = null;
        this.timeRemaining = 20;
        this.timeEarned = 0;
        this.lastSpawnTime = 0;
        this.spawnInterval = 800;
        this.lastShotTime = 0;
        this.shotCooldown = 400;

        this.player = {
            x: this.canvas.width / 2 - 25,
            y: this.canvas.height - 70,
            width: 50,
            height: 50,
            color: "#3B82F6",
        };

        this.mouseX = this.canvas.width / 2;
        this.mouseY = 0;

        this.bullets = [];
        this.enemies = [];
        this.floatingTexts = [];

        this.onGameEnd = null;

        this.images = {
            redEnemies: [new Image(), new Image(), new Image()],
            greenEnemy: new Image(),
            player: new Image(),
            bullet: new Image(),
        };
        const baseUrl = window.BASE_URL || window.location.origin;
        this.images.redEnemies[0].src =
            baseUrl + "public/img/personajes/camello/camel.png";
        this.images.redEnemies[1].src =
            baseUrl + "public/img/personajes/camello/camel_moving.png";
        this.images.redEnemies[2].src =
            baseUrl + "public/img/personajes/camello/camel_zombie.png";
        this.images.greenEnemy.src =
            baseUrl + "public/img/personajes/sobrina/sobrina.png";
        this.images.player.src =
            baseUrl + "public/img/personajes/player/player_shovel.png";
        this.images.bullet.src =
            baseUrl + "public/img/personajes/player/shovel.png";
        this.imagesLoaded = false;

        Promise.all([
            new Promise(
                (resolve) => (this.images.redEnemies[0].onload = resolve)
            ),
            new Promise(
                (resolve) => (this.images.redEnemies[1].onload = resolve)
            ),
            new Promise(
                (resolve) => (this.images.redEnemies[2].onload = resolve)
            ),
            new Promise((resolve) => (this.images.greenEnemy.onload = resolve)),
            new Promise((resolve) => (this.images.player.onload = resolve)),
            new Promise((resolve) => (this.images.bullet.onload = resolve)),
        ]).then(() => {
            this.imagesLoaded = true;
        });

        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    init() {
        this.canvas.width = 800;
        this.canvas.height = 600;

        this.player.x = this.canvas.width / 2 - this.player.width / 2;
        this.player.y = this.canvas.height - this.player.height - 20;

        this.canvas.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("keydown", this.handleKeyDown);
    }

    start(onGameEndCallback) {
        this.isRunning = true;
        this.onGameEnd = onGameEndCallback;
        this.timeRemaining = 20;
        this.timeEarned = 0;
        this.bullets = [];
        this.enemies = [];
        this.lastSpawnTime = Date.now();

        this.startTimer();

        this.gameLoop();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();

            if (this.timeRemaining <= 0) {
                this.stop();
            }
        }, 1000);
    }

    stop() {
        this.isRunning = false;

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
        }

        this.canvas.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("keydown", this.handleKeyDown);

        if (this.onGameEnd) {
            this.onGameEnd(this.timeEarned);
        }
    }

    gameLoop() {
        if (!this.isRunning) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.spawnEnemies();

        this.updateBullets();
        this.updateEnemies();
        this.updateFloatingTexts();
        this.checkCollisions();
        this.cleanup();

        this.render();

        this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }

    handleKeyDown(e) {
        if (e.code === "Space" && this.isRunning) {
            e.preventDefault();
            this.shoot();
        }
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShotTime < this.shotCooldown) return;

        this.lastShotTime = now;

        const playerCenterX = this.player.x + this.player.width / 2;
        const playerCenterY = this.player.y + this.player.height / 2;

        const dx = this.mouseX - playerCenterX;
        const dy = this.mouseY - playerCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const velocityX = (dx / distance) * 8;
        const velocityY = (dy / distance) * 8;

        const angle = Math.atan2(dy, dx);

        this.bullets.push({
            x: playerCenterX - 15,
            y: playerCenterY - 15,
            width: 30,
            height: 30,
            velocityX: velocityX,
            velocityY: velocityY,
            angle: angle,
            color: "#60A5FA",
            image: this.images.bullet,
        });
    }

    spawnEnemies() {
        const now = Date.now();
        if (now - this.lastSpawnTime < this.spawnInterval) return;
        if (this.enemies.length >= 12) return;

        this.lastSpawnTime = now;

        const isRed = Math.random() < 0.7;

        let enemyImage;
        if (isRed) {
            const randomIndex = Math.floor(Math.random() * 3);
            enemyImage = this.images.redEnemies[randomIndex];
        } else {
            enemyImage = this.images.greenEnemy;
        }

        const enemy = {
            x: Math.random() * (this.canvas.width - 50),
            y: -50,
            width: 50,
            height: 50,
            speed: 2 + Math.random() * 1.5,
            type: isRed ? "red" : "green",
            color: isRed ? "#EF4444" : "#22C55E",
            image: enemyImage,
            timeValue: Math.floor(Math.random() * 5) + 2,
        };

        this.enemies.push(enemy);
    }

    updateBullets() {
        this.bullets.forEach((bullet) => {
            bullet.x += bullet.velocityX;
            bullet.y += bullet.velocityY;
            bullet.angle += 0.2;
        });
    }

    updateEnemies() {
        this.enemies.forEach((enemy) => {
            enemy.y += enemy.speed;
        });
    }

    updateFloatingTexts() {
        this.floatingTexts = this.floatingTexts.filter((text) => {
            text.y -= 1;
            text.lifetime--;
            text.alpha = text.lifetime / 60;
            return text.lifetime > 0;
        });
    }

    checkCollisions() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            let bulletHit = false;

            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];

                if (this.rectanglesCollide(bullet, enemy)) {
                    bulletHit = true;

                    if (enemy.type === "red") {
                        this.timeEarned += enemy.timeValue;
                    } else {
                        this.timeEarned -= enemy.timeValue;
                    }

                    this.floatingTexts.push({
                        x: enemy.x + enemy.width / 2,
                        y: enemy.y + enemy.height / 2,
                        text:
                            enemy.type === "red"
                                ? `+${enemy.timeValue}s`
                                : `-${enemy.timeValue}s`,
                        color: enemy.type === "red" ? "#22C55E" : "#EF4444",
                        alpha: 1.0,
                        lifetime: 60,
                    });

                    this.updateScoreDisplay();

                    this.enemies.splice(j, 1);

                    break;
                }
            }

            if (bulletHit) {
                this.bullets.splice(i, 1);
            }
        }
    }

    rectanglesCollide(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    cleanup() {
        this.bullets = this.bullets.filter((bullet) => {
            return (
                bullet.x > -20 &&
                bullet.x < this.canvas.width + 20 &&
                bullet.y > -20 &&
                bullet.y < this.canvas.height + 20
            );
        });

        this.enemies = this.enemies.filter((enemy) => {
            return enemy.y < this.canvas.height;
        });
    }

    render() {
        if (this.imagesLoaded && this.images.player) {
            this.ctx.drawImage(
                this.images.player,
                this.player.x,
                this.player.y,
                this.player.width,
                this.player.height
            );
        } else {
            this.ctx.fillStyle = this.player.color;
            this.ctx.fillRect(
                this.player.x,
                this.player.y,
                this.player.width,
                this.player.height
            );
        }

        this.ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        const playerCenterX = this.player.x + this.player.width / 2;
        const playerCenterY = this.player.y + this.player.height / 2;
        this.ctx.moveTo(playerCenterX, playerCenterY);
        this.ctx.lineTo(this.mouseX, this.mouseY);
        this.ctx.stroke();

        this.bullets.forEach((bullet) => {
            if (this.imagesLoaded && bullet.image) {
                this.ctx.save();
                this.ctx.translate(
                    bullet.x + bullet.width / 2,
                    bullet.y + bullet.height / 2
                );
                this.ctx.rotate(bullet.angle);
                this.ctx.drawImage(
                    bullet.image,
                    -bullet.width / 2,
                    -bullet.height / 2,
                    bullet.width,
                    bullet.height
                );
                this.ctx.restore();
            } else {
                this.ctx.fillStyle = bullet.color;
                this.ctx.fillRect(
                    bullet.x,
                    bullet.y,
                    bullet.width,
                    bullet.height
                );
            }
        });

        this.enemies.forEach((enemy) => {
            if (this.imagesLoaded && enemy.image) {
                this.ctx.drawImage(
                    enemy.image,
                    enemy.x,
                    enemy.y,
                    enemy.width,
                    enemy.height
                );
            } else {
                this.ctx.fillStyle = enemy.color;
                this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            }
        });

        this.ctx.font = "bold 24px Arial";
        this.ctx.textAlign = "center";
        this.floatingTexts.forEach((text) => {
            this.ctx.globalAlpha = text.alpha;
            this.ctx.fillStyle = text.color;
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 3;
            this.ctx.strokeText(text.text, text.x, text.y);
            this.ctx.fillText(text.text, text.x, text.y);
        });
        this.ctx.globalAlpha = 1.0;
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById("minigame-timer");
        if (timerElement) {
            timerElement.textContent = this.timeRemaining;
        }
    }

    updateScoreDisplay() {
        const scoreElement = document.getElementById("minigame-score");
        if (scoreElement) {
            const sign = this.timeEarned >= 0 ? "+" : "";
            scoreElement.textContent = `${sign}${this.timeEarned}s`;
            scoreElement.style.color =
                this.timeEarned >= 0 ? "#22C55E" : "#EF4444";
        }
    }
}
