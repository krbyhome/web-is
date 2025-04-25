const decorateCurrentPage = () => {
  const location = document.location.href;
  const elements = document.querySelectorAll(".header__item-onmouseover");
  elements.forEach((element) => {
    console.log(element.href);
    console.log(location);
    if (element.href === location) {
      element.style.textDecoration = "underline";
      element.style.textDecorationThickness = "3px";
    }
  });
};

(function () {
  const startTime = performance.now();

  window.onload = () => {
    const endTime = performance.now();
    const loadTime = (endTime - startTime);
    const loadTimeInSeconds = (loadTime / 1000).toFixed(3)
    const element = document.getElementById("page-load-time");
    const text = document.createTextNode(`Load time: ${loadTimeInSeconds}`);
    element.appendChild(text);
    decorateCurrentPage();
  };
})();
