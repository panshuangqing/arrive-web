var CountDistance = function(lat1,  lng1,  lat2,  lng2) {
    console.log(lat1,  lng1,  lat2,  lng2);
    var radLat1 = lat1*Math.PI / 180.0;
    var radLat2 = lat2*Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s *6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 1000);
    return s;
}

var CountScale = function(distiance) {
    var scales = {
        3: 1000000,
        4: 500000,
        5: 200000,
        6: 100000,
        7: 50000,
        9: 20000,
        10: 10000,
        12: 2000,
        13: 1000,
        14: 500,
        15: 200,
        16: 100,
        17: 50,
        18: 50,
        19: 20
    }
    var should_scale = distiance;
    var last_scale = -1;
    var default_scale = 13;
    //console.log(should_scale, distiance);
    for (var the_scale in scales){
        //console.log(should_scale, the_scale, scales[the_scale]);
        if(should_scale >= scales[the_scale] && (should_scale <= last_scale || last_scale < 0) ){
            default_scale = the_scale;
        }
        last_scale = scales[the_scale];
    }
    //console.log(distiance, default_scale);
    return default_scale;
}

var CountAverageSpeed = function(speed_array) {
    var num = 0;
    var sum = 0;
    for (var i = 0; i < speed_array.length; i++) {
        if(speed_array[i] > 0){
            num +=1;
            sum += speed_array[i]
        }
    }
    if (num > 0){
        return sum / num;
    }
    return 0;
}


function rad2degr(rad) { return rad * 180 / Math.PI; }
function degr2rad(degr) { return degr * Math.PI / 180; }

/**
 * @param latLngInDeg array of arrays with latitude and longtitude
 *   pairs in degrees. e.g. [[latitude1, longtitude1], [latitude2
 *   [longtitude2] ...]
 *
 * @return array with the center latitude longtitude pairs in
 *   degrees.
 */
function getCenterPoint(latitude, longtitude, latitude1, longtitude1) {
    var sumX = 0;
    var sumY = 0;
    var sumZ = 0;

    var lat = degr2rad(latitude);
    var lng = degr2rad(longtitude);

    console.log(lat, lng)

    sumX += Math.cos(lat) * Math.cos(lng);
    sumY += Math.cos(lat) * Math.sin(lng);
    sumZ += Math.sin(lat);


    console.log(sumX, sumY, sumZ);

    lat = degr2rad(latitude1);
    lng = degr2rad(longtitude1);

    sumX += Math.cos(lat) * Math.cos(lng);
    sumY += Math.cos(lat) * Math.sin(lng);
    sumZ += Math.sin(lat);

    console.log(sumX, sumY, sumZ);

    var avgX = sumX / 2;
    var avgY = sumY / 2;
    var avgZ = sumZ / 2;

    console.log(avgX, avgY, avgZ);


    console.log(latitude, longtitude, latitude1, longtitude1);

    // convert average x, y to latitude and longtitude
    var lng = Math.atan2(avgY, avgX);
    var hyp = Math.sqrt(avgX * avgX + avgY * avgY);
    var lat = Math.atan2(avgZ, hyp);

    var middle_point = {"longitude": rad2degr(lng), "latitude": rad2degr(lat)}
    console.log(middle_point, latitude, longtitude, latitude1, longtitude1);
    return middle_point;
}




module.exports = {
    CountDistance: CountDistance,
    CountScale: CountScale,
    CountAverageSpeed: CountAverageSpeed,
    getCenterPoint: getCenterPoint
}
