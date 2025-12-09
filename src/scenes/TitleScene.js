/**
 * 타이틀 씬
 * 게임 시작 화면
 */
export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // 타이틀 텍스트
        this.add.text(width / 2, height / 2 - 100, '디지몬 다마고치', {
            fontSize: '48px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // 시작 버튼
        const startButton = this.add.rectangle(width / 2, height / 2 + 50, 200, 50, 0x4a90e2)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('GameScene');
            });

        this.add.text(width / 2, height / 2 + 50, '게임 시작', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // 키보드 입력으로도 시작 가능
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
    }
}


