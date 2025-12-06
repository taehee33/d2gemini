import { TitleScene } from './scenes/TitleScene.js';
import { GameScene } from './scenes/GameScene.js';

// Phaser 3 게임 설정
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: 0x808080, // 회색 배경
    parent: 'game-container',
    scene: [TitleScene, GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

// 게임 인스턴스 생성
const game = new Phaser.Game(config);

