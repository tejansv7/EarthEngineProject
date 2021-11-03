/**Median Filtering**/
        //General function for median filtering
    
        var median_filter = function(imageCollection, kernelSize)	{
      
            var filtered_coll = imageCollection.map(function(image)		{

var filtered_img = image.focal_median({radius: kernelSize , kernelType: 'square' }).copyProperties(image, image.propertyNames())

                  return filtered_img

                                                                                    })

return filtered_coll

                                  }

  //MedianFiltered

var sigma_median = median_filter(img_outlier, kernelSize)
