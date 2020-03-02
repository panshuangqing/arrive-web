var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');

Page({
  data: {
    latitude: '',
    longitude: '',
    address: '',
    recordlatitude: '',
    recordlongitude: '',
    steps: {}
  },
  onLoad: function(option) {
    this.setData({
        latitude: option.latitude,
        longitude: option.longitude,
        address: option.address,
        recordlatitude: option.recordlatitude,
        recordlongitude: option.recordlongitude
    });
    var that = this;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({key: key});
    myAmapFun.getRidingRoute({
      origin: this.data.latitude + ',' + this.data.longitude,
      destination: this.data.recordlatitude + ',' + this.data.recordlongitude,
      success: function(data){
        if(data.paths && data.paths[0] && data.paths[0].steps){
          that.setData({
            steps: data.paths[0].steps
          });
        }
      },
      fail: function(info){

      }
    })
  }
})