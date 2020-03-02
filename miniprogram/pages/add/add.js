const app = getApp();
var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');


var AddRecord = require('../../libs/record.js');



// var GetOpenid = required('../../libs/user.js');
// var SaveUserInfo = required('../../libs/user.js');
// var GetPhoneInfo = required('../../libs/user.js');

Page({
    data: {
        isShow: false,
        tips: {},
        longitude: '',
        latitude: '',
        markers: [],
        textData: {}
    },

    onGetOpenid: function() {
        // 调用云函数
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
                console.log('[云函数] [login] user openid: ', res.result.openid)
                app.globalData.openid = res.result.openid
                wx.navigateTo({
                url: '../userConsole/userConsole',
                })
          },
          fail: err => {
                console.error('[云函数] [login] 调用失败', err)
                wx.navigateTo({
                url: '../deployFunctions/deployFunctions',
                })
          }
        })
    },

    onLoad(option) {
        // 判断是否存在地理位置参数
        if(option.location){
            var location = {option: option.location};
        } else{
            var location = {};
        }

        var that = this;
        var key = config.Config.key;
        var myAmapFun = new amapFile.AMapWX({ key: key });

        myAmapFun.getRegeo({...{
            iconPath: "../../images/marker.png",
            iconWidth: 22,
            iconHeight: 32,
            success: function (data) {
                var marker = [{
                    id: data[0].id,
                    latitude: data[0].latitude,
                    longitude: data[0].longitude,
                    iconPath: data[0].iconPath,
                    width: data[0].width,
                    height: data[0].height
                }]
                that.setData({
                    markers: marker
                });
                that.setData({
                    latitude: data[0].latitude
                });
                that.setData({
                    longitude: data[0].longitude
                });
                that.setData({
                    textData: {
                        name: data[0].name,
                        desc: data[0].desc
                    }
                })
            },
            fail: function (info) {
                // wx.showModal({title:info.errMsg})
            }
        }}, {...location}
        )
    },


    AddRecord: function(record){
        console.log(record);
    },


    bindInput: function (e) {
        var _this = this;
        var keywords = e.detail.value;
        var key = config.Config.key;
        var myAmap = new amapFile.AMapWX({ key: key });
        myAmap.getInputtips({
        keywords: keywords,
        location: '',
        success: function (res) {
            if (res && res.tips) {
            _this.setData({
                isShow: true,
                tips: res.tips
            });
            }
        }
        })
    },

    bindSearch: function (e) {
        var location = e.target.dataset.location;
        var key = config.Config.key;
        var myAmapFun = new amapFile.AMapWX({ key: key });
        var that = this;
        myAmapFun.getRegeo({
        iconPath: "../../images/marker.png",
        iconWidth: 22,
        iconHeight: 32,
        location: location,
        success: function (data) {
            console.log(data);
                var marker = [{
                    id: data[0].id,
                    latitude: data[0].latitude,
                    longitude: data[0].longitude,
                    iconPath: data[0].iconPath,
                    width: data[0].width,
                    height: data[0].height
                }]
                that.setData({
                    markers: marker,
                    latitude: data[0].latitude,
                    longitude: data[0].longitude,
                    isShow: false,
                    textData: {
                        name: data[0].name,
                        desc: data[0].desc
                    }
                });
        },
        fail: function (info) {
            console.log(info);
            // wx.showModal({title:info.errMsg})
        }
        })
    }
})