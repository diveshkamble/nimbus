var map;
var routeBoxer;
var boxpolys = null;
var socket = io.connect('/',{reconnect:true,'multiplex':false});
var boxes;
function initMap(){     //used to initialize map. This fucntion name should be same as callback method. please dont change.
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
 routeBoxer = new RouteBoxer();

  map = new google.maps.Map(document.getElementById('map'),  //to select map DOM element
  {
    center:{lat:18.91, lng:72.81}, // parameters lat and long set to colaba
    zoom:13                         //zoom level --- try experimenting with the zoom level; i dont know the maximum zoom level
  });
  var inputvalue = ['start','end'];
  for(var i=0;i<=1;i++)  // simple fix for autocomplete feature
  {
   var input = document.getElementById(inputvalue[i]);
    var searchBox = new google.maps.places.SearchBox(input);
    searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

        });
      }



  directionsDisplay.setMap(map);
  var onClickHandler = function(){
    calculateAndDisplayRoute(directionsService, directionsDisplay,routeBoxer);

  };

  var cleanDom = function(){
    removeDomElements();
  };
   document.getElementById('submit').addEventListener('click',onClickHandler);
   document.getElementById('submit').addEventListener('click',cleanDom);
   }


function drawBoxes(boxes){
  boxpolys = new Array(boxes.length);
  for(var i=0;i<boxes.length;i++){
    boxpolys[i] = new google.maps.Rectangle({
      bounds:boxes[i],
      fillOpacity: 0,
      strokeOpacity: 1.0,
      strokeColor: '#000000',
      strokeWeight: 1,
      map:map
    });
  }
}

function clearBoxes(){
  if (boxpolys!= null) {
    for(var i = 0;i<boxpolys.length; i++){
      boxpolys[i].setMap(null);
    }
  }
  boxpolys=null;
}





function calculateAndDisplayRoute(directionsService, directionsDisplay,routeBoxer){
    var distance = 0.1;
  directionsService.route({
  origin:document.getElementById('start').value,
  destination:document.getElementById('end').value,
  travelMode:'DRIVING'
}, function(response, status){
  if (status === 'OK') { //status code to check if the result returned is successful
    directionsDisplay.setDirections(response);   // will improve error handling functionality in future release
    var path = response.routes[0].overview_path;
    console.log(path);
    //console.log(path);
    window.boxes = routeBoxer.box(path,distance);
    console.log(boxes);
    //console.log("longitude: "+boxes[0].b['b']);
    //console.log("latitude: "+boxes[0].f['b']);
    //drawBoxes(boxes);
   /*
    for(var i=0;i<boxes.length;i++)
    {
      delete boxes[i].b['f'];
      delete boxes[i].f['f'];

    }
    */

    //var boxjson = JSON.stringify(boxes);
  /*
    $.ajax({
            type: "POST",
            url: "http://localhost:3000/",
            data:boxjson,
            contentType: 'application/json',
            success: function (data,response) {
            console.log(response.body);



            },
            error: function () {
            }
        });

*/
    socket.emit('locationData',boxes);
} else{
      window.alert('Directions request failed due to '+status);
    }
  });
}

function removeDomElements(){
  var incomingRestData = document.getElementById('incomingdata');
  while(incomingRestData.firstChild){
    incomingRestData.removeChild(incomingRestData.firstChild);
  }
}


socket.on('RestData',function(data){
  //console.log(data);
  //console.log(data);
  var parseData = JSON.parse(data);
  //var temp = parseData["restaurants"]
 // var jsonData = parseData["restaurants"][i]["restaurant"];
  //for(var i=0;i<data.length;i++)
//{
  //var restName = parseData["restaurants"][i]["restaurant"]["name"];

  //$(".incomingdata").append("<p>Restaurant: "+restName+"<p>");



  $("#incomingdata").append("<div class='card' style='width: 60rem;margin:auto;'>"+
  "<div class='card-body'>"+
    "<h4 class='card-title'>"+parseData["Restaurant_Name"]+"</h4>"+
    "<p class='card-text'>"+parseData["Restaurant_Address"]+"</p>"+
    "<a href='/menu/R"+parseData["Restaurant_Zomato_Id"]+"' role='button' style='float: right;' class='btn btn-primary btn-lg' value=R"+parseData["Restaurant_Zomato_Id"]+">OrderNow</a>"+
  "</div>"+
  "<ul class='list-group list-group-flush'>"+
    "<li class='list-group-item'>Cuisines: "+parseData["Restaurant_Cuisines"]+"</li>"+
    "<li class='list-group-item'>Average Cost For Two: "+parseData["Restaurant_Avg_Cost_For_Two"]+"</li>"+
 "</ul>"+
"</div>"+
"<br>"
);

//}
});
