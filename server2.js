var mysql = require('mysql');
var logger = require('morgan');
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var request = require('request');
var path = require('path');
var server = require('http').createServer(app);
var polyline = require('polyline');
var Routeboxer = require('geojson.lib.routeboxer');
var boxer = new Routeboxer();
var port = process.env.PORT || 4000;
var gmaps = require('@google/maps').createClient({
  key: ''
});

//MySQL Connector
var conn = mysql.createConnection({
	host : '',
	user : '',
	password : '',
  database : '',
  port:''
});

conn.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + conn.threadId);
  
});



app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
	res.render('index');
});

app.post('/locationData',function(req,res){
  var uniqueArray=[];
  var dataContainer = [];
	gmaps.directions({
			destination: req.body.startText,
			origin: req.body.destinationText,
			mode: 'driving'
		},function(req,res){
			var overviewEncodedPath = res.json.routes[0].overview_polyline.points;
			var decodedPolyline = polyline.decode(overviewEncodedPath);
			var routeboxerPath = boxer.box(decodedPolyline,0.1);
      console.log(routeboxerPath.length);


        for (var i = 0; i < routeboxerPath.length; i++) {
          var swlat = routeboxerPath[i].bbox[0];
          var swlng = routeboxerPath[i].bbox[1];
          var nelat = routeboxerPath[i].bbox[2];
          var nelng = routeboxerPath[i].bbox[3];
       conn.query('select * from `bandraStation_RCOE2` where `restaurants_properties_location_latitude` >= ? AND restaurants_properties_location_latitude <= ? AND restaurants_properties_location_longitude>=? AND restaurants_properties_location_longitude<= ?',[swlat,nelat,swlng,nelng],function(error,results,fields)
            {
              if(results.length>0)
              {
                var numberOfRows = results.length;
                for(var i = 0;i<numberOfRows;i++)
                {
                   if(results[i].restaurants_properties_thumb===null)
                     {
                     results[i].restaurants_properties_thumb="https://vignette.wikia.nocookie.net/canadians-vs-vampires/images/a/a4/Not_available_icon.jpg/revision/latest?cb=20130403054528";
                     }
                  var restobj = {
                    'Restaurant_Name': results[i].restaurants_properties_name,
                    'Restaurant_Zomato_Id': results[i].restaurants_properties_id,
                    'Restaurant_Zomato_URL': results[i].restaurants_properties_url,
                    'Restaurant_Address': results[i].restaurants_properties_location_address,
                    'Restaurant_Locality': results[i].restaurants_properties_location_locality,
                    'Restaurant_City':results[i].restaurants_properties_location_city,
                    'Restaurant_Latitude': results[i].restaurants_properties_location_latitude,
                    'Restaurant_Longitude': results[i].restaurants_properties_location_longitude,
                    'Restaurant_Cuisines': results[i].restaurants_properties_cuisines,
                    'Restaurant_Avg_Cost_For_Two': results[i].restaurants_properties_average_cost_for_two,
                    'Restaurant_Thumbnail': results[i].restaurants_properties_thumb,
                    'Restaurant_User_Rating': results[i].restaurants_properties_user_rating_aggregate_rating,
                    'Restaurant_Text_Rating': results[i].restaurants_properties_user_rating_rating_text,
                    'Restaurant_Menu_URL': results[i].restaurants_properties_menu_url,
                    'Restaurant_Has_Oline_Delivery': results[i].restaurants_properties_has_online_delivery
                     };
  
        dataContainer.push(restobj);
                }  
              }
              else return;
              if (error) throw error;
              

          });
        }
          });
          setTimeout(function(){
            res.send(dataContainer);
              
          },4000);

          
          
/*app.pos*/});


server.listen(port,function(){
	console.log('Server listening at port %d', port);
});
