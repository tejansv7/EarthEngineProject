/**SAR data collection - adding 'YMD as millisecond'  in the metadata**/ 
    
var sar_data = ee.ImageCollection(ee.ImageCollection("COPERNICUS/S1_GRD")
.filterDate(startDate, endDate)
.filterBounds(Hisar_geometry)
.filter(ee.Filter.eq('instrumentMode', 'IW'))
.select('VV','angle')
.sort("system:time_start")
.map(date_conv)
.distinct("ymd_millis"))        
.aside(print, 'sar_data')


//generate the list of available dates of sar backscatter data
//distinct ensures unique list of dates

var dates_agg = sar_data.aggregate_array("system:time_start") 
var dates_act =  (dates_agg.map(date_ymd))         
var dates =  (dates_agg.map(date_ymd)).distinct()        


/**Filtering smap collection from the list of distinct sar dates generated**/
var coll = ee.ImageCollection([])   //create an empty image collection
    
//'date' argument is the basis for the loop to take place 
//'output' argument is the argument which stores the output value of the function

//Here ssm is converted to volumetric by multiplying with '2'
   
var agg = function(date, output)      {   
                  var millisec = ee.Date(date).millis()
                  var smap = ee.ImageCollection("NASA_USDA/HSL/SMAP_soil_moisture")
                            .filterDate(ee.Date(date).advance(-2, 'day'), ee.Date(date).advance(1, 'day'))
                            .filterBounds(Hisar_geometry)
                            .select("ssm")
                  var smapcount =  smap.toList(1).length() 
          var datestamp = function(imageCollection)       {
          
                          var img = imageCollection.first()
          
    //This converts the "Surface Soil Moisture in mm to soil moisture in volumetric percentage " 
var img_vol = img.multiply(ee.Image.constant(2)).copyProperties(img, img.propertyNames()) 
                    
var smap_image = ee.Image(ee.Image(img_vol).setMulti({ymd_millis : millisec, Date:date}))          
                          var collection = ee.ImageCollection(ee.Image(smap_image))

                  return ee.ImageCollection(output).merge(collection)

                                                                    } 
                  var outputifnull = output
             return ee.ImageCollection(ee.Algorithms.If(smapcount, datestamp(smap),outputifnull ))
                  
                                            }

                                                     
//Note here we are passing a list of dates and getting an image collection as an output- both its type or nature are different
//the method '.iterate' is useful in such type of situations
var smap =  ee.ImageCollection(dates.iterate(agg, coll))



//iterate runs on 'agg' function and 'smap' is initialized with 'coll' 
    // later the return value of 'agg' function gets stored in 'smap' argument
    
    var smap_dates_agg = smap.aggregate_array("system:time_start")
    var smap_dates =  (smap_dates_agg.map(date_ymd)) 
    var smap_dates_distinct =  (smap_dates_agg.map(date_ymd)).distinct()  
    
    //sar dates used to filter smap, are included as metadata in SMAP
    var smap_dates_modified = smap.aggregate_array("Date"); 
    
