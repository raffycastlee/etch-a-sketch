const gridButton = document.getElementById("prompt");
const mainContainer = document.getElementById("main-container");
const gridContainer = document.getElementById("grid-container");

const getGridSpec = () => {
  let newN = Number(prompt("Enter new 'n' for n x n grid: "));
  while (isNaN(newN) || newN <= 0) {
    newN = Number(prompt("Enter new 'n' for n x n grid: "));
  }

  gridContainer.replaceChildren(
    ...[...Array(newN)].map(() => {
      let row = document.createElement("div");
      row.classList.add("row");
      const children =  [...Array(newN)].map(() => {
        let column = document.createElement("div");
        column.classList.add("column");
        column.addEventListener("mouseenter", whichMode);
        column.addEventListener("mouseleave", whichMode);
        return column;
      })
      console.log(children);
      row.replaceChildren(...children);
      return row;
    })
  );
};

const resetGridColors = () => {
  document.querySelectorAll(".column").forEach((column) => {
    column.setAttribute("style", "background-color: ''");
  });
}

let currentMode = "rainbow";
let paintMode = "hover";
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
    if (currentMode === 'rainbow' && paintMode === 'hover') {
      document
        .getElementById("fade-adjust")
        .setAttribute("style", "visibility: visible");
    }
  }
  resetGridColors();
};
// return proper hover event based on mode!
const whichMode = (e) => {
  if (currentMode == "rainbow") {
    switch (e.type) {
      case 'mouseenter':
        return rainbowEnter(e);
      case 'mouseleave':
        return rainbowLeave(e);
      case 'click':
        return rainbowEnter(e);
      case 'mouseover':
        return rainbowEnter(e);
    }
  } else {
    switch (e.type) {
      case 'mouseenter':
        return opacityEnter(e);
      case 'click':
        return opacityEnter(e);
      case 'mouseover':
        return opacityEnter(e);
    }
  }
};

const startDrag = () => {
  document.querySelectorAll(".row .column").forEach((column) => {
    column.addEventListener('mouseover', whichMode);
  });
}

const endDrag = () => {
  document.querySelectorAll(".row .column").forEach((column) => {
    column.removeEventListener('mouseover', whichMode);
  });
}

// togglePaintMode
const togglePaintMode = () => {
  if (paintMode === 'hover') {
    paintMode = 'click'
    document.querySelectorAll(".row .column").forEach((column) => {
      column.removeEventListener('mouseenter', whichMode);
      column.removeEventListener('mouseleave', whichMode);
    });

    // for dragging across the grid
    document
      .querySelector('#grid-container')
      .addEventListener('mousedown', startDrag);
    document
      .querySelector('#grid-container')
      .addEventListener('mouseup', endDrag);

    // for removing transition "slider"
    document
      .getElementById("fade-adjust")
      .setAttribute("style", "visibility: hidden");

    // for changing button
    document
      .querySelector("#paint-mode")
      .textContent = 'Click Mode';
  } else {
    paintMode = 'hover';
    document.querySelectorAll(".row .column").forEach((column) => {
      column.addEventListener("mouseenter", whichMode);
      column.addEventListener("mouseleave", whichMode);
    });

    // for dragging across the grid
    document
      .querySelector('#grid-container')
      .removeEventListener('mousedown', startDrag);
    document
      .querySelector('#grid-container')
      .removeEventListener('mouseup', endDrag);

    // to make transition slider reappear
    if (currentMode === 'rainbow' && paintMode === 'hover') {
      document
        .getElementById("fade-adjust")
        .setAttribute("style", "visibility: visible");
    }
  
    // for changing button text
    document
      .querySelector("#paint-mode")
      .textContent = 'Hover Mode';
  }
  // resets all blocks
  resetGridColors();
}

// const rainbowClick = (e) => {
//   // resets when all unique colors have been used in the last 7 hovers
//   if (colors.length == 0) {
//     colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
//   }
//   // grabs and changes div color
//   color = colors.splice(Math.random() * colors.length, 1);
//   e.target.style.setProperty("transition", "0s");
//   e.target.style.setProperty(`background-color`, `${color}`);
// };

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
document.querySelector('button#mode-toggle').addEventListener("click", toggleMode);
// document.getElementById("mode-toggle").addEventListener("click", toggleMode);

// add fade inc/dec button listeners
document.getElementById("fade-inc").addEventListener("click", fadeInc);
document.getElementById("fade-dec").addEventListener("click", fadeDec);

// add color/darker mode button listeners
document.querySelectorAll(".row .column").forEach((column) => {
  column.addEventListener("mouseenter", whichMode);
  column.addEventListener("mouseleave", whichMode);
});

// add hover/click button listeners
document
  .querySelector("#paint-mode")
  .addEventListener('click', togglePaintMode);

gridButton.addEventListener("click", getGridSpec);
getGridSpec();