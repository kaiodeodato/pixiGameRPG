import { Scene } from '../system/Scene';
import { Background } from "./Background";
import { Hero } from "./Hero";
import { Atack } from "./Atack";


export class Game extends Scene {
    create() {
        this.createHero(); 
        this.createBackground();
        this.createAtack()
    }
   
    createHero() {
        this.hero = new Hero();
    }

    createAtack() {
        this.atack = new Atack();
        this.container.addChild(this.atack.sprite);
    }

    createBackground() {
        this.bg = new Background(this.hero);
        this.container.addChild(this.bg.container);
        this.container.addChild(this.hero.sprite);
    }

    update(dt) {
        this.bg.update(dt);
        this.hero.update(dt);
        this.atack.update(dt);
    }
}
