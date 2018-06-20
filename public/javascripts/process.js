var map;
var routeBoxer;
var boxes;
var geocoder;
function initMap(){     //used to initialize map. This fucntion name should be same as callback method. please dont change.
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  geocoder = new google.maps.Geocoder();
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



        });
      }


  directionsDisplay.setMap(map);
  var onClickHandler = function(){
    calculateAndDisplayRoute(directionsService, directionsDisplay,routeBoxer);

  };

  var cleanDom = function(){
    removeDomElements();
  };
   //document.getElementById('submit').addEventListener('click',onClickHandler);
   //document.getElementById('submit').addEventListener('click',cleanDom);
   }



document.getElementById('submit').addEventListener('click',function(){
var startText = document.getElementById('start').value;
var destinationText = document.getElementById('end').value;
//console.log(startText);
//console.log(destinationText);
var sendingData = {
  startText:startText,
  destinationText:destinationText
};
$.ajax({
  type:"POST",
  url:"/locationData",
  data:JSON.stringify(sendingData),
  contentType: 'application/json',
            success: function (data,response) {
              //console.log(data);
              if(data.length==0){
                document.getElementById('submit').click();
              }
              
              for(var i=0;i<data.length;i++){
                parseData = data[i];
                $("#RestaurantList").append("<div class='card' style='width: 60rem;margin:auto;'>"+
  "<div class='card-body'>"+
    "<h4 class='card-title'>"+parseData["Restaurant_Name"]+"</h4>"+
    "<p class='card-text'>"+parseData["Restaurant_Address"]+"</p>"+
  "</div>"+
  "<ul class='list-group list-group-flush'>"+
    "<li class='list-group-item'>Cuisines: "+parseData["Restaurant_Cuisines"]+"</li>"+
    "<li class='list-group-item'>Average Cost For Two: "+parseData["Restaurant_Avg_Cost_For_Two"]+"</li>"+
 "</ul>"+
"</div>"+
"<br>"
);
              }
              

            },
            error: function () {
            }
});
});

function fillData(parseData){
  
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

    window.boxes = routeBoxer.box(path,distance);

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

}
  });
}

function removeDomElements(){
  var incomingRestData = document.getElementById('incomingdata');
  while(incomingRestData.firstChild){
    incomingRestData.removeChild(incomingRestData.firstChild);
  }
}



  
  document.getElementById('location-button').addEventListener('click',function(){
    
    console.log('location buttton');
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(inputPosition);
    }
    else
    {
      alert("Sorry, your browser does not support geolocation!");
    }
  
    function inputPosition(position){
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var latlng = new google.maps.LatLng(lat,lng);
    geocoder.geocode({location:latlng},function(results){
      document.getElementById('start').value=results[0].formatted_address;
    
    });
      
    }
  });
  
  

/*

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

*/
