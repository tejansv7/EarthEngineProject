/** Downscaling**/
/* smap_m = smap_c + slopefromlinearreg(sar_m - avg(sar_m))
 100m = 27km_100m+100m(100m - (100m_27km_100m)
 function inputs sar, smap, slope, required medium resolution */ 

 var downscale = function(downscalingSet, slope){
 
    var smap_m = downscalingSet.aside(print, "inputcollection_for_downscaling").map(function(image){
      
      var sar_c = image.select("sar_m_c_m");
      var sar_m = image.select("sar_m");
      var smap_c = image.select("ssm_c_m")//.toDouble()
      
      var smap = smap_c.add(slope.multiply((sar_m.subtract(sar_c))))
      //var smap_new = smap.where(smap.lt(0),smap_c ) - not needed for validation
      
      return smap.select(['ssm_c_m'],['smap_m'])
                 .addBands(smap_c)   
                 .addBands(slope)
                 .addBands(sar_m)
                 .addBands(sar_c)
                 .toFloat() 
                 .copyProperties(smap_c, ['system:time_start','system:time_end','ymd_millis', 'Date'])
                 
      // SAR data properties are being copied from above
                       
    })
    
    
    return smap_m.aside(print, "downscaled_collection")
    // return data_final_renamed
    
      
    }
    