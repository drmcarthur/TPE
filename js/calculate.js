
function generateTableView() {
    $("#dataTable").append("<tbody>");
    for (var i=0; i<Table_A4.CO.T.length;i++) {
	trow = "<tr><td>" + Table_A4.CO.T[i] + "</td><td>" + Table_A4.CO.rho[i] + "</td></tr>";
	$("#dataTable").append(trow);
    }
    $("#dataTable").append("</tbody>");
    $("#dataTable").css("display", "block");
}

$( document ).ready(function() {
    // Load tables
});

// JSON TABLES
var Table_A4 = eval({
	"CO":
	{
		"table":"A4",
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
})

