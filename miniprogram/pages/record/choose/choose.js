//index.js
//获取应用实例
var CountDistance = require('../../../libs/map.js');
var amapFile = require('../../../libs/amap-wx.js');
var config = require('../../../libs/config.js');

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
        searchValue: "",
        confirm_show: false,
        textData: {
            name: 'Name',
            desc: 'Desc'
        },
        isShow: false,
    },

    onClose(event) {
        console.log(this.data);
        if (event.detail === 'confirm') {
          setTimeout(() => {
                this.setData({
                    confirm_show: false
                });
          }, 1000);
        } else {
            this.setData({
                confirm_show: false
            });
        }
    },

    add(event) { // 添加 任务记录
        this.setData({
            confirm_show: false
        });
        var that = this;
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
                console.log('[云函数] begin to add  record ', res.result.openid)
                app.globalData.openid = res.result.openid

                var records = wx.getStorageSync('record'); // 获取本机器上的数据

                if(! records){
                    records = [];
                }
                console.log(records);

                records = records.concat({
                      ...{
                        point: that.data.latitude + ',' + that.data.longitude,
                        address_name: that.data.textData.name,
                        desc: that.data.textData.desc
                    }, ...{
                    user_id: res.result.openid
                    }}
                );
                wx.setStorageSync('records', records);
                wx.navigateTo({
                    url: '/pages/index/index'
                })



                //   Record.AddRecord(
                //       {...{
                //           point: that.data.latitude + ',' + that.data.longitude,
                //           address_name: that.data.textData.name,
                //           desc: that.data.textData.desc
                //       }, ...{
                //         user_id: res.result.openid
                //       }}
                //   )
            },
            fail: err => {
                console.error('[云函数] [login] 调用失败', err);
                Dialog.alert({
                    title: '错误提示',
                    message: '添加任务失败'
                  }).then(() => {
                    // on close
                  });
            }
          })
    },
    //事件处理函数
    bindViewTap: function() {
    },


    bindmarkertap: function(e){ // 设置 选择点变化时

    },

    bindpoitap: function(e){
        console.log(e);
        this.setData({
            markers: [{
                latitude: e.detail.latitude,
                longitude: e.detail.longitude,
                callout:{
                    content: "选择",
                    padding:10,
                    display:'ALWAYS',
                    textAlign:'center'
                }
            }
            ]
        }

        );

    },

    onLoad: function (option) {
        var latitude = parseFloat(option.latitude);
        var longitude = parseFloat(option.longitude);

        var name = option.name;
        var desc = option.desc;

        var that = this;

        if(latitude && longitude){ // 又一个定位信息
            that.setData({
                longitude: longitude,
                latitude: latitude,
                textData: {
                    name: name,
                    desc: desc
                },
                markers: [{
                    latitude: latitude,
                    longitude: longitude,
                    callout:{
                        content: "位置",
                        padding:10,
                        display:'ALWAYS',
                        textAlign:'center'
                    }
                }
                ],
                scale:13
            });
        } else{
            wx.showLoading({
                title:"定位中",
                mask:true
                });
            var that=this
            wx.getLocation({
                type: 'gcj02',
                altitude:true,//高精度定位
                //定位成功，更新定位结果
                success: function (res) {
                    console.log(res);
                    var latitude = res.latitude
                    var longitude = res.longitude
                    var speed = res.speed
                    that.setData({
                        longitude: longitude,
                        latitude: latitude,
                        speed: speed,
                        markers: [{
                            latitude: latitude,
                            longitude: longitude,
                            callout:{
                                content: "当前位置",
                                padding:10,
                                display:'ALWAYS',
                                textAlign:'center'
                            }
                        }
                        ],
                        scale:13
                    })
                },
                //定位失败回调
                fail:function(){
                        wx.showToast({
                            title:"定位失败",
                            icon:"none"
                        })
                },
                complete:function(){
                    //隐藏定位中信息进度
                    wx.hideLoading()
                }
            })
        }



    },

    bindInput: function (e) {
        var _this = this;
        var keywords = e.detail;
        var key = config.Config.key;
        var myAmap = new amapFile.AMapWX({ key: key });
        console.log('in bind Input ', e);
        myAmap.getInputtips({
            keywords: keywords,
            location: '',
            success: function (res) {
                console.log(res.tips);
                if (res && res.tips) {
                    console.log(res);
                    _this.setData({
                        isShow: true,
                        tips: res.tips
                    });
                }
            },
            error: function(error){
                console.log(error);
            }
        })
    },

    showDialog: function(e){
        this.setData({confirm_show: true});
    },

    bindSearch: function (e) {
        var marker = [{
            id: 1,
            latitude: this.data.latitude,
            longitude: this.data.longitude,
            iconPath: data[0].iconPath,
            width: data[0].width,
            height: data[0].height
            },{
            id: 2,
            latitude: this.dtata.record_latitude,
            longitude: this.data.record_longitude,
            iconPath: data[0].iconPath,
            width: data[0].width,
            height: data[0].height}
        ]
        console.log(marker, that);
        that.setData({
            markers: marker,
            latitude: data[0].latitude,
            longitude: data[0].longitude,
            isShow: false,
            searchValue: data[0].desc,
            textData: {
                name: data[0].name,
                desc: data[0].desc
            }
        }, () => {
            console.log(that.data);
        });
    }
})