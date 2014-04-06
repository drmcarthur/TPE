/********************************************************
 *		 Table Data Manipulation
 ********************************************************/

// Make a common designation for unknown values in tables
var blank = "---";

// Prepare to access all material properties
var materials = ["AIR","NH3","CO2","CO","HE","H2","N2",
		 "O2","STEAM","OIL","EG","GLY","R134A",
		 "R22","HG","BISMUTH", "LEAD","POTASSIUM",
		 "SODIUM","NAK45","NAK22","PBBI","WATER"];

// Set up the property labels for all of the appendix tables
var propLabels = "<tr class='propLabel'><th>Temp<br/>(K)</th>" +
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
	trow += "<td class='T'>" + chosenTemp + "</td>";
	trow += "<td class='calcCol matName'>" + window[chosenMaterial].name + "<sub>fluid</sub></td>";
	trow += "<td class='calcCol rho'>" + formatNum(rho) + "</td>";
	trow += "<td class='calcCol cp'>" + formatNum(cp) + "</td>";
	trow += "<td class='calcCol mu'>" + formatNum(mu) + "</td>";
	trow += "<td class='calcCol nu'>" + formatNum(nu) + "</td>";
	trow += "<td class='calcCol k'>" + formatNum(k) + "</td>";
	trow += "<td class='calcCol alpha'>" + formatNum(alpha) + "</td>";
	trow += "<td class='calcCol pr'>" + formatNum(Pr) + "</td>";
	trow += "<td class='calcCol beta'>" + formatNum(beta) + "</td>";
	trow += "<td class='calcCol sigma'>" + formatNum(sigmag) + "</td>";
	trow += "<td class='calcCol hfg'>" + formatNum(hfg) + "</td>";
	trow += "</tr>";
	var trow2 = "<tr class='dataRow'>";
	trow2 += "<td class='T'>" + chosenTemp + "</td>";
	trow2 += "<td class='calcCol matName'>" + window[chosenMaterial].name + "<sub>gas</sub></td>";
	trow2 += "<td class='calcCol rho'>" + formatNum(rhog) + "</td>";
	trow2 += "<td class='calcCol cp'>" + formatNum(cpg) + "</td>";
	trow2 += "<td class='calcCol mu'>" + formatNum(mug) + "</td>";
	trow2 += "<td class='calcCol nu'>" + formatNum(nug) + "</td>";
	trow2 += "<td class='calcCol k'>" + formatNum(kg) + "</td>";
	trow2 += "<td class='calcCol alpha'>" + formatNum(alphag) + "</td>";
	trow2 += "<td class='calcCol pr'>" + formatNum(Prg) + "</td>";
	trow2 += "<td class='calcCol beta'>" + formatNum(betag) + "</td>";
	trow2 += "<td class='calcCol sigma'>" + formatNum(sigmag) + "</td>";
	trow2 += "<td class='calcCol hfg'>" + formatNum(hfg) + "</td>";
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
	trow += "<td class='T'>" + chosenTemp + "</td>";
	trow += "<td class='calcCol matName'>" + window[chosenMaterial].name + "</td>";
	trow += "<td class='calcCol rho'>" + formatNum(rho) + "</td>";
	trow += "<td class='calcCol cp'>" + formatNum(cp) + "</td>";
	trow += "<td class='calcCol mu'>" + formatNum(mu) + "</td>";
	trow += "<td class='calcCol nu'>" + formatNum(nu) + "</td>";
	trow += "<td class='calcCol k'>" + formatNum(k) + "</td>";
	trow += "<td class='calcCol alpha'>" + formatNum(alpha) + "</td>";
	trow += "<td class='calcCol pr'>" + formatNum(Pr) + "</td>";
	trow += "<td class='calcCol beta'>" + formatNum(beta) + "</td>";
	trow += "<td class='calcCol sigma'>" + formatNum(sigma) + "</td>";
	trow += "<td class='calcCol hfg'>" + formatNum(hfg) + "</td>";
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

function fillAppendixTables() {
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
	
	// Get table id so we can access the table
	    tableName = "#table_" + data.table.toLowerCase() + "_body";
	    
	    // Label the following rows with the name of the material
	    var labelRow = "<tr class='matLabel'><td colspan='12'>" +
			    "<span class='target' id='" + data.id + "'>&nbsp;</span>" +
			    "<span class='backToTop'>Top</span>" + data.name + "</td></tr>";
	    $(tableName).append(labelRow);
	    $(tableName).append(propLabels); 	// Label the property columns
	    
	if (data.id == "WATER") {
	    //IGNORE
	}
	else {
	    // Iterate through all the temperatures and display the properties
	    for(i in data.T) {
		// Generate a table row containing the desired material properties
		var trow = "<tr class='propRow'>";
		    trow += "<td class='tempCol " + data.id + "_T'>" + data.T[i] + "</td>";
		    trow += "<td class='appCol " + data.id + "_rho'>" + formatNum(data.rho[i]) + "</td>";
		    trow += "<td class='appCol " + data.id + "_cp'>" + formatNum(data.cp[i]) + "</td>";
		    if (data.table != "A7") {
			trow += "<td class='appCol " + data.id + "_mu'>" + formatNum(data.mu[i]) + "</td>";
		    }
		    else {
			trow += "<td class='appCol " + data.id + "_mu'>" + blank + "</td>";
		    }
		    trow += "<td class='appCol " + data.id + "_nu'>" + formatNum(data.nu[i]) + "</td>";
		    trow += "<td class='appCol " + data.id + "_k'>" + formatNum(data.k[i]) + "</td>";
		    trow += "<td class='appCol " + data.id + "_alpha'>" + formatNum(data.alpha[i]) + "</td>";
		    trow += "<td class='appCol " + data.id + "_Pr'>" + formatNum(data.pr[i]) + "</td>";
		    if (data.table == "A5") {
			trow += "<td class='appCol " + data.id + "_beta'>" + formatNum(data.beta[i]) + "</td>";
		    }
		    else {
			trow += "<td class='appCol " + data.id + "_beta'>" + blank + "</td>";
		    }
		    trow += "<td class='appCol " + data.id + "_sigma'>" + blank + "</td>";
		    trow += "<td class='appCol " + data.id + "_hfg'>" + blank + "</td>";
		    //trow += "<td data-pname='sigma'>" + formatNum(data.sigma[i]) + "</td>";
		    //trow += "<td data-pname='hfg'>" + formatNum(data.hfg[i]) + "</td>";
		    trow += "</tr>";

		$(tableName).append(trow);
	    }
	    //text += tableName + "\n";
	}
	
    }
}

function materialSelections() {
    
    for(i in materials) {
	var mat = window[materials[i]];
	var tableName = "#" + String(mat.table).toLowerCase() + "_selections";
	var selection = "<li><a href='#" + mat.id + "'>" + mat.name + "</a></li>";
	$(tableName).append(selection);
	
    }
//    var selections = "<ul>";
//    +
//			"<li></li>" +
//			"<li></li>" +
//			"<li></li>" +
//		     "</ul>";
//    $("#selectMaterial").html(selections);
}
/********************************************************
 *	    Document ready and keypress events
 ********************************************************/
$( document ).ready(function() {
    // Add the table heading to the main calculated property table
    $("#dataTable").append("<thead>" + calcPropLabels + "</thead>");
    $("#dataTable").append("<tbody id='dataTableBody'></tbody>");
    
    // Load appendix tables in background
    $(".appendixTable").hide();
    $("#selectMaterial").hide();
    fillAppendixTables();
    materialSelections();	// Option to click a specific material
});

// PLOTTING VARIABLES
var tempArray = [];	// For plotting property values (stores temperatures)
var propArray = [];	// For plotting property values (stores property values)
var propName = ''; 	// For plotting property values (stores property name (e.g. cp, rho, etc.))
var matNameArray = [];	// For plotting property values (stores name of material)

// When an appendix table column is hovered, highlight whole column
$('.appendixTable').on('mouseenter', '.appCol', function() {
    // Figure out which material is highlighted
    var classes = this.className.split(/\s+/);
    var matID = classes[1].split("_")[0];
    propName = classes[1].split("_")[1];

    // Iterate through all of the rows for this material/property combo
    var temps = $("." + classes[1]).each(function(i,obj) {
	$(obj).addClass("warning plotMe cursor");	// Mark for plotting

	// Store values in arrays for plotting
	propArray.push( parseFloat($(obj).html()) );
	tempArray.push( parseFloat($(obj.parentNode).children(".tempCol").html()) );
	matNameArray.push(window[matID].name);  // Intentionally push multiple copies for easier indexing in plot()
    });
});
$('.appendixTable').on('mouseleave', '.appCol', function() {
    var classes = this.className.split(/\s+/);
    var temps = $("." + classes[1]).each(function(i,obj) {
	$(obj).removeClass("warning plotMe cursor");	// Unmark for plotting
    });
    
    // Clear the data arrays for storing
    propArray = [];
    tempArray = [];
});

// When a row of the appendix table is clicked, plot the corresponding property values
$('.appendixTable').on('click', '.plotMe', function() {
    plotAppendix();
});

// When a calculated table column is hovered, highlight whole column
$('#dataPanel').on('mouseenter', '.calcCol', function() {
    // Figure out which material is highlighted
    var classes = this.className.split(/\s+/);
    propName = classes[1];

    // Iterate through all of the rows in the calculated table and plot the property values
    var temps = $("." + classes[1]).each(function(i,obj) {
	$(obj).addClass("warning plotMe cursor");	// Mark for plotting
	
	// Store values in arrays for plotting
	propArray.push( parseFloat($(obj).html()) );
	tempArray.push( parseFloat($(obj.parentNode).children(".T").html()) );
	matNameArray.push( $(obj.parentNode).children(".matName").text() );
    });
});
$('#dataPanel').on('mouseleave', '.calcCol', function() {
var classes = this.className.split(/\s+/);
    var temps = $("." + classes[1]).each(function(i,obj) {
	$(obj).removeClass("warning plotMe cursor");	// Unmark for plotting
    });
    
    // Clear the data arrays for storing
    propArray = [];
    tempArray = [];
    matNameArray = [];
});

// When a row of the appendix table is clicked, plot the corresponding property values
$('#dataPanel').on('click', '.plotMe', function() {
    plotCalculated();
});

// Plot property values vs. temperature from the list of calculated values
function plotCalculated() {
    
    // Generate the series objects
    sObjects = [];
    var points = [];
    for(i in tempArray) {
	sObjects.push( {
	    name: matNameArray[i] + " @ " + tempArray[i] + " K",
	    data: [propArray[i]]
	});
    }
    
    $('#plotContainer').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Comparison of ' + propName + ' Values'
        },
        yAxis: {
            title: {
                text: propName
            }
        },
	series: sObjects
    });
    
    // Display the plot
    $('#comparePlot').modal({
	keyboard: true,
	show: true
    });
}

// Plot property values vs. temperature from the appendix tables
function plotAppendix() {
    
    // Generate the series objects
    sObjects = [];
    var points = [];
    for(i in tempArray) {
	points.push([tempArray[i],propArray[i]]);
    }
    var curSeries = {
	name:matNameArray[0],
	data:points
    }
    
    // Add to list of series objects
    sObjects.push(curSeries);
    
    $('#plotContainer').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: propName + ' vs. Temperature'
        },
        xAxis: {
            title: {
                text: 'Temperature (K)'
            }
        },
        yAxis: {
            title: {
                text: propName
            }
        },
	series: sObjects
    });
    
    // Display the plot
    $('#comparePlot').modal({
	keyboard: true,
	show: true
    });
}

// Capture the ENTER key for calculating
$(document).keypress(function(e) {
  if(e.which == 13) {
    if ($("#temp").is(":focus")) {
	if (document.getElementById("temp").value != "") {
	    if(validate()) {
	    addRow();
	    }
	}
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
    $("#selectMaterial").show();
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
    $("#selectMaterial").hide();
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

// Take user back to top of page from any table position
$('.appendixTable').on('click', '.backToTop', function(){
    window.location.hash = "";
    window.location.hash = "TOP";
});

// Clear selected and calculated properties
$("#about").click(function() {
    plotAppendix();
});