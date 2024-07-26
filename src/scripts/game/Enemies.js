import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Enemy } from "./Enemy";

export class Enemies {
    constructor(bg, hero, fires) {
        this.bg = bg;
        this.hero = hero;
        this.fires = fires;
        this.container = new PIXI.Container();
        this.sprites = [];
        this.healthBars = [];

        this.bg.container.addChild(this.container);
        this.createSprites();

        this.bg.onMapChange(() => {
            this.handleMapChange();
        });
    }

    handleMapChange() {
        this.clearSprites();
        this.createSprites();
    }

    createSprites() {
        if (this.bg.map === 'map1') {
            for (let i = 0; i < App.config.locationEnemies.length; i++) {
                const point = App.config.locationEnemies[i];
                const enemyType = (i < App.config.locationEnemies.length / 2) ? "Enemy_stripe" : "rat";
                if(enemyType === "Enemy_stripe"){
                    this.createEnemy(point[0], point[1], enemyType, 1);
                }
                else if(enemyType === "rat"){
                    this.createEnemy(point[0], point[1], enemyType, 3);
                }
            }
        } else if (this.bg.map === 'map2') {
            for (let i = 0; i < 7; i++) {
                this.createEnemy("?", "?", "rat", 1);
            }
        } else if (this.bg.map === 'map3') {
            for (let i = 0; i < 0; i++) {
                this.createEnemy("?", "?", "Enemy_stripe", 1);
            }
        }
    }

    createEnemy(x, y, texture, speed) {
        const enemy = new Enemy(this.bg, this.hero,this.fires, x, y, texture, speed);
        this.sprites.push(enemy);
        this.container.addChild(enemy.sprite);
        this.container.addChild(enemy.healthBar);

        enemy.onDestroy = () => {
            this.clearEnemy(enemy);
        };
    }

    clearEnemy(enemy) {
        this.container.removeChild(enemy.sprite);
        this.container.removeChild(enemy.healthBar);
        this.sprites = this.sprites.filter(e => e !== enemy);
        this.healthBars = this.healthBars.filter(hb => hb !== enemy.healthBar);
    }

    clearSprites() {
        for (const enemy of this.sprites) {
            this.container.removeChild(enemy.sprite);
            this.container.removeChild(enemy.healthBar);
        }
        this.sprites = [];
        this.healthBars = [];
    }
}
