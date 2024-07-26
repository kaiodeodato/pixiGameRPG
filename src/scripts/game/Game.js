import { App } from "../system/App";
import { Scene } from '../system/Scene';
import { Background } from "./Background";
import { Hero } from "./Hero";
import { Atack } from "./Atack";
import { Display } from "./Display";
import { Enemies } from "./Enemies";
import { Hearts } from "./Hearts";
import { Fires } from "./Fires";

export class Game extends Scene {

    create() {
        this.timeSinceLastDamage = 0;
        this.gameOver = false;
        this.createBackground();
        this.createHero();
        this.createFires();
        this.createEnemies();
        this.createDisplay();
        this.createAtack();
        this.createHearts();
        
    }
    createBackground() {
        this.bg = new Background();
        this.container.addChild(this.bg.container);
    }
   
    createHero() {
        this.hero = new Hero(this.bg, () => this.display.updateLife());
        this.container.addChild(this.hero.sprite);
    }

    createDisplay() {
        this.display = new Display(this.hero);
        this.container.addChild(this.display.container);
    }

    createEnemies() {
        this.enemies = new Enemies(this.bg, this.hero, this.fires);
        this.container.addChild(this.enemies.container);
    }
    
    createAtack() {
        this.atack = new Atack(this.bg, this.hero, this.enemies, this.fires);
        this.container.addChild(this.atack.sprite);
    }

    createHearts() {
        this.hearts = new Hearts(this.bg, this.hero, this.display);
    }

    createFires() {
        this.fires = new Fires(this.bg, this.hero);
    }
    
    checkHeroCollisions(dt) {
        let heroColliding = false;

        for (const enemy of this.enemies.sprites) {
            enemy.update(dt);
            if (this.hero.isCollidingWith(enemy.sprite)) {
                heroColliding = true;
            }
        }

        if (this.fires && this.fires.isCollidingWith(this.hero.sprite)) {
            heroColliding = true;
        }

        if (heroColliding) {
            this.hero.takeDamage(1);
            if (this.hero.life === 0 && !this.gameOver) {
                this.gameOver = true;
                console.log('GAME OVER...');
                setTimeout(() => {
                    App.start();
                }, 1000);
            }
        }
    }

    cameraMoviment(dt) {
        this.hero.update(dt);

        const heroX = this.hero.sprite.x;
        const heroY = this.hero.sprite.y;

        this.container.x = - heroX + window.innerWidth / 2;
        this.container.y = - heroY + window.innerHeight / 2;

        this.display.container.x = - this.container.x;
        this.display.container.y = - this.container.y;
    }

    update(dt) {
        this.bg.update(dt);
        this.atack.update(dt);
        this.hearts.update(dt);
        this.checkHeroCollisions(dt);
        this.cameraMoviment(dt);
    }
}
