
// Validate input data
function validate() {
    // Check chosen material
    if (chosenMaterial == "") {
	window.alert("Please select a material.");
	return false;		// Do nothing if no material is selected
    }
    
    // Read in temperature from input element
    temp = document.getElementById("temp").value;
    
    // Validate the input temperature
    if (temp == "") {
	window.alert("Invalid temperature value (not a number)" +
		     "\n\nPlease enter a valid number.");
	return false;
    }
    
    // Set the input temperature as the chosen temperature
    chosenTemp = temp;
    
    // Check the input temperature
    if (chosenTemp < window[chosenMaterial].tMin) {
	window.alert("Input temperature is lower than the minimum valid" +
		     " temperature for this material!\n\nPlease enter a valid temperature.");
	chosenTemp = 0;
	return false;
    }
    else if (chosenTemp > window[chosenMaterial].tMax) {
	window.alert("Input temperature is higher than the maximum valid" +
		     " temperature for this material!\n\nPlease enter a valid temperature.");
	chosenTemp = 0;
	return false;
    }
    return true;
}

// Add a row to the data table showing the desired material properties
var chosenMaterial = "";	// Store the currently selected material
var chosenTemp = 0;		// Store the currently entered temperature
function addRow() {
    // Create variables for all of the properties we'll be displaying
    var rho = 0;
    var cp = 0;
    var mu = 0;
    var nu = 0;
    var k = 0;
    var alpha = 0;
    var Pr = 0;
    var beta = 0;
    var sigma = 0;
    var hfg = 0;
    
    // Find the index of the appropriate properties for this temperature
    var fraction = 0;	// For interpolating between table rows, if fraction = 1, no interpolation is necessary
    var i = 0;
    while (chosenTemp > window[chosenMaterial]["T"][i]) {
	i++;
    }
    if (chosenTemp == window[chosenMaterial]["T"][i]) {
	fraction = 1;     // Use properties at index 'i'
    }
    else {		  // Interpolate!
	var temp_i = window[chosenMaterial]["T"][i];
	var temp_i_minus = window[chosenMaterial]["T"][i-1];
	fraction = (chosenTemp - temp_i_minus) / (temp_i - temp_i_minus);
    }
    
    // Make a common designation for unknown values in tables
    blank = "---";
    
    // Check which table this material is in, in order to do the right calculations
    table = window[chosenMaterial]["table"];
    
    if (table == "A4") {
	cp = interpolate(fraction,i,window[chosenMaterial]["cp"]);
	k = interpolate(fraction,i,window[chosenMaterial]["k"]);
	Pr = interpolate(fraction,i,window[chosenMaterial]["pr"]);
	rho = interpolate(fraction,i,window[chosenMaterial]["rho"]);
	mu = interpolate(fraction,i,window[chosenMaterial]["mu"]);
	nu = interpolate(fraction,i,window[chosenMaterial]["nu"]);
	alpha = interpolate(fraction,i,window[chosenMaterial]["alpha"]);
	sigma = blank;
	hfg = blank;
	
	//Need to calculate an approximate Beta value (1/T)
	betaVal = 1 / window[chosenMaterial]["T"];
	beta = "&asymp; " + betaVal;
    }
    else if (table == "A5") {
	cp = interpolate(fraction,i,window[chosenMaterial]["cp"]);
	k = interpolate(fraction,i,window[chosenMaterial]["k"]);   
	Pr = interpolate(fraction,i,window[chosenMaterial]["pr"]);
	rho = interpolate(fraction,i,window[chosenMaterial]["rho"]);
	mu = interpolate(fraction,i,window[chosenMaterial]["mu"]);
	nu = interpolate(fraction,i,window[chosenMaterial]["nu"]);
	alpha = interpolate(fraction,i,window[chosenMaterial]["alpha"]);
	beta = interpolate(fraction,i,window[chosenMaterial]["beta"]);
	sigma = blank;
	hfg = blank;
    }
    else if (table == "A6") {
	// Fluid properties
	cp = interpolate(fraction,i,window[chosenMaterial]["cpf"]);
	k = interpolate(fraction,i,window[chosenMaterial]["kf"]);   
	Pr = interpolate(fraction,i,window[chosenMaterial]["prf"]);
	mu = interpolate(fraction,i,window[chosenMaterial]["muf"]);
	beta = interpolate(fraction,i,window[chosenMaterial]["betaf"]);
	sigma = interpolate(fraction,i,window[chosenMaterial]["sigmaf"]);;
	hfg = interpolate(fraction,i,window[chosenMaterial]["hfg"]);
	
	// Calculate nu, rho and alpha from known values
	rho = 1 / (interpolate(fraction,i,window[chosenMaterial]["vf"])/1000);	// inverse of v
	alpha = Math.pow(10,7) * (k / (rho * cp*1000));	// 1000 converts the units from kJ to J
	nu = Math.pow(10,6) * (interpolate(fraction,i,window[chosenMaterial]["muf"])/1000000)
		* (interpolate(fraction,i,window[chosenMaterial]["vf"])/1000);

	// Gas properties
	var cpg = interpolate(fraction,i,window[chosenMaterial]["cpg"]);
	var kg = interpolate(fraction,i,window[chosenMaterial]["kg"]);   
	var Prg = interpolate(fraction,i,window[chosenMaterial]["prg"]);
	var mug = interpolate(fraction,i,window[chosenMaterial]["mug"]);
	var betag = blank;
	var sigmag = blank;
	var hfg = interpolate(fraction,i,window[chosenMaterial]["hfg"]);
	
	// Calculate nu, rho and alpha from known values
	var rhog = 1 / (interpolate(fraction,i,window[chosenMaterial]["vg"])/1000);	// inverse of v
	var alphag = Math.pow(10,7) * ( (k/1000) / (rho * cp*1000) );
	var nug = Math.pow(10,6) * (interpolate(fraction,i,window[chosenMaterial]["mug"])/1000000)
		    * (interpolate(fraction,i,window[chosenMaterial]["vg"])/1000);
	
	// Water table has data for fluid and gas, so build separate table rows here
	// Generate a table row containing the desired material properties
	var trow = "<tr>";
	trow += "<td data-pname='T'>" + chosenTemp + "</td>";
	trow += "<td data-pname='material'>" + chosenMaterial + "<sub>fluid</sub></td>";
	trow += "<td data-pname='rho'>" + rho + "</td>";
	trow += "<td data-pname='cp'>" + cp + "</td>";
	trow += "<td data-pname='mu'>" + mu + "</td>";
	trow += "<td data-pname='nu'>" + nu + "</td>";
	trow += "<td data-pname='k'>" + k + "</td>";
	trow += "<td data-pname='alpha'>" + alpha + "</td>";
	trow += "<td data-pname='Pr'>" + Pr + "</td>";
	trow += "<td data-pname='beta'>" + beta + "</td>";
	trow += "<td data-pname='sigma'>" + sigmag + "</td>";
	trow += "<td data-pname='hfg'>" + hfg + "</td>";
	trow += "</tr>"
	var trow2 = "<tr>";
	trow2 += "<td data-pname='T'>" + chosenTemp + "</td>";
	trow2 += "<td data-pname='material'>" + chosenMaterial + "<sub>gas</sub></td>";
	trow2 += "<td data-pname='rho'>" + rhog + "</td>";
	trow2 += "<td data-pname='cp'>" + cpg + "</td>";
	trow2 += "<td data-pname='mu'>" + mug + "</td>";
	trow2 += "<td data-pname='nu'>" + nug + "</td>";
	trow2 += "<td data-pname='k'>" + kg + "</td>";
	trow2 += "<td data-pname='alpha'>" + alphag + "</td>";
	trow2 += "<td data-pname='Pr'>" + Prg + "</td>";
	trow2 += "<td data-pname='beta'>" + betag + "</td>";
	trow2 += "<td data-pname='sigma'>" + sigmag + "</td>";
	trow2 += "<td data-pname='hfg'>" + hfg + "</td>";
	trow2 += "</tr>"
	$("#dataTableBody").append(trow);
	$("#dataTableBody").append(trow2);
	return;
    }
    else if (table == "A7") {
	rho = interpolate(fraction,i,window[chosenMaterial]["rho"]);
	nu = interpolate(fraction,i,window[chosenMaterial]["nu"]);
	alpha = interpolate(fraction,i,window[chosenMaterial]["alpha"]);	
	beta = blank;
	sigma = blank;
	hfg = blank;
	
	// Calculate mu from density and nu
	mu = 100 *(nu/(Math.pow(10,7))) * rho;
    }
    
    // Generate a table row containing the desired material properties
    var trow = "<tr>";
	trow += "<td data-pname='T'>" + chosenTemp + "</td>";
	trow += "<td data-pname='material'>" + chosenMaterial + "</td>";
	trow += "<td data-pname='rho'>" + rho + "</td>";
	trow += "<td data-pname='cp'>" + cp + "</td>";
	trow += "<td data-pname='mu'>" + mu + "</td>";
	trow += "<td data-pname='nu'>" + nu + "</td>";
	trow += "<td data-pname='k'>" + k + "</td>";
	trow += "<td data-pname='alpha'>" + alpha + "</td>";
	trow += "<td data-pname='Pr'>" + Pr + "</td>";
	trow += "<td data-pname='beta'>" + beta + "</td>";
	trow += "<td data-pname='sigma'>" + sigma + "</td>";
	trow += "<td data-pname='hfg'>" + hfg + "</td>";
    trow += "</tr>"
    $("#dataTableBody").append(trow);
    /**/
}

$( document ).ready(function() {
    // Load tables
});

// Capture the ENTER key for calculating
$(document).keypress(function(e) {
  if(e.which == 13) {
    if(validate()) {
	addRow();
    }
  }
});

// Function for when user selects a material from the dropdown
$("#calc").click(function() {
    if( validate() ) {
	addRow();
    }
});

// Function for when user selects a material from the dropdown
$(".material").click(function() {
    // Display the selected material, along with the valid temperature range
    $("#materialText").html('' + this.innerHTML + '<br/>');
    $("#tempRange").html('T = ' + window[this.dataset.material].tMin + ' - ' +
			 window[this.dataset.material].tMax + ' K');
    chosenMaterial = window[this.dataset.material].name;
});

// Clear selected and calculated properties
$("#clearTable").click(function() {
    chosenMaterial = "";		// Reset the currently selected material
    chosenTemp = 0;			// Reset the currently enetered temperature
    
    // Remove all displayed properties and deselect a material at the top
    $("#materialText").html("");	// Hide the selected material display
    $("#tempRange").html("");
    $("#dataTableBody").html("");
});

// Function to interpolate a value from a table
function interpolate(fraction, index, array) {
    if (fraction == 1) {
	return array[index];
    }
    return fraction * (array[index] - array[index-1]) + array[index-1];
}