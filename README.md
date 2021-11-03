# EarthEngineProject
This is a repository for different steps in downscaling the SMAP soil moisture data using Sentinel-1 SAR data

# Functions
1. [Link to Functions](https://github.com/tejansv7/EarthEngineProject/blob/main/Functions.js)

<code>
        /** supporting functions **/
        
 /*To add the date yyyy-mm-dd in milliseconds as a property, to use it as a filter while combining the SAR and SMAP collections*/
    
 var date_conv = function(imag){  
       
    var image = imag
    var msec = image.get("system:time_start")
    var date = ee.Date(msec).format("YYYY-MM-dd")
    var millisec = ee.Date(date).millis()
    return ee.Image(image.setMulti({ymd_millis : millisec, Date: date}))
                
               }

/*converting milliseconds into YMD format to visualize the set of available dates for the image collection*/

var date_ymd = function(day){
          var dat = ee.Date(day)
          return dat.format("YYYY-MM-dd")
        }

/*Function used to join two collections on specified criteria, define an inner join*/
var innerJoin = ee.Join.inner();            

/*Specify an equals 
filter for image timestamps*/ 

var filterTimeEq = ee.Filter.equals({      
leftField: 'ymd_millis',
rightField: 'ymd_millis'
    });

        </code>
