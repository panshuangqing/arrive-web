var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');
Page({
    data: {

      address: '',
      latitude: 0,
      longitude: 0,
      recordlatitude: 0,
      recordlongitude: 0,
      markers: [{
        iconPath: "../../images/mapicon_navi_s.png",
        id: 0,
        latitude: 39.989643,
        longitude: 116.481028,
        width: 23,
        height: 33
      },{
        iconPath: "../../images/mapicon_navi_e.png",
        id: 0,

        width: 24,
        height: 34
      }],
      distance: '',
      cost: '',
      transits: [],
      polyline: []
    },
    onLoad: function(option) {
      var record = JSON.parse(option.record)
      this.setData({
          record_string: option.record,
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
        //city: '北京',
        success: function(data){
          if(data && data.transits){
            var transits = data.transits;
            for(var i = 0; i < transits.length; i++){
              var segments = transits[i].segments;
              transits[i].transport = [];
              for(var j = 0; j < segments.length; j++){
                if(segments[j].bus && segments[j].bus.buslines && segments[j].bus.buslines[0] && segments[j].bus.buslines[0].name){
                  var name = segments[j].bus.buslines[0].name
                  if(j!==0){
                    name = '--' + name;
                  }
                  transits[i].transport.push(name);
                }
              }
            }
          }
          that.setData({
            transits: transits
          });
        },
        fail: function(info){
        }
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