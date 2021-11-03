/**Conversion from dB scale to linear scale(sigma) **/               
              
    // SAR Backscatter in Linear Scale
    //dB = 10log(sigma)
    //sigma = 10pow(dB/10) 
     
    var sigma = sar_data.map(function(image){
     
     
        var angle_band = image.select('angle');
        var sigma_0 = ee.Image.constant(10).pow(image.select('VV').divide(10));
         
        return sigma_0.select(['constant'], ['VV']).addBands(angle_band).copyProperties(image, image.propertyNames())
        //The first list (['constant']) will be used as band selectors and the second list(['VV']) as new names for the selected bands.
        })
    
    /** Normalization of sigma **/
    
    //Normalisation wrt 40 degree reference angle
    //(VV x cos^2(40))/cos^2((respective angle))
    //cos() takes only radians as input
     
    var normalizedSigma = function(image){ 
     
        var theta_iRad = image.select('angle').multiply(Math.PI/180).cos().pow(power_in_norm)
        var ref_iRad = ee.Image(40).multiply(Math.PI/180).cos().pow(power_in_norm)
        var normalized = (image.select('VV').multiply(ref_iRad)).divide(theta_iRad)
        
        return normalized.copyProperties(image, image.propertyNames())
        
                                }
        
        var sigma_normalized = sigma.map(normalizedSigma)
        