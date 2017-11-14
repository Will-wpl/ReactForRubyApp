if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    let ancestor = this;
    if (!document.documentElement.contains(el)) return null;
    do {
      if (ancestor.matches(s)) return ancestor;
      ancestor = ancestor.parentElement;
    } while (ancestor !== null);
    return el;
  };
}
