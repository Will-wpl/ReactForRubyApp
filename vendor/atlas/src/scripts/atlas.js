// polyfills
import './core/polyfills/matches';
import './core/polyfills/closest';

// import fonts
const requireImages = require.context('../images', true, /\.(jpe?g|png|gif)$/);
requireImages.keys().forEach(requireImages);

// import JS components
import MobileNav from './mobile-nav';
import SearchToggle from './search-toggle';
import Dropdown from './dropdown';
import Tabs from './tabs';
import Alert from './alert';
import LumiMap from './lumimap';

const Atlas = {};

Atlas.MobileNav = MobileNav;
Atlas.SearchToggle = SearchToggle;
Atlas.Dropdown = Dropdown;
Atlas.Tabs = Tabs;
Atlas.Alert = Alert;
Atlas.LumiMap = LumiMap;

document.addEventListener('DOMContentLoaded', mainInit, false);

function mainInit() {
  // init mobile nav
  const nav = document.querySelector('[data-mobile-nav]');

  if (nav) {
    new Atlas.MobileNav(nav);
  }

  // init header mobile search toggle
  const search = document.querySelector('[data-search-toggle]');
  if (search) {
    new Atlas.SearchToggle(search);
  }

  // init dropdowns
  const dropdowns = document.querySelectorAll('[data-dropdown]');
  if (dropdowns.length > 0) {
    for (var i = 0; i < dropdowns.length; i++) {
      new Atlas.Dropdown(dropdowns[i]);
    }
  }

  // init tabs
  const tabs = document.querySelectorAll('[data-tabs]');
  if (tabs.length > 0) {
    for (var i = 0; i < tabs.length; i++) {
      new Atlas.Tabs(tabs[i]);
    }
  }

  // init alert
  const alerts = document.querySelectorAll('.alert');
  if (alerts.length > 0) {
    for (var i = 0; i < alerts.length; i++) {
      new Atlas.Alert(alerts[i]);
    }
  }
}

window.Atlas = Atlas;

window.domReady = function(fn) {

  if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
  ) {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn, false);
  }
}

export default Atlas;