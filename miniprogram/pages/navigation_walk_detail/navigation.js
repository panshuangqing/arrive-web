var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');
Page({
    data: {
        latitude: 0,
        longitude: 0,
        address: '',
        recordlatitude: '',
        recordlongitude: '',
        steps: {}
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
        myAmapFun.getWalkingRoute({
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