



class App {
    constructor(options) {
        this.options = options;
        this.indexPlaying = 0;
        this.soundCols = [];
        this.createBlocks();
        this.initLoop();
    }
    createBlocks() {
        for (let i = 0; i < this.options.divisions; i++) {
            this.soundCols.push(new SoundCol({ ...this.options, division: i }));
        }
    }
    initLoop() {
        let loopIndex = 0;
        setInterval(() => {
            this.indexPlaying = loopIndex % this.options.divisions;
            this.soundCols.forEach(soundCol => soundCol.pause());
            this.soundCols[this.indexPlaying].play();
            loopIndex++;
        }, this.options.delay);
    }
}

class SoundCol {
    constructor(options) {
        this.options = options;
        this.soundBlocks = [];
        this.createColDom();
        this.createBlocks();
    }
    createColDom() {
        let block = document.createElement('div');
        block.classList.add('sound_col');
        document.querySelector('.app').appendChild(block);
    }
    createBlocks() {
        for (let i = 0; i < this.options.heights; i++) {
            this.soundBlocks.push(new SoundBlock({ ...this.options, height: i }));
        }
    }
    play() {
        this.soundBlocks.forEach(block => {
            block.block.classList.add('playing');
            block.playing = true;
            block.sound();
        });
    }
    pause() {
        this.soundBlocks.forEach(block => {
            block.block.classList.remove('playing');
            block.playing = false;
            block.mute();
        });
    }
}

class SoundBlock {
    constructor(options) {
        this.block;
        this.options = options;
        this.active = false;
        this.playing = false;
        let frequency = 600 - this.options.height * 80;
        this.tone = new Tone.Oscillator({
            type: "square",
            frequency: frequency,
            volume: -16,
        }).toMaster();

        this.createBlockDom();
        this.initEvents();
    }
    createBlockDom() {
        this.block = document.createElement('div');
        this.block.classList.add('sound_block');
        // block.style.backgroundColor = `hsl(${this.options.division}, 100, ${})`;
        document.querySelectorAll('.sound_col')[this.options.division].appendChild(this.block);
    }
    initEvents() {
        this.block.addEventListener('click', () => {
            this.toggleBlock();
        });
    }
    toggleBlock() {
        if (this.block.classList.contains('active')) {
            this.block.classList.remove('active');
            this.active = false;
        } else {
            this.block.classList.add('active');
            this.active = true;
        }
    }
    sound() {
        if (this.active) {
            this.tone.start();
        }
    }
    mute() {
        this.tone.stop();
    }
}


let app = new App({
    divisions: 8,
    heights: 5,
    delay: 500
});

