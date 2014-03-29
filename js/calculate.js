
// Generate a table with desired material properties
function addRow(material) {
    $("#dataTable").append("<tbody>");
    var trow = "<tr>"
    	alert(window[material].props["T"][0]);
    for (var prop in window[material].props)
    {

	if (prop == Array) {
	    trow += "<td data-pname='" + window[material].props[prop][0] + "'>" + window[material].props[prop][0] + "</td>";
	    alert("got here...");
	}
	else {
	    trow += "<td data-pname='" + window[material].props[prop] + "'>" + window[material].props[prop] + "</td>";
	}
	
    }
    trow += "</tr>"
    $("#dataTable").append(trow);
    $("#dataTable").append("</tbody>");
    $("#dataTable").css("display", "block");
}

$( document ).ready(function() {
    // Load tables
});

// JSON TABLES
var CO = eval({
	"props":
	{
	    "table":"A4",
	    "name":"CO",
	    "tMin":650,
	    "tMax":800,
	    "T":[650,700,750,800],
	    "rho":[0.51806,0.48102,0.44899,0.42095],
	    "cp":[1.101,1.114,1.127,1.140],
	    "mu":[301,315,329,343],
	    "nu":[58.1,65.5,73.3,81.5],
	    "k":[47.0,50.0,52.8,55.5],
	    "alpha":[82.4,93.3,104,116],
	    "pr":[0.705,0.702,0.702,0.705]
	}
});

