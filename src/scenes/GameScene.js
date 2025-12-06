import { Digimon } from '../objects/digimon/Digimon.js';

/**
 * 게임 메인 씬
 * 디지몬을 키우는 메인 게임 화면
 */
export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // 화면 중앙에 디지몬 생성
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        this.digimon = new Digimon(this, centerX, centerY);
        
        // 배고픔 수치 표시 텍스트 (화면 위쪽 중앙)
        const screenWidth = this.cameras.main.width;
        this.hungerText = this.add.text(screenWidth / 2, 50, `배고픔: ${Math.floor(this.digimon.data.hunger)}`, {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#000000',
            padding: { x: 15, y: 10 },
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(1000);
        
        console.log('디지몬 다마고치 게임이 시작되었습니다!');
    }

    update(time, delta) {
        if (this.digimon) {
            this.digimon.update(time, delta);
            
            // 배고픔 텍스트 실시간 업데이트
            if (this.hungerText && this.digimon.data) {
                this.hungerText.setText(`배고픔: ${Math.floor(this.digimon.data.hunger)}`);
                
                // 배고픔에 따라 텍스트 색상 변경
                if (this.digimon.data.hunger > 50) {
                    this.hungerText.setColor('#00ff00'); // 초록색 (배부름)
                } else if (this.digimon.data.hunger > 20) {
                    this.hungerText.setColor('#ffff00'); // 노란색 (보통)
                } else {
                    this.hungerText.setColor('#ff0000'); // 빨간색 (배고픔)
                }
            }
        }
    }
}

