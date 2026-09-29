// Anti-clickjacking: the admin must never run inside another site's frame.
if (window.top !== window.self) {
  document.documentElement.style.display = 'none';
  window.top.location = window.self.location.href;
}
