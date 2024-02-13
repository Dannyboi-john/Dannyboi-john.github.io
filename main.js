import { dragOverHandler as dragOverHandler } from "./drag-over-handler.js";
import { dragLeaveHandler } from "./drag-leave-handler.js";
import { dropHandler } from "./drop-handler.js";
import { dragMoveListener } from "./drag-move-listener.js";
import { createColorButton } from "./create-color-button.js";

//Gets width and height and stores them in variables
function getInput() {
  var inputx = document.getElementById("userInputx").value;
  var inputy = document.getElementById("userInputy").value;
  var gridInputx = document.getElementById("grid-constuctor-x").value;
  var gridInputy = document.getElementById("grid-constructor-y").value;

  if (inputx > gridInputx || inputy > gridInputy) {
    alert("Oops! Looks like your image is bigger than the grid!");
  } else if (inputx === "") {
    gridStandalone(gridInputx, gridInputy);
    createClearButton();
    createColorPicker();
    createColorButton();
    createHideButton();
    document.getElementById("img-notice").innerHTML = "Your grid has been created below!";
  } else {
    pixelate(inputx, inputy);
    document.getElementById("img-notice").innerHTML = "Your image has been pixelated below!";
    clearGrid();
    createGrid(gridInputx, gridInputy, inputx, inputy);
    createColorButton();
    createClearButton();
    createHideButton();
    createColorPicker();
    updateGrid();
    reinitializeSnapping();
  }
};

window.dragOverHandler = dragOverHandler;
window.dragLeaveHandler = dragLeaveHandler;
window.dropHandler = dropHandler;
window.getInput = getInput;
window.dragMoveListener = dragMoveListener;
window.pixelate = pixelate;
window.createColorButton = createColorButton;
window.updateGrid = updateGrid;
window.reinitializeSnapping = reinitializeSnapping;
window.gridStandalone = gridStandalone;
window.createClearButton = createClearButton;
window.createHideButton = createHideButton;
window.createColorPicker = createColorPicker;
window.recalculateGrid = recalculateGrid;
window.clearGrid = clearGrid;

let browse = document.querySelector(".browse");
let input = document.getElementById("browse-images")

browse.onclick = () => {
  input.click();
};

input.addEventListener('change', function() {
  let file = this.files[0]
  let fileType = file.type;
    let validExtensions = ['image/jpg', 'image/jpeg', 'image/png'];

    // If dropped image is valid format, accept
    if(validExtensions.includes(fileType)) {
    const reader = new FileReader();
      reader.onload = () => {
        window.imgURL = reader.result;
        const submitted_img = document.createElement('img');
        submitted_img.src = imgURL;
        submitted_img.setAttribute("id", "dropped_img");
        document.getElementById("drop-zone").innerHTML = ""
        document.getElementById("drop-zone").appendChild(submitted_img);

    };
    reader.readAsDataURL(file);
  };
});

//'Enter' Event listener
document.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("myBtn").click();
    }
});

function pixelate(pixel_size_x, pixel_size_y) {

  if (document.getElementById("cell") != null) {
    clearGrid();
      // Initiate canvas in drop zone
      const element = document.getElementById("dropped_img");
      let real_width = element.naturalWidth;
      let real_height = element.naturalHeight;
  
      const canvas = document.getElementById('myCanvas');
      const ctx = canvas.getContext('2d');
  
      canvas.height = real_height;
      canvas.width = real_width;
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pixelatedImg = new Image();
      pixelatedImg.src = imgURL;
  
      ctx.scale((pixel_size_x / real_width), (pixel_size_y / real_height));
      ctx.drawImage(pixelatedImg, 0, 0);
  
      // Make next drawing erase what's currently on the canvas
      ctx.globalCompositeOperation = 'copy';
  
      // Nearest Neighbor
      ctx.imageSmoothingEnabled = false;
                          
      // Scale up
      ctx.setTransform((real_width / pixel_size_x), 0, 0, (real_height / pixel_size_y), 0, 0);
  
      var hRatio = canvas.width / pixelatedImg.width;
      var vRatio = canvas.height / pixelatedImg.height;
      var ratio = Math.min(hRatio, vRatio);
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, (canvas.width*ratio), (canvas.height*ratio));
      
      // reset all to defaults
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.imageSmoothingEnabled = true;

      //Shows the canvas again if grid has been created first
      var canvasHider = document.getElementById("myCanvas");
      canvasHider.style.display = "block";

      //Hides the Grid buttons as well.
      var buttonHider = document.getElementById("grid-buttons-id");
      buttonHider.style.display = "none";

  } else if (document.getElementById("dropped_img") == null) {
    alert("Please submit an image to pixelate!");
  } else { 

    // Initiate canvas in drop zone
    const element = document.getElementById("dropped_img");
    let real_width = element.naturalWidth;
    let real_height = element.naturalHeight;

    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    canvas.height = real_height;
    canvas.width = real_width;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const pixelatedImg = new Image();
    pixelatedImg.src = imgURL;

    ctx.scale((pixel_size_x / real_width), (pixel_size_y / real_height));
    ctx.drawImage(pixelatedImg, 0, 0);

    // Make next drawing erase what's currently on the canvas
    ctx.globalCompositeOperation = 'copy';

    // Nearest Neighbor
    ctx.imageSmoothingEnabled = false;
                        
    // Scale up
    ctx.setTransform((real_width / pixel_size_x), 0, 0, (real_height / pixel_size_y), 0, 0);

    var hRatio = canvas.width / pixelatedImg.width;
    var vRatio = canvas.height / pixelatedImg.height;
    var ratio = Math.min(hRatio, vRatio);
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, (canvas.width*ratio), (canvas.height*ratio));
    
    // reset all to defaults
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.imageSmoothingEnabled = true;
  };
};

function createGrid(x, y, px, py) {

  window.addEventListener("resize", recalculateGrid);
 
  const gridSelector = document.getElementById("grid-supercontainer");

  // Initiates the grid based on passed-in parameters
  for (var columns = 0; columns < y; columns++) {
    for (var rows = 0; rows < x; rows++) {
      // Creates a unit of 1 empty div
      var unit = $(`<div class='grid' id='cell'></div>`);
      unit.appendTo('#grid-container');
    };
  };

  // Gets the size of the empty div and populates it according to size
  $(".grid").width(gridSelector.offsetWidth / x);
  $(".grid").height(gridSelector.offsetHeight / y);

  // Changes the square to black on click.
  var isDown = false;
  $(".grid").mousedown(function() {
    isDown = true;
  })
  $(".grid").mouseup(function() {
    isDown = false;
  })
  $(".grid").mouseover(function() {
    if(isDown) {
      $(this).css("background-color", "black");
    }
  });
  $(".grid").click(function() {
    $(this).css("background-color", "black");
  })

  // Places pixelated image in grid-supercontainer
  var heightRatio = py/y;
  var widthRatio = px/x;
  const gridSize = document.getElementById("grid-container");
  var imageCreator = document.createElement("img");

  // Sets attributes of pixelated image
  imageCreator.setAttribute("id", "grid-image");
  imageCreator.setAttribute("class", "pixelated-image");
  imageCreator.setAttribute("width", (widthRatio * gridSize.offsetWidth));
  imageCreator.setAttribute("height", (heightRatio * gridSize.offsetHeight));
  let canvas = document.getElementById("myCanvas");
  const pixelatedURL = canvas.toDataURL();
  imageCreator.src = pixelatedURL;


  // Appends image to the grid
  gridSelector.appendChild(imageCreator);

  // Hides canvas after image is appended
  var canvasHider = document.getElementById("myCanvas");
  canvasHider.style.display = "none";

  var showButtons = document.getElementById("grid-buttons-id")
  showButtons.style.display = "grid";
};

function gridStandalone(x, y) {
  window.addEventListener("resize", recalculateGrid);
  const gridSelector = document.getElementById("grid-supercontainer");

  // Initiates the grid based on passed-in parameters
  for (var columns = 0; columns < y; columns++) {
    for (var rows = 0; rows < x; rows++) {
      // Creates a unit of 1 empty div
      var unit = $(`<div class='grid' id='cell'></div>`);
      unit.appendTo('#grid-container');
    };
  };


  // Gets the size of the empty div and populates it according to size
  $(".grid").width(gridSelector.offsetWidth / x);
  $(".grid").height(gridSelector.offsetHeight / y);

  // Changes the square to black on click.
  var isDown = false;
  $(".grid").mousedown(function() {
    isDown = true;
  })
  $(".grid").mouseup(function() {
    isDown = false;
  })
  $(".grid").mouseover(function() {
    if(isDown) {
      $(this).css("background-color", "black");
    }
  });
  $(".grid").click(function() {
    $(this).css("background-color", "black");
  })
}

function clearGrid() {
  var gridStuff = document.getElementById("grid-container");
  let imageRemover = document.getElementById("grid-image");
  if (gridStuff.innerHTML === null) {
    console.log("The grid is already empty, buddy!");
  } else if (imageRemover && gridStuff.innerHTML != null) {
    imageRemover.parentNode.removeChild(imageRemover);
    gridStuff.innerHTML = "";
  }
  
/*   document.getElementById("grid-container").innerHTML = "";
  document.getElementById("grid-supercontainer").innerHTML = ""; */
  // If an image is submitted already, clear image. else, display normally.
  
/*   if (imageRemover === null) {
    console.log("");
  } else {
    imageRemover.parentNode.removeChild(imageRemover);
  } */
}

const position = { x: 0, y: 0 }

var x = 0
var y = 0

function updateGrid() {
  gridConfig["x"] = document.getElementById("cell").getBoundingClientRect().width;
  gridConfig["y"] = document.getElementById("cell").getBoundingClientRect().height;
}

var gridConfig = {
    x: 30,
    y: 30,
};

function reinitializeSnapping() {
  interact(".pixelated-image").unset()
  interact(".pixelated-image")
    .draggable({
      modifiers: [
        interact.modifiers.snap({
          targets: [
            interact.snappers.grid( gridConfig )
          ],
          range: Infinity,
          relativePoints: [ { x: 0, y: 0 } ],
          offset: 'parent'
        }),
        interact.modifiers.restrict({
          restriction: 'parent',
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
          endOnly: false
        })
      ],
      inertia: false
    })
    .on('dragmove', function (event) {
      x += event.dx
      y += event.dy
  
      event.target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    })
}

// Creates a button that clears all shaded cells
function createClearButton()  {
   let ClearButtonInfo = '<button class="clear-button-class" id="clear-button-id">Clear colored cells</button>';
    document.getElementById("clear-cells-container-id").innerHTML = ClearButtonInfo;
    $(document).ready(function() {
      $(".clear-button-class").click(function() {
        //$(".clicked-grid").removeClass("clicked-grid");
        $(".grid").css("background-color", "transparent");
      });
    }); 
  };

  // Function that creates a hide button for image.
function createHideButton() {
  let hideButtonInfo = `<button class="hide-button-class" id="hide-button-id">Hide image</button>`;
  document.getElementById("hide-image-container-id").innerHTML = hideButtonInfo;
  $(document).ready(function() {
    $(".hide-button-class").click(function() {
      $("#grid-image").toggleClass("pixelated-image hide-fully");
/*       $("#hide-image-container-id").toggle(function() {
        $(this).text("Show image");
      }, function() {
        $(this).text("Hide image");
      }) */
    })
  })
};

// Function that selects color to shade cells in a modal (dialog) window.
function createColorPicker() {
  let colorPickerInfo = `<button class="color-picker-button-class" id="color-picker-button-id">Pick a color</button>`;
  document.getElementById("color-picker-container-id").innerHTML = colorPickerInfo;
  $(document).ready(function() {
    const modal = document.querySelector(".modal");
    const openModal = document.querySelector("#color-picker-button-id");
    const closeModal = document.querySelector("#close-button-id");
    let colorInput = document.querySelector("#color-picker-id");

    openModal.addEventListener("click", () => {
      modal.showModal();
    })
    closeModal.addEventListener("click", () => {
      modal.close();
    })

    // Erases drawn squares (Makes their background transparent).
    let eraserInput = document.querySelector(".eraser");
    eraserInput.addEventListener("click", () => {
      $(".grid").click(function() {
        $(this).css("background-color", "transparent");
      })
      var isDown = false;
      $('.grid').mousedown(function() {
        isDown = true;
      })
      $('.grid').mouseup(function() {
        isDown = false;
      })
      $('.grid').mouseover(function() {
        if (isDown) {
          $(this).css("background-color", "transparent");
        }
      })
      modal.close();
    })

    // Event listener for color picker and associated logic.
    colorInput.addEventListener("input", () => {
      let color = colorInput.value;
      $(".grid").click(function() {
        $(this).css("background-color", color);
      })
      var isDown = false;
      $('.grid').mousedown(function() {
        isDown = true;
      })
      $('.grid').mouseup(function() {
        isDown = false;
      })
      $('.grid').mouseover(function() {
        if (isDown) {
          $(this).css("background-color", color);
        }
      })
      $("#color-picker-button-id").css("color", color);
    })
  })
}

function recalculateGrid() {
  setTimeout(function() {
    document.getElementById("img-notice").innerHTML = "Recalculating your resized grid!";

    var inputx = document.getElementById("userInputx").value;
    var inputy = document.getElementById("userInputy").value;
    var gridInputx = document.getElementById("grid-constuctor-x").value;
    var gridInputy = document.getElementById("grid-constructor-y").value;

    clearGrid();
    pixelate(inputx, inputy);
    createGrid(gridInputx, gridInputy, inputx, inputy);
    updateGrid();
    reinitializeSnapping();
  }, 500)
}

/* var darkModeIcon = document.getElementById("dark");
darkModeIcon.onclick = function() {
  document.body.classList.toggle("dark-theme");
} */