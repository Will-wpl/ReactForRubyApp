class Alert {
  constructor(element, options) {
    this.element = element;
    this.options = Object.assign({}, Alert.options, options);
    this._init();
  }

  _init() {
    this._handleClick = this._handleClick.bind(this);
    document.addEventListener('click', this._handleClick);
  }

  _handleClick(event) {
    if (this.element.contains(event.target) && event.target.closest(this.options.selectorTrigger)) {
      this._destroy();
    }
  }

  _destroy() {
    document.removeEventListener('click', this._handleClick);
    this.element.remove();
  }
}

Alert.options = {
  selectorTrigger: '[data-dismiss]',
};

export default Alert;
