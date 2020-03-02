var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');
Page({
    data: {
        latitude: '',
        longitude: '',
        address: '',
        recordlatitude: '',
        recordlongitude: '',
      markers: [{
        iconPath: "../../images/mapicon_navi_s.png",
        id: 0,
        width: 23,
        height: 33
      },{
        iconPath: "../../images/mapicon_navi_e.png",
        id: 0,
        latitude: 0,
        longitude: 0,
        recordlatitude: 0,
        recordlongitude: 0,
        width: 24,
        height: 34
      }],
      distance: '',
      cost: '',
      polyline: []
    },
    onLoad: function(option) {
        var record = JSON.parse(option.record)
        this.setData({
            record_string: option.record,
            city: option.city,
            latitude: record.latitude,
            longitude: record.longitude,
            address: record.address,
            recordlatitude: record.recordlatitude,
            recordlongitude: record.recordlongitude
        }, () => {
            console.log(this.data, option.record);
        });
      var that = this;
      var key = config.Config.key;
      var myAmapFun = new amapFile.AMapWX({key: key});
      myAmapFun.getTransitRoute({
        origin: this.data.recordlongitude + ',' + this.data.recordlatitude,
        destination: this.data.longitude + ',' + this.data.latitude,
        city: this.data.city,
        success: function(data){
          console.log(data);
          var points = [];
          if(data && data.transits && data.paths[0] && data.paths[0].steps){
            var steps = data.paths[0].steps;
            for(var i = 0; i < steps.length; i++){
              var poLen = steps[i].polyline.split(';');
              for(var j = 0;j < poLen.length; j++){
                points.push({
                  longitude: parseFloat(poLen[j].split(',')[0]),
                  latitude: parseFloat(poLen[j].split(',')[1])
                })
              }
            }
          }
          that.setData({
            polyline: [{
              points: points,
              color: "#0091ff",
              width: 6
            }]
          });
          if(data.paths[0] && data.paths[0].distance){
            that.setData({
              distance: data.paths[0].distance + '米'
            });
          }
          if(data.taxi_cost){
            that.setData({
              cost: '打车约' + parseInt(data.taxi_cost) + '元'
            });
          }

        }
      })
    },
    goDetail: function(){
      wx.navigateTo({
        url: '../navigation_car_detail/navigation'
      })
    },
    goDetail: function(){
      wx.navigateTo({
      url: '../navigation_walk_detail/navigation?record=' + this.data.record_string
      })
    },
    goToCar: function (e) {
        wx.redirectTo({
        url: '../navigation_car/navigation?record=' + this.data.record_string
        })
    },
    goToBus: function (e) {
        wx.redirectTo({
        url: '../navigation_bus/navigation?record=' + this.data.record_string
        })
    },
    goToRide: function (e) {
        wx.redirectTo({
        url: '../navigation_ride/navigation?record=' + this.data.record_string
        })
    },
    goToWalk: function (e) {
        wx.redirectTo({
        url: '../navigation_walk/navigation?record=' + this.data.record_string
        })
    }
  })