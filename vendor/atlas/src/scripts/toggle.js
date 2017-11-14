class Toggle {
  constructor(element, options) {
    this.element = element;
    this.options = Object.assign({}, Toggle.options, options);
    this.open = false;
  }

  _init() {
    document.addEventListener('click', this._handleClick.bind(this));
  }

  _handleClick(event) {
    if (this.element.contains(event.target) && event.target.closest(this.options.selectorTrigger)) {
      this.open ? this._close() : this._open();
    } else {
      this._close();
    }
  }

  _close() {
    this.element.classList.remove(this.options.classOpen);
    this.open = false;
  }

  _open() {
    this.element.classList.add(this.options.classOpen);
    this.open = true;
  }
}

Toggle.options = {
  selectorInit: '[data-toggle]',
  selectorTrigger: '[data-toggle-trigger]',
  classOpen: 'is-open',
};

export default Toggle;
