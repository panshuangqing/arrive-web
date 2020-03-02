//index.js
//获取应用实例
var MapFunction = require('../../../libs/map.js');

var Record = require('../../../libs/record.js');


console.log(Record);

const app = getApp()
Page({
    data: {
        longitude:0,
        latitude: 0,
        address: 'adress',
        speed:0,
        accuracy:10,
        markers: [],
        scale: 13,
        polylines: [],
        searchValue: "",
        textData: {
            name: 'Name',
            desc: 'Desc'
        },
        isShow: false,
    },


    onLoad: function (option) {
        var destination_latitude = parseFloat(option.latitude);
        var destination_longitude = parseFloat(option.longitude);

        var record_latitude = parseFloat(option.record_latitude);
        var record_longitude = parseFloat(option.record_longitude);

        console.log(MapFunction.CountDistance);

        var distance = MapFunction.CountDistance(destination_latitude, destination_longitude, record_latitude, record_longitude);

        var scale = MapFunction.CountScale(distance);

        console.log(marker);
        var middle_point = MapFunction.getCenterPoint(destination_latitude, destination_longitude, record_latitude, record_longitude);

        console.log(middle_point);
        var middle_latitude = middle_point.latitude;
        var middle_longitude = middle_point.longitude

        var marker = [
            {
                id: 1,
                //iconPath: "../../../images/marker.png",
                latitude: destination_latitude,
                longitude: destination_longitude,
                width: 20,
                height: 20
            },{
                id: 2,
                //iconPath: "../../../images/marker.png",
                latitude: middle_latitude,
                longitude: middle_longitude,
                width: 20,
                height: 20
        }
            ,{
                id: 2,
                //iconPath: "../../../images/marker.png",
                latitude: record_latitude,
                longitude: record_longitude,
                width: 20,
                height: 20
        }
        ];
        var polylines = [{
            points: [{
                longitude: record_longitude,
                latitude: record_latitude
                },{
                    longitude: middle_longitude,
                    latitude: middle_latitude
                },{
                longitude: destination_longitude,
                latitude: destination_latitude
            }],
            color:"#FF0000DD",
            width: 2,
            scale: scale,
            dottedLine: true
        }];

        //, middle_longitude = MapFunction.getCenterPoint(latitude, longtitude, record_latitude, record_longitude)
        this.setData({
            scale: scale,
            markers: marker,
            latitude: middle_latitude,
            polylines: polylines,

            longitude: middle_longitude
        }, () => {
            console.log(this.data);
        });

    }
})