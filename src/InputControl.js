class InputControl {
  constructor() {
    this.keyState = {};
  }

  init() {
    this.addKeyListener();
  }

  addKeyListener() {
    document.addEventListener('keydown', (event) => {
      this.keyState[event.key] = true;
    });
    document.addEventListener('keyup', (event) => {
      this.keyState[event.key] = false;
    });
  }

  checkArrowKeys() {
    if (this.keyState['ArrowLeft']) {
      console.log('ArrowLeft');
    }
    if (this.keyState['ArrowRight']) {
      console.log('ArrowRight');
    }
    if (this.keyState['ArrowUp']) {
      console.log('ArrowUp');
    }
    if (this.keyState['ArrowDown']) {
      console.log('ArrowDown');
    }
  }

  checkKey(key) {
    if (this.keyState[key]) {
      return true;
    }
  }

  checkState() {
    this.checkArrowKeys();
    // this.checkKey('[');
    if (this.checkKey('=')) {
      return 'SpeedUp';
    }
    if (this.checkKey('-')) {
      return 'SlowDown';
    }

    return null;
  }
}

export default InputControl;
