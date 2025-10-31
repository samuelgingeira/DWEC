const progressBar = document.getElementById("scrollProgress");
const backToTopBtn = document.getElementById("backToTop");

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = (scrollTop / totalHeight) * 100;

  progressBar.value = scrollPercent;

  if (scrollTop > window.innerHeight) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
}

window.addEventListener("scroll", updateScrollUI);

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
