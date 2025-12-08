import { Digimon } from '../objects/digimon/Digimon.js';

/**
 * 게임 메인 씬
 * 디지몬을 키우는 메인 게임 화면
 */
export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // JSON 데이터 로드
        this.load.json('digimonList', 'src/data/digimon_list.json');
        this.load.json('animations', 'src/data/animations.json');
        
        // 디지몬 스프라이트 이미지 로드 (210~255 범위)
        for (let i = 210; i <= 255; i++) {
            this.load.image(`digimon_${i}`, `assets/images/Ver1_Mod_Kor/${i}.png`);
        }
        
        // 고기 스프라이트 이미지 로드 (526~529 범위)
        for (let i = 526; i <= 529; i++) {
            this.load.image(`meat_${i}`, `assets/images/Ver1_Mod_Kor/${i}.png`);
        }
    }

    create() {
        // JSON 데이터 가져오기
        const digimonList = this.cache.json.get('digimonList');
        const animations = this.cache.json.get('animations');
        
        // 화면 중앙에 디지몬 생성
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        this.digimon = new Digimon(this, centerX, centerY, digimonList, animations);
        
        // 시계 UI (화면 우측 상단)
        const clockX = this.cameras.main.width - 20;
        const clockY = 20;
        this.clockText = this.add.text(clockX, clockY, '', {
            fontSize: '18px',
            fill: '#000000',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: 'transparent'
        }).setOrigin(1, 0).setDepth(100);
        
        // 밥 먹기 버튼 생성 (화면 하단 중앙)
        const buttonX = this.cameras.main.width / 2;
        const buttonY = this.cameras.main.height - 80;
        
        this.eatButton = this.add.rectangle(buttonX, buttonY, 150, 50, 0x4a90e2)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                // Digimon의 eat() 메서드 호출 (모든 로직이 내부에 통합됨)
                this.digimon.eat();
            })
            .on('pointerover', () => {
                this.eatButton.setFillStyle(0x357abd);
            })
            .on('pointerout', () => {
                this.eatButton.setFillStyle(0x4a90e2);
            });
        
        this.eatButtonText = this.add.text(buttonX, buttonY, '밥 먹기', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5);
        
        console.log('디지몬 다마고치 게임이 시작되었습니다!');
    }

    update(time, delta) {
        if (this.digimon) {
            this.digimon.update(time, delta);
        }
        
        // 시계 업데이트
        if (this.clockText) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            this.clockText.setText(`${hours}:${minutes}:${seconds}`);
        }
    }
}

