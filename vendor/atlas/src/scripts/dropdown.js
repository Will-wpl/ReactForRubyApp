import Toggle from './toggle';

class Dropdown extends Toggle {
  constructor(element) {
    super(element, Dropdown.options);
    this._init();
  }
}

Dropdown.options = {
  selectorInit: '[data-dropdown]',
  selectorTrigger: '[data-dropdown-trigger]',
  classOpen: 'is-open',
};

export default Dropdown;
