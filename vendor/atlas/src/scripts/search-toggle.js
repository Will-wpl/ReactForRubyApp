import Toggle from './toggle';

class SearchToggle extends Toggle {
  constructor(element) {
    super(element, SearchToggle.options);
    this.field = this.element.querySelector(this.options.selectorField);
    this._init();
  }

  _init() {
    super._init();
    // handle field blur
    this.field.addEventListener('keydown', this._handleKeydown.bind(this));
    this.field.addEventListener('click', this._handleFieldClick.bind(this));
  }

  _handleFieldClick(event) {
    event.stopPropagation();
  }

  _handleKeydown(event) {
    // if 'tab' is pressed, close the component
    if ((event.which || event.keyCode) == 9) {
      this._close();
    }
  }

  _open() {
    super._open();
    this.field.focus();
  }
}

SearchToggle.options = {
  selectorInit: '[data-search-toggle]',
  selectorTrigger: '[data-search-toggle-trigger]',
  selectorField: '[data-field]',
  classOpen: 'is-open',
};

export default SearchToggle;
