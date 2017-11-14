class Tabs {
  constructor(element) {
    this.element = element;
    this.tabs = Array.from(element.querySelectorAll(Tabs.options.selectorTab));
    this.links = this.tabs.map(tab => tab.querySelector(Tabs.options.selectorLink));
    this.hashes = this.links.map((link) => {
      const href = link.getAttribute('href');
      // if href is fully-qualified url, null is pushed instead
      return href[0] === '#' ? href : null;
    });
    this.panes = this.links.map(link =>
      document.getElementById(link.getAttribute('href').substring(1)),
    );

    this.trigger = this.element.querySelector(Tabs.options.selectorTrigger);

    this.selectedIndex = -1;
    this._init();
  }

  _init() {
    // bind click handler
    document.addEventListener('click', this._handleClick.bind(this));

    // set starting index
    this.setSelectedIndex(this.getStartingIndex());

    // if trigger exists, process trigger
    if (this.trigger) {
      this.processTrigger();
    }
  }

  /*
  * Determine starting tab index in this priority:
  * 1. look for url #hash
  * 2. look for active nav item
  * 3. look for active pane
  * 4. default to first tab
  */
  getStartingIndex() {
    // 1. look for url #hash
    const urlHash = this.hashes.indexOf(window.location.hash);
    if (urlHash > -1) return urlHash;

    // 2. look for active nav item
    const navIndex = this.tabs.findIndex(
      tab => tab && tab.classList.contains(Tabs.options.classActive),
    );
    if (navIndex > -1) return navIndex;

    // 3. look for active pane
    const paneIndex = this.panes.findIndex(
      pane => pane && pane.classList.contains(Tabs.options.classActive),
    );
    if (paneIndex > -1) return paneIndex;

    // 4. default to first tab
    return 0;
  }

  /*
  * Add data-triggerable attribute to element for CSS styling
  * Set initial trigger text
  */
  processTrigger() {
    this.element.setAttribute('data-triggerable', '');
    this.trigger.innerText = this.links[this.selectedIndex].text;
  }

  _handleClick(event) {
    const target = event.target;

    // if this element is clicked
    if (this.element.contains(target)) {
      // target is selectorLink
      if (target.matches(Tabs.options.selectorLink)) {
        const index = this.links.indexOf(target);
        if (index > -1) {
          this.setSelectedIndex(index);
        }
        if (this.element.classList.remove(Tabs.options.classOpen));
      } else if (target.matches(Tabs.options.selectorTrigger)) {
        // target is trigger
        this.element.classList.toggle('is-open');
      }
    }
  }

  setSelectedIndex(index) {
    if (index === this.selectedIndex || index < 0 || index >= this.tabs.length) return;
    this._selectTab(index);
    this._selectPane(index);
    this.selectedIndex = index;
  }

  _selectTab(index) {
    const newTab = this.tabs[index];
    this.tabs.forEach(tab => tab.classList.remove(Tabs.options.classActive));
    if (newTab) newTab.classList.add(Tabs.options.classActive);

    if (this.trigger) {
      this.trigger.innerText = newTab.querySelector(Tabs.options.selectorLink).text;
    }
  }

  _selectPane(index) {
    // return early if this.panes[index] is null
    if (!this.panes[index]) return;

    const newPane = this.panes[index];
    this.panes.forEach(pane => pane && pane.classList.remove(Tabs.options.classActive));
    if (newPane) newPane.classList.add(Tabs.options.classActive);
  }
}

Tabs.options = {
  selectorInit: '[data-tabs]',
  selectorTab: '.lm--tabs-item',
  selectorLink: '.lm--tabs-link',
  selectorTrigger: '.lm--tabs-trigger',
  classActive: 'is-active',
  classOpen: 'is-open',
};

export default Tabs;
