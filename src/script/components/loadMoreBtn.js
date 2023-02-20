export default class LoadMoreBtn {
  constructor({ selector, isHidden }) {
    this.button = this.getButton(selector);
    if (isHidden) this.hide();
    else this.show();
  }

  getButton(selector) {
    return document.querySelector(selector);
  }

  hide() {
    this.button.classList.add('visually-hidden');
  }

  show() {
    this.button.classList.remove('visually-hidden');
  }

  disable() {
    this.button.disabled = true;
    this.button.textContent = 'Loading more...';
  }

  enable() {
    this.button.disabled = false;
    this.button.textContent = 'Load more';
  }
}
