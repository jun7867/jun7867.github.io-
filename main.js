"use strict";

// Make navber transparent when it is on the top
const navbor = document.querySelector("#navbar");
const navbarHeight = navbar.getBoundingClientRect().height;

document.addEventListener("scroll", () => {
  if (window.scrollY > navbarHeight) {
    navbar.classList.add("navbar--dark");
  } else {
    navbar.classList.remove("navbar--dark");
  }
});

// Handle scrolling when tapping on the navbar menu
const navbarMenu = document.querySelector(".navbar__menu");
navbarMenu.addEventListener("click", (event) => {
  const target = event.target;
  const link = target.dataset.link;
  if (link == null) {
    return;
  }
  scrollIntoView(link);
});

// Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector(".navbar__toggle-btn");
navbarToggleBtn.addEventListener("click", () => {
  navbarMenu.classList.toggle("open");
});

// Handle click on "contact me" button on home

const homeContactBtn = document.querySelector(".home__contact");
homeContactBtn.addEventListener("click", () => {
  scrollIntoView("#contact");
});

// Make home slowly fade to transparent as the window scrolls down.

const home = document.querySelector(".home__container");
const home__contact = document.querySelector(".home__contact");
const homeHeight = home.getBoundingClientRect().height;
// const navbarHeight = navbor.getBoundingClientRect().height;

document.addEventListener("scroll", () => {
  home.style.opacity = 1.25 - window.scrollY / (homeHeight + navbarHeight);
  home__contact.style.opacity =
    1.25 - window.scrollY / (homeHeight + navbarHeight);
});

home__contact.addEventListener("mouseenter", (e) => {
  home__contact.style.opacity = 1;
});

home__contact.addEventListener("mouseleave", (e) => {
  home__contact.style.opacity = 1 - window.scrollY / homeHeight;
});

// Show "arrow up" button when scrolling down
const arrowUp = document.querySelector(".arrow-up");
document.addEventListener("scroll", (e) => {
  if (window.scrollY > homeHeight / 2) {
    arrowUp.classList.add("visible");
  } else {
    arrowUp.classList.remove("visible");
  }
});

// Handle click on the "arrow up" button
arrowUp.addEventListener("click", () => {
  scrollIntoView("#home");
});

// Projects work
const workBtnContainer = document.querySelector(".work__categories");
const projectContainer = document.querySelector(".work__projects");
const projects = document.querySelectorAll(".project");
// parentNode는 숫자를 클릭했을때도 처리해주려고
workBtnContainer.addEventListener("click", (e) => {
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  if (filter == null) {
    return;
  }

  // Remove selection from the previous item and select the new one.
  const active = document.querySelector(".category__btn.selected");
  active.classList.remove("selected");
  const target =
    e.target.nodeName === "BUTTON" ? e.target : e.target.parentNode;
  target.classList.add("selected");

  projectContainer.classList.add("anim-out");

  // 일정시간이 지나고 anim-out을 없애줘야함. 다시 나타나게
  setTimeout(() => {
    //시간이 0.3초 지나고 나서 애니메이션을 자연스럽게 하기 위해서
    projects.forEach((project) => {
      // 타입이 같거나 all일때는 invisible하게 만든거를 빼주고 같지않으면 invisible을 추가해준다.
      if (filter === "*" || filter === project.dataset.type) {
        project.classList.remove("invisible");
      } else {
        project.classList.add("invisible");
      }
    });

    projectContainer.classList.remove("anim-out");
  }, 300);
});

// intersection observer 사용.
// 1단계 모든 요소 가져오기
const sectionIds = ["#home", "#about", "#skills", "#work", "#contact"];

//배열을 돌면서 각 id를 section dom요소로 변환 => map
const sections = sectionIds.map((id) => document.querySelector(id));
const navItems = sectionIds.map((id) =>
  document.querySelector(`[data-link="${id}"]`)
);

// 2단계 observer
let selectedNavIndex = 0;
let selectedNavItem = navItems[0];

function selectNavItem(selected) {
  selectedNavItem.classList.remove("active");
  selectedNavItem = selected;
  selectedNavItem.classList.add("active");
}

const observerOptions = {
  root: null,
  rootMargin: "0px", // viewport에서 +rootMargin값을 포함한 부분까지 확인. (눈에 보이기 전에 확인하고 싶으면 or 컨텐츠를 미리 준비하기 위해)
  threshold: 0.3, // 얼마만큼 보여줘야 callback함수가 처리되는지. (1로 설정하면 화면에 다 들어와야 callback실행됨) 0~1(100%)
};
const observerCallback = (entries, observer) => {
  // entries (화면에 들어온 요소의 정보를 담고 있다. boundingClientRect, intersectionRatio ..)
  entries.forEach((entry) => {
    // entry가 나가는 상황이면 index +1 에 표시
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      // 스크롤링이 아래로 되어서 페이지가 올라가서 안보이기 시작할 때
      if (entry.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1;
      } else {
        selectedNavIndex = index - 1;
      }
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach((section) => observer.observe(section));

window.addEventListener("wheel", () => {
  if (window.scrollY === 0) {
    selectedNavIndex = 0;
  } else if (
    window.scrollY + window.innerHeight ===
    document.body.clientHeight
  ) {
    selectedNavIndex = navItems.length - 1;
  }
  selectNavItem(navItems[selectedNavIndex]);
});

function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
  selectNavItem(navItems[sectionIds.indexOf(selector)]);
}
