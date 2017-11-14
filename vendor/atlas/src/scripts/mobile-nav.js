import Toggle from './toggle';

class MobileNav extends Toggle {
  constructor(element) {
    super(element, MobileNav.options);
    this._init();
  }

  _init() {
    super._init();
    if (this.element.querySelector(MobileNav.options.selectorTrigger)) {
     this._setInnerText(this._getIsActiveInnerHTML());
    }
  }

  _getIsActiveInnerHTML() {
    return this.element.querySelector(MobileNav.options.classActiveLink).innerHTML;
  }

  _setInnerText(text) {
    this.element.querySelector(MobileNav.options.selectorTrigger).innerText = text;
  }
}

MobileNav.options = {
  selectorInit: '[data-mobile-nav]',
  selectorTrigger: '[data-mobile-nav-trigger]',
  classOpen: 'is-open',
  classActiveLink: '.lm--header-item.is-active .lm--header-link'
};

export default MobileNav;
