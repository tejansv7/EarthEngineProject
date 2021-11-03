var median_sigma = sigma_normalized.reduce(ee.Reducer.median());
    var mad = function(image){
           var mad_img = image.subtract(median_sigma);
      return mad_img.abs();
    }
    var collection_mad = sigma_normalized.map(mad);
    var mad_img = collection_mad.reduce(ee.Reducer.median()).multiply(1.4826);
    
     // Removal of outliers/ masking of outliers
     // Threshhold for outliers - (M−3 ⁎ MAD) < xi < (M + 3 ⁎ MAD)
    var min_crit = median_sigma.subtract(mad_img.multiply(3));
    var max_crit = median_sigma.add(mad_img.multiply(3));
        var mask = function(image){
            var masked_img = image.updateMask(image.gt(min_crit).and(image.lt(max_crit)));
      return masked_img;
          }
        var img_outlier = sigma_normalized.map(mask);
    
