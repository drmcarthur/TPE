
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
		"tMin":200,
		"tMax":800,
		"T":[200,220,240,260,280,300,320,340,360,380,400,450,500,550,600,650,700,750,800],
		"rho":[1.6888,1.5341,1.4055,1.2967,1.2038,1.1233,1.0529,0.9909,0.9357,0.8864,0.8421,0.7483,0.67352,0.61226,0.56126,0.51806,0.48102,0.44899,0.42095],
		"cp":[1.045,1.044,1.043,1.043,1.042,1.043,1.043,1.044,1.045,1.047,1.049,1.055,1.065,1.076,1.088,1.101,1.114,1.127,1.140],
		"mu":[127,137,147,157,166,175,184,193,202,210,218,237,254,271,286,301,315,329,343],
		"nu":[7.52,8.93,10.5,12.1,13.8,15.6,17.5,19.5,21.6,23.7,25.9,31.7,37.7,44.3,51.0,58.1,65.5,73.3,81.5],
		"k":[17.0,19.0,20.6,22.1,23.6,25.0,26.3,27.8,29.1,30.5,31.8,35.0,38.1,41.1,44.0,47.0,50.0,52.8,55.5],
		"alpha":[9.63,11.9,14.1,16.3,18.8,21.3,23.9,26.9,29.8,32.9,36.0,44.3,53.1,62.4,72.1,82.4,93.3,104,116],
		"pr":[0.781,0.753,0.744,0.741,0.733,0.730,0.730,0.725,0.725,0.729,0.719,0.714,0.710,0.710,0.707,0.705,0.702,0.702,0.705]
	}
});

$(".material").click(function() {
    //window.alert(this.innerHTML);
    $("#matSelector").hide();
    $("#materialText").html('Properties of <em>' + this.innerHTML + '</em><br/>');
    $("#tempRange").html('T = ' + window[this.dataset.material].props.tMin + ' - ' +
			 window[this.dataset.material].props.tMax + ' K'); 
});