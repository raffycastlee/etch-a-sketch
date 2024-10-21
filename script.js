const gridButton = document.getElementById("prompt");
const mainContainer = document.getElementById("main-container");
const gridContainer = document.getElementById("grid-container");

const getGridSpec = () => {
  let newN = Number(prompt("Enter new 'n' for n x n grid: "));
  gridContainer.replaceChildren(
    ...[...Array(newN)].map(() => {
      let row = document.createElement("div");
      row.classList.add("row");
      row.replaceChildren(
        ...[...Array(newN)].map(() => {
          let column = document.createElement("div");
          column.classList.add("column");
          column.addEventListener("mouseenter", whichMode);
          column.addEventListener("mouseleave", whichMode);
          return column;
        })
      );
      return row;
    })
  );
};

let currentMode = "rainbow";
let fadeDuration = 0.3;
let fadeRevert = fadeDuration;
// mode-toggle between random rainbow and progressive darkening!
const toggleMode = () => {
  if (currentMode == "rainbow") {
    currentMode = "opacity";
    fadeRevert = fadeDuration;
    fadeDuration = 0;
    document.getElementById("mode-toggle").textContent = "BNW Opacity Mode";
    document
      .getElementById("fade-adjust")
      .setAttribute("style", "visibility: hidden");
  } else {
    currentMode = "rainbow";
    fadeDuration = fadeRevert;
    document.getElementById("mode-toggle").textContent = "Color Trail Mode";
    document.querySelectorAll(".column").forEach((column) => {
      column.setAttribute("style", "background-color: ''");
    });
    document
      .getElementById("fade-adjust")
      .setAttribute("style", "visibility: visible");
  }
};
// return proper hover event based on mode!
const whichMode = (e) => {
  if (currentMode == "rainbow") {
    if (e.type == "mouseenter") {
      return rainbowEnter(e);
    }
    return rainbowLeave(e);
  } else {
    if (e.type == "mouseenter") {
      return opacityEnter(e);
    }
  }
};

// randomizes hover colors, but makes sure to cycle on each unique
// before being able to repeat colors!
let colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
const rainbowEnter = (e) => {
  // resets when all unique colors have been used in the last 7 hovers
  if (colors.length == 0) {
    colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
  }
  // grabs and changes div color
  color = colors.splice(Math.random() * colors.length, 1);
  e.target.style.setProperty("transition", "0s");
  e.target.style.setProperty(`background-color`, `${color}`);
};

// mouse off does a fade
const rainbowLeave = (e) => {
  e.target.style.setProperty("transition", `all ${fadeDuration}s`);
  e.target.style.removeProperty(`background-color`, ``);
};

// makes progressively stronger opacity, up to black!
const opacityEnter = (e) => {
  let opacity = getComputedStyle(e.target).backgroundColor;
  // check if rgba is maxed out (maxed is rgb(0, 0, 0) only without a fourth value)
  if (opacity.length <= 12) {
    return;
  }

  // band aid fix for fading side effect help ME GOD
  e.target.style.setProperty("transition", `all ${fadeDuration}s`);

  // .match() from last comma to last paren, then convert to string
  opacity = opacity.match(/,\s\d?.?\d?\)$/);
  opacity = opacity.join("");
  // .slice() take just the float/num value
  opacity = opacity.slice(2, opacity.length - 1); // for some reason slice has to be in the next line??
  opacity = String((Number(opacity) + 0.1).toFixed(1));
  e.target.style.setProperty("background", `rgba(0, 0, 0, ${opacity})`);
};

// fade inc/dec
const fadeInc = () => {
  fadeDuration = Number((fadeDuration + 0.1).toFixed(1));
  document.getElementById("fade-duration").textContent = `${fadeDuration}s`;
};
const fadeDec = () => {
  if (fadeDuration == 0) {
    return;
  }
  fadeDuration = Number((fadeDuration - 0.1).toFixed(1));
  document.getElementById("fade-duration").textContent = `${fadeDuration}s`;
};

// add mode toggle event listener
document.getElementById("mode-toggle").addEventListener("click", toggleMode);

// add fade inc/dec button listeners
document.getElementById("fade-inc").addEventListener("click", fadeInc);
document.getElementById("fade-dec").addEventListener("click", fadeDec);

// add hover event listeners
document.querySelectorAll(".row .column").forEach((column) => {
  column.addEventListener("mouseenter", whichMode);
  column.addEventListener("mouseleave", whichMode);
});

gridButton.addEventListener("click", getGridSpec);
