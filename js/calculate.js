
// Generate a table with desired material properties
var chosenMaterial = "";	// Store the currently selected material
var chosenTemp = 0;		// Store the currently entered temperature
function addRow() {
    var trow = "<tr>";
    	//alert(window[material].props["T"][0]);
	//var myArray = [Infinity,NaN,10];
	//alert(1 + myArray[1] );
    for (var prop in window[chosenMaterial])
    {

	if (prop == Array) {
	    trow += "<td data-pname='" + window[chosenMaterial][prop][0] + "'>" + window[chosenMaterial].props[prop][0] + "</td>";
	    alert("got here...");
	}
	else {
	    trow += "<td data-pname='" + window[chosenMaterial][prop] + "'>" + window[chosenMaterial][prop] + "</td>";
	}
	
    }
    trow += "</tr>"
    $("#dataTableBody").append(trow);
    $("#dataTableBody").css("display", "block");
}

$( document ).ready(function() {
    // Load tables
});

$(".material").click(function() {
    //window.alert(this.innerHTML);
    //$("#matSelector").hide();
    $("#materialText").html('' + this.innerHTML + '<br/>');
    $("#tempRange").html('T = ' + window[this.dataset.material].tMin + ' - ' +
			 window[this.dataset.material].tMax + ' K');
    chosenMaterial = window[this.dataset.material].name;
});

// Clear the table of calculated properties
$("#clearTable").click(function() {
    chosenMaterial = "";		// Reset the currently selected material
    chosenTemp = 0;			// Reset the currently enetered temperature
    
    // Remove all displayed properties and deselect a material at the top
    $("#materialText").html("");	// Hide the selected material display
    $("#tempRange").html("");
    $("#dataTableBody").html("");
});