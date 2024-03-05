const main_btn = document.querySelector("#mobile-menu-btn");
const main_menu = document.querySelector("#mobile-menu");
const user_btn = document.querySelector("#user-menu-btn");
const user_menu = document.querySelector("#user-menu");

main_btn.addEventListener("click", () => {
  main_menu.classList.toggle("md:hidden");
  main_menu.classList.toggle("hidden");
});

user_btn.addEventListener("click", () => {
  user_menu.classList.toggle("hidden");
  user_menu.classList.toggle("block");
});

window.addEventListener("click", (e) => {
  if (!e.target.closest("button")) {
    user_menu.classList.add("hidden");
  }
  if (e.target.closest("button")) {
    if (e.target.closest("button").id !== "user-menu-btn") {
      user_menu.classList.add("hidden");
    }
  }
  /*   console.log(e.target.closest("button").id);
  user_menu.classList.add("hidden"); */
});
