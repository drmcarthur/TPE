/********************************************************
 *		 Table Data Manipulation
 ********************************************************/

// Make a common designation for unknown values in tables
var blank = "---";

// Set up the property labels for all of the appendix tables
var propLabels = "<tr><th>Temp<br/>(K)</th>" +
		 "<th>&rho;<br/>(kg/m<sup>3</sup>)</th>" + 
		 "<th>c<sub>p</sub><br/>(kJ/kg&sdot;K)</th>" +
		 "<th>&mu;&sdot;10<sup>2</sup><br/>(N&sdot;s/m<sup>2</sup>)</th>" +
		 "<th>&nu;&sdot;10<sup>6</sup><br/>(m<sup>2</sup>/s)</th>" +
		 "<th>k&sdot;10<sup>3</sup><br/>(W/m&sdot;K)</th>" +
		 "<th>&alpha;&sdot;10<sup>7</sup><br/>(m<sup>2</sup>/s)</th>" +
		 "<th>Pr</th>" +
		 "<th>&beta;&sdot;10<sup>3</sup><br/>(K<sup>-1</sup>)</th>" +
		 "<th>&sigma;&sdot;10<sup>3</sup><br/>(N/m)</th>" +
		 "<th>h<sub>fg</sub><br/>(kJ/kg)</th>" +
		 "</tr>";
	
// Set up the property labels for the calculated property table
var calcPropLabels = "<tr><th>Temp<br/>(K)</th>" + "<th>Material</th>" +
		 "<th>&rho;<br/>(kg/m<sup>3</sup>)</th>" + 
		 "<th>c<sub>p</sub><br/>(kJ/kg&sdot;K)</th>" +
		 "<th>&mu;&sdot;10<sup>2</sup><br/>(N&sdot;s/m<sup>2</sup>)</th>" +
		 "<th>&nu;&sdot;10<sup>6</sup><br/>(m<sup>2</sup>/s)</th>" +
		 "<th>k&sdot;10<sup>3</sup><br/>(W/m&sdot;K)</th>" +
		 "<th>&alpha;&sdot;10<sup>7</sup><br/>(m<sup>2</sup>/s)</th>" +
		 "<th>Pr</th>" +
		 "<th>&beta;&sdot;10<sup>3</sup><br/>(K<sup>-1</sup>)</th>" +
		 "<th>&sigma;&sdot;10<sup>3</sup><br/>(N/m)</th>" +
		 "<th>h<sub>fg</sub><br/>(kJ/kg)</th>" +
		 "</tr>";
		 
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
    var p = 5;	// (precision) Number of decimals to display in table
    
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
    
    // Check which table this material is in, in order to do the right calculations
    table = window[chosenMaterial]["table"];
    
    /* Verify that the following special cases of units are handled properly...
     *	cp:10^3    mu:10^2    nu:10^6    k:10^3    alpha:10^7    Beta:10^3
     */
    if (table == "A4") {
	// Bring in properties, but ensure a universal unit scheme is followed
	cp = interpolate(fraction,i,window[chosenMaterial]["cp"]);
	k = interpolate(fraction,i,window[chosenMaterial]["k"]);
	Pr = interpolate(fraction,i,window[chosenMaterial]["pr"]);
	rho = interpolate(fraction,i,window[chosenMaterial]["rho"]);
	mu = 100 * (interpolate(fraction,i,window[chosenMaterial]["mu"])/Math.pow(10,7));
	nu = interpolate(fraction,i,window[chosenMaterial]["nu"]);
	alpha = Math.pow(10,7) * interpolate(fraction,i,window[chosenMaterial]["alpha"])
			/ Math.pow(10,6);
	sigma = blank;
	hfg = blank;
	beta = blank;
	//Need to calculate an approximate Beta value (1/T)
	//betaVal = 1 / chosenTemp;
	//beta = "&asymp; " + betaVal;
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
	mu = 100 * (interpolate(fraction,i,window[chosenMaterial]["muf"])/Math.pow(10,6));
	if (window[chosenMaterial]["betaf"] == NaN) {
	    beta = blank;
	}
	else {
	    beta = 1000 * (interpolate(fraction,i,window[chosenMaterial]["betaf"])/Math.pow(10,6)); 
	}
	sigma = interpolate(fraction,i,window[chosenMaterial]["sigmaf"]);;
	hfg = interpolate(fraction,i,window[chosenMaterial]["hfg"]);
	
	// Calculate nu, rho and alpha from known values
	rho = 1 / (interpolate(fraction,i,window[chosenMaterial]["vf"])/1000);	// inverse of v
	alpha = Math.pow(10,7) * ((k/1000) / (rho * cp*1000));	// 1000 converts the units from kJ to J
	nu = Math.pow(10,6) * (interpolate(fraction,i,window[chosenMaterial]["muf"])/Math.pow(10,6))
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
	var nug = Math.pow(10,6) * (interpolate(fraction,i,window[chosenMaterial]["mug"])/Math.pow(10,6))
		    * (interpolate(fraction,i,window[chosenMaterial]["vg"])/1000);
	
	// Water table has data for fluid and gas, so build separate table rows here
	// Generate a table row containing the desired material properties
	var trow = "<tr class='dataRow'>";
	trow += "<td data-pname='T'>" + chosenTemp + "</td>";
	trow += "<td data-pname='material'>" + window[chosenMaterial].name + "<sub>fluid</sub></td>";
	trow += "<td data-pname='rho'>" + formatNum(rho) + "</td>";
	trow += "<td data-pname='cp'>" + formatNum(cp) + "</td>";
	trow += "<td data-pname='mu'>" + formatNum(mu) + "</td>";
	trow += "<td data-pname='nu'>" + formatNum(nu) + "</td>";
	trow += "<td data-pname='k'>" + formatNum(k) + "</td>";
	trow += "<td data-pname='alpha'>" + formatNum(alpha) + "</td>";
	trow += "<td data-pname='Pr'>" + formatNum(Pr) + "</td>";
	trow += "<td data-pname='beta'>" + formatNum(beta) + "</td>";
	trow += "<td data-pname='sigma'>" + formatNum(sigmag) + "</td>";
	trow += "<td data-pname='hfg'>" + formatNum(hfg) + "</td>";
	trow += "</tr>";
	var trow2 = "<tr class='dataRow'>";
	trow2 += "<td data-pname='T'>" + chosenTemp + "</td>";
	trow2 += "<td data-pname='material'>" + window[chosenMaterial].name 	+ "<sub>gas</sub></td>";
	trow2 += "<td data-pname='rho'>" + formatNum(rhog) + "</td>";
	trow2 += "<td data-pname='cp'>" + formatNum(cpg) + "</td>";
	trow2 += "<td data-pname='mu'>" + formatNum(mug) + "</td>";
	trow2 += "<td data-pname='nu'>" + formatNum(nug) + "</td>";
	trow2 += "<td data-pname='k'>" + formatNum(kg) + "</td>";
	trow2 += "<td data-pname='alpha'>" + formatNum(alphag) + "</td>";
	trow2 += "<td data-pname='Pr'>" + formatNum(Prg) + "</td>";
	trow2 += "<td data-pname='beta'>" + formatNum(betag) + "</td>";
	trow2 += "<td data-pname='sigma'>" + formatNum(sigmag) + "</td>";
	trow2 += "<td data-pname='hfg'>" + formatNum(hfg) + "</td>";
	trow2 += "</tr>";
	$("#dataTableBody").append(trow);
	$("#dataTableBody").append(trow2);
	return;
    }
    else if (table == "A7") {
	rho = interpolate(fraction,i,window[chosenMaterial]["rho"]);
	cp = interpolate(fraction,i,window[chosenMaterial]["cp"]);
	nu = Math.pow(10,6) * (interpolate(fraction,i,window[chosenMaterial]["nu"]) / Math.pow(10,7));
	k = 1000 * interpolate(fraction,i,window[chosenMaterial]["k"]);
	alpha = Math.pow(10,7) * (interpolate(fraction,i,window[chosenMaterial]["alpha"])/Math.pow(10,5));
	Pr = interpolate(fraction,i,window[chosenMaterial]["pr"]);
	beta = blank;
	sigma = blank;
	hfg = blank;
	
	// Calculate mu from density and nu
	mu = 100 *(nu/Math.pow(10,7)) * rho;
    }
    
    // Generate a table row containing the desired material properties
    var trow = "<tr class='dataRow'>";
	trow += "<td data-pname='T'>" + chosenTemp + "</td>";
	trow += "<td data-pname='material'>" + window[chosenMaterial].name + "</td>";
	trow += "<td data-pname='rho'>" + formatNum(rho) + "</td>";
	trow += "<td data-pname='cp'>" + formatNum(cp) + "</td>";
	trow += "<td data-pname='mu'>" + formatNum(mu) + "</td>";
	trow += "<td data-pname='nu'>" + formatNum(nu) + "</td>";
	trow += "<td data-pname='k'>" + formatNum(k) + "</td>";
	trow += "<td data-pname='alpha'>" + formatNum(alpha) + "</td>";
	trow += "<td data-pname='Pr'>" + formatNum(Pr) + "</td>";
	trow += "<td data-pname='beta'>" + formatNum(beta) + "</td>";
	trow += "<td data-pname='sigma'>" + formatNum(sigma) + "</td>";
	trow += "<td data-pname='hfg'>" + formatNum(hfg) + "</td>";
	trow += "</tr>";
    $("#dataTableBody").append(trow);
    /**/
}

// Function to interpolate a value from a table
function interpolate(fraction, index, array) {
    if (fraction == 1) {
	return array[index];
    }
    return fraction * (array[index] - array[index-1]) + array[index-1];
}

function formatNum(num) {
    if (num == "---" || num == Infinity) {
	return num;	// Do nothing
    }
    else if (isNaN(num)) {
	return "---";
    }
    else {
	//return +(Math.round(num + "e+4")  + "e-4");
	return num.toExponential(3);
    }
}

function fillPropertyTables() {
    // Prepare to access all material properties
    var materials = ["AIR","NH3","CO2","CO","HE","H2","N2",
		     "O2","STEAM","OIL","EG","GLY","R134A",
		     "R22","HG","BISMUTH", "LEAD","POTASSIUM",
		     "SODIUM","NAK45","NAK22","PBBI","WATER"];
    var text = "";
    var tableName = "table_";
    
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
    
    for(mat in materials)
    {
	// Get the data from the JSON object
	var data = window[materials[mat]];
	
	if (data.id == "WATER") {
	    //IGNORE
	}
	else {
	    // Get table id so we can access the table
	    tableName = "#table_" + data.table.toLowerCase() + "_body";
	    
	    // Label the following rows with the name of the material
	    var labelRow = "<tr class='matLabel' href='#" + data.id + "'><td colspan='12'>" + data.name + "</td></tr>";
	    $(tableName).append(labelRow);
	    
	    // Iterate through all the temperatures and display the properties
	    for(i in data.T) {
		// Generate a table row containing the desired material properties
		var trow = "<tr class='propRow'>";
		    trow += "<td data-pname='T'>" + data.T[i] + "</td>";
		    trow += "<td data-pname='rho'>" + formatNum(data.rho[i]) + "</td>";
		    trow += "<td data-pname='cp'>" + formatNum(data.cp[i]) + "</td>";
		    if (data.table != "A7") {
			trow += "<td data-pname='mu'>" + formatNum(data.mu[i]) + "</td>";
		    }
		    else {
			trow += "<td data-pname='mu'>" + blank + "</td>";
		    }
		    trow += "<td data-pname='nu'>" + formatNum(data.nu[i]) + "</td>";
		    trow += "<td data-pname='k'>" + formatNum(data.k[i]) + "</td>";
		    trow += "<td data-pname='alpha'>" + formatNum(data.alpha[i]) + "</td>";
		    trow += "<td data-pname='Pr'>" + formatNum(data.pr[i]) + "</td>";
		    if (data.table == "A5") {
			trow += "<td data-pname='beta'>" + formatNum(data.beta[i]) + "</td>";
		    }
		    else {
			trow += "<td data-pname='beta'>" + blank + "</td>";
		    }
		    trow += "<td data-pname='sigma'>" + blank + "</td>";
		    trow += "<td data-pname='hfg'>" + blank + "</td>";
		    //trow += "<td data-pname='sigma'>" + formatNum(data.sigma[i]) + "</td>";
		    //trow += "<td data-pname='hfg'>" + formatNum(data.hfg[i]) + "</td>";
		    trow += "</tr>";

		$(tableName).append(trow);
	    }
	    //text += tableName + "\n";
	}
	
    }
}

/********************************************************
 *	    Document ready and keypress events
 ********************************************************/
$( document ).ready(function() {
    // Add the table heading to the main calculated property table
    $("#dataTable").append("<thead>" + calcPropLabels + "</thead>");
    
    // Load appendix tables in background
    $(".appendixTable").hide();
    fillPropertyTables();
});

// Capture the ENTER key for calculating
$(document).keypress(function(e) {
  if(e.which == 13) {
    if(validate()) {
	addRow();
    }
  }
});

/********************************************************
 *		     Click Functions
 ********************************************************/
// Function for when user selects a material from the dropdown
$(".dataRow").click(function() {
    // Display the selected material, along with the valid temperature range
    $(this).addClass("selected");
});

// Function to switch view from property calculator to
var calculatedVals = "";
$("#tablesButton").click(function() {
    // Display the selected material, along with the valid temperature range
    $(".calcSetup").hide();
    //$(".panel").hide();
    $(".page-header").html("Property Tables");
    $(".nav-sidebar").children(".active").removeClass("active");
    $(this).parent().addClass("active");
    $("#clearTable").hide();
    $("#dataPanel").hide();
    $(".appendixTable").show();
});

// Function to switch view from property calculator to
$("#propCalcButton").click(function() {
    // Display the selected material, along with the valid temperature range
    $(".calcSetup").show();
    $(".panel").show();
    $(".page-header").html("Calculate Properties");
    $(".nav-sidebar").children(".active").removeClass("active");
    $(this).parent().addClass("active");
    $("#clearTable").show();
    $("#dataPanel").show("");
    $(".appendixTable").hide();

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
    chosenMaterial = window[this.dataset.material].id;
    $(this).parent().click();
});

// Clear selected and calculated properties
$("#clearTable").click(function() {
    chosenMaterial = "";		// Reset the currently selected material
    chosenTemp = 0;			// Reset the currently enetered temperature
    
    // Remove all displayed properties and deselect a material at the top
    $("#materialText").html("");	// Hide the selected material display
    $("#tempRange").html("");
    $("#dataTableBody").html("");
    document.getElementById("temp").value = "";
});

$(".backToTop").click(function() {
    window.location.hash = "TOP";
});