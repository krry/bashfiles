var test = new Firebase('https://scty.firebaseio.com/features')
var wkt = new ol.format.WKT();
test.push(wkt.writeFeature(feature))



after mount draw: (rather than getting the pixel data, we should get the LatLng data)
 
get all the feature's relevant keys
		event.feature.getKeys()
		- id
		- geometry / wkt
		- gutterline

our reference object is something like ~/designId/features/[featureId]

if featureId already exists, then $update

else create featureId





