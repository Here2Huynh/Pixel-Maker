//var to select the grid canvas
var table = document.getElementById('pixelCanvas');
//var to track grid toggle 
var gridOn = true;
//var to track eraser toggle 
var eraserOff = true;
//var to track mouse clicks 
var mouseDown = false; 
//var to track invert
var isInverted = false; 
//var to select submit button 
var submitSize = document.getElementById('sizePicker'); 

//when grid size is submitted by user, make grid
var defaultSubmit = submitSize.onsubmit = function(event){
    //prevent table from refreshing
    event.preventDefault();
    //makes grid
    makeGrid();  
};

//function that makes the grid with indicated row and col 
function makeGrid() {
    //clear table of any previous added <tr> 
    console.log(table.childNodes);
    //select first child on table (tr)
    var currentTiles = table.firstChild;
    while (currentTiles) {
        //remove the first tr
        table.removeChild(currentTiles);
        //reassign variable to the first tr that was not deleted
        currentTiles = table.firstChild;
    }
    
    //select size input, using let because value can change 
    let row = document.getElementById('inputHeight').value;
    let col = document.getElementById('inputWeight').value;
    //printing rol and col for debugging 
    console.log('Row value is ' + row);
    console.log('Col value is ' + col);
    
    //for loop to make the table, td->col, tr->row
    for(let i = 1; i <= row; i++){
        let tr = document.createElement('tr');
        table.appendChild(tr);
        for(let j =1; j <= col; j++) {
            let td = document.createElement('td');
            tr.appendChild(td);
        }
    }
}; 

//function that deals with coloring the table on mouse drag
function colorDrag(color) { 
    document.onmousedown = function() {
        mouseDown = true; 
    }; 
    document.onmouseup = function() {
        mouseDown = false;
    };
    delegate('mouseover', 'tr td', function() {
        if (mouseDown) {
            this.style.backgroundColor = color;
            this.classList.add('colored');
            console.log('in color dragging mode');
            if (!eraserOff) {
                console.log('Eraser mode is on for dragging');
                this.style.backgroundColor = 'transparent';
                this.classList.remove('colored');
            }
        }
    });
}

//function to bind event handler to element, vanillaJS equivalent to jQuery's .on()
//The bubbling principle is simple.
//When an event happens on an element, it first runs the handlers on it, then on its parent, then all the way up on other ancestors.
function delegate(eventType, elementID, callback) {
    //listens for the indicated event type 
    document.addEventListener(eventType, function(event){
        //select target of event 
        var target = event.target;
        // while target is true and is not the same as event
        while (target && target !== this) {
            //target matches the selector 
            if ( target.matches(elementID)) {
                //bind target with event 
                callback.call(target, event); 
            }
            //set target to its ancestor node so it bubbles up the node tree
            target = target.parentNode;
        }
    });
}

//function to check if the element has that class
//The Element.classList is a read-only property which returns a live DOMTokenList collection of the class attributes of the element.
function hasClass(element, className) {
    // \\b in regex means to global search for string at beginning or end of the string 
    return element.classList ? element.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(element.className);
}


//vanillaJS equvilant to $(document).ready, 
//waits for all elements for to load before manipulation 
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM is loaded and ready.");
    
    //event listener for when tile gets clicked on and change the color to indicated value
    delegate('mousedown', 'tr td', function() {
        //set var for color that's selected by user 
        var color = document.getElementById('colorPicker').value; 
        console.log('Color selected is ' + color); 
        
        //check if tile is colored, if it is clear color 
        if (hasClass(this,'colored')) {
            this.classList.remove('colored');
            this.style.backgroundColor = 'transparent';
            console.log('not colored'); 
        }
        //check if eraser mode is on and change the 
        else if (!eraserOff) {
            console.log('Eraser mode is on for single click');
            this.style.backgroundColor = 'transparent';
            this.classList.remove('colored');
        }
        //if not colored, add colored class to it and change tile color 
        else {
            this.classList.add('colored');
            this.style.backgroundColor = color; 
            console.log('colored');
        }
        //react with mouse drags over tile 
        colorDrag(color);
    })
    
});

//below are event listener for buttons 

//when reset button is clicked, resets the table to white so inverting works and remove color class from all the tiles
//have to traverse through all tr and td and change the color at the td level 
var clearButton = document.getElementById('clearGrid');
clearButton.addEventListener('click', function() {
    console.log('Grid cleared');
    //returns a list of all children to the selected element 
    var clearingTR = table.childNodes;
    //console.log(specififiedTable);
    //tr level
    for (let i = 0; i < clearingTR.length; i++) {
        //console.log(specififiedTable[i]);
        //td level 
        var clearingTD = clearingTR[i].childNodes;
        for (let j = 0; j < clearingTD.length; j++) {
            //console.log(clearingTD[j]);
            clearingTD[j].style.backgroundColor = 'white';
            clearingTD[j].classList.remove('colored');
        }
    }
});

//when invert button is clicked, change the text in button and set the bool appropiately
var invertButton = document.getElementById('invertColor');
invertButton.addEventListener('click', function() {
    if (isInverted) {
        this.innerHTML = 'Invert Color'; 
        isInverted = false;
        console.log('Colors reverted');
        invertTiles();
    }
    else {
        this.innerHTML = 'Revert Color'; 
        isInverted = true;
        console.log('Colors inverted');
        invertTiles();
    }
});

//function that does the color inversion, called by event listner above
function invertTiles() {
    var tr = table.childNodes;
    for (let x = 0; x < tr.length; x++) {
        var td = tr[x].childNodes; 
        for(let y = 0; y < td.length; y++) {
            if(hasClass(td[y], 'inverted')) {
               td[y].classList.remove('inverted');
                console.log('Tile reverted');
            }
            else {
                td[y].classList.add('inverted');
                console.log('Tile inverted');
            }
        }
    }
}

//this functions handles the grid toggling 
var gridButton = document.getElementById('gridLines');
gridButton.addEventListener('click', function() {
    console.log('toggle grid');
    if (gridOn) {
        toggleGrid();
        gridOn = false;
        this.innerHTML = 'Grid Off'; 
    }
    else {
        toggleGrid();
        gridOn = true;
        this.innerHTML = 'Grid On';
    }
});

//function that iterates through the tr and td and change border of tile to white or black
function toggleGrid() {
    var tr = table.childNodes;
    for (let s = 0; s < tr.length; s++) {
        var td = tr[s].childNodes;
        for (let t = 0; t < td.length; t++) {
            if (gridOn) {
                td[t].style.border = '1px solid transparent';
            }
            else {
                td[t].style.border = '1px solid black';
            }
        }
    }
}

//function that handles the button animation of eraser button
var eraserButton = document.getElementById('eraser');
eraserButton.addEventListener('click', function() {
    console.log('toggle eraser mode');
    if (eraserOff) {
        eraserOff = false;
        this.classList.remove('eraser')
        this.classList.add('pressedButton');
        this.innerHTML = 'Eraser On';
    }
    else {
        eraserOff = true;
        this.classList.remove('pressedButton')
        this.classList.add('eraser');
        this.innerHTML = 'Eraser Off';
    }
});



//function makeGrid() {
//    
//   
//    const row = document.getElementById('inputHeight').value;
//    const col = document.getElementById('inputWeight').value;
//    
//    //for loop to make the table, td->col, tr->row
//    const html = `<tr>${"<td />".repeat(col)}</tr>`.repeat(row);
//    table.innerHTML = html;
//}; 
