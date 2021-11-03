/**Resampling**/
    
var resample = function(imageCollection, pixelSize){
      
      
    var resampled =   imageCollection.map(function(image){
                              var img = image.reproject({crs:'EPSG:4326', scale: pixelSize})
                              return img })
                                                        
    return resampled;
                                    }
                                    
  var smap_scale = smap.first().projection().nominalScale()
  
  
  var sar_m = resample(sigma_medianFiltered, resolution_req)
  var sar_m_coarse = resample(sar_m,smap_scale)
  var sar_m_c_m = resample(sar_m_coarse,resolution_req )
  

//conversion to dB
    //dB = 10log(sigma)
    //sigma = 10pow(dB/10) 
    var dBfncn = function(image){
      
        return (image.log10())
                     .multiply(10).copyProperties(image, image.propertyNames())
        
      }
          
      var sar_m_dB = sar_m.map(dBfncn).map(function(image){return image.select(['VV'], ['sar_m'])}) //renaming the bands
      var sar_m_c_m_dB = sar_m_c_m.map(dBfncn)
      var smap_c_m = resample(smap, resolution_req )
      
      var const_img = ee.Image.constant(1)
      
          /**Preparation of datasets for regression and downscaling**/
      
      var sarsmap_cmjoined = innerJoin.apply(sar_m_c_m_dB, smap_c_m, filterTimeEq);
     
          var sarsmap_c_m = ee.ImageCollection(sarsmap_cmjoined.map(function(feature) {   //Feature collection to image collection
                                      return ee.Image.cat(feature.get('primary'), feature.get('secondary'));
                                                                                }));
  
  //Dataset for linear regression
      var sarsmapconst_c_m = sarsmap_c_m.map(function(image){
                            var image1 = image.select('VV').addBands(const_img)    
                            var image2 = image1.addBands(image.select('ssm'))
                            return image2 .select(['VV', 'constant', 'ssm'], ['sar_m_c_m', 'constant', 'ssm_c_m']) 
  
  
                                                          })
  //Dataset for downscaling
      
      var downscaling_set1_fc = innerJoin.apply(sarsmapconst_c_m, sar_m_dB, filterTimeEq);
      var downscaling_set1 = ee.ImageCollection(downscaling_set1_fc.map(function(feature) {   //Feature collection to image collection
                                      return ee.Image.cat(feature.get('primary'), feature.get('secondary'));
                                                                                }));
  