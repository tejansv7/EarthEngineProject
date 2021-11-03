var lulc_bands = ee.Image('COPERNICUS/Landcover/100m/Proba-V-C3/Global/2019') //2019 global lulc data at 100m
                   .select('discrete_classification', 'urban-coverfraction', 'water-permanent-coverfraction', 'water-seasonal-coverfraction' )
                   .reproject({crs:'EPSG:4326', scale: 100})
var urban = lulc_bands.select('urban-coverfraction')
var perm_water = lulc_bands.select('water-permanent-coverfraction')
var seas_water = lulc_bands.select('water-seasonal-coverfraction')

/*Generating the mask layer where the above mentioned fractions if more than ten then will
be labelled as '0' otherwise '1'*/
var mask_unwanted = (urban.lt(10)).and(perm_water.lt(10)).and(seas_water.lt(10))  

/**Lulc_mask**/
var mask_at100 = function(image){
      
    var img = image.reproject({crs:'EPSG:4326', scale: 100})
    var masked = img.updateMask(mask_unwanted)                        
          return masked
    
  }
             //applying lulc mask for polygons
  var sigma_medianFiltered = sigma_median.map(mask_at100)

