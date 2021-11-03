/** Exporting data **/
Export.image.toDrive({image:download_data , 
    description:'Hisar_downscaledsminvol_from27km_11Nov2019_500m', 
    folder:'Hisar_downscaledfrom27km_500m', 
    region:Hisar_geometry, 
    scale: 500, 
    crs: 'EPSG:4326', 
    maxPixels:1e13 });
    
    
Map.centerObject(Hisar_geometry, 9);                      
Map.addLayer(smap_downscaled_lr, {}, "downscaled_sm_Hisar_geometry",false);
