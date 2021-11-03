/**Linear Regression**/

// ssm_c_m = m (sar_m_c_m) + constant;  y = m(x)+c form 


var beta = function(imageCollection){
  
  
    var linearRegression = imageCollection.aside(print, "collection for regression").reduce(ee.Reducer.linearRegression({ numX: 2, numY: 1 })).aside(print, "linearregression_output")
    var bandNames_lr = [['lr_slope', 'lr_intercept'], ['ssm']]; // 0 and 1-axis variation.
    
    // Flatten the array images to get multi-band images according to the labels.

    var lrImage = linearRegression.select(['coefficients']).arrayFlatten(bandNames_lr).aside(print,"modified_linearregression_image" ).select('lr_slope_ssm')
    var beta_image = ee.Image([]).addBands(lrImage)


    return beta_image

  
}

