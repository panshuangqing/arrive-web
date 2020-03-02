    //index.js
    const app = getApp()
    var call = require("../../libs/requestlib.js")

    Page({
        data: {
            latitude: 0,
            longitude:  0,
            speed : 0,
            accuracy : "",
            user_id: "",
            active: 3,
            showDialog: false,
            records: [
                {
                    "address": "测试地址open",
                    "status": "open",
                },
                {
                    "address": "测试地址close",
                    "status": "close",
                }
            ],
            steps: [
                {
                text: '第一步',
                desc: '选择地点'
                },
                {
                text: '第二步',
                desc: '添加任务'
                },
                {
                text: '第三步',
                desc: '等着提示'
                }
            ]
        },

    onLoad: function(options) {
        //this.setData({user_id: options.user_id}); // 带 用户 id 才进入
        //this.openmap();// 默认打开地图添加任务记录
    },
    onShow: function(options) {
        //this.setData({user_id: options.user_id}); // 带 用户 id 才进入
        //this.openmap();// 默认打开地图添加任务记录
    },

    openDialog: function(event){
        console.log("in openDialog Function");
        this.setData({showDialog: true });
    },

    addRecord: function(){

    },


    SwitchAdd: function(){
        console.log('test test test');
        wx.redirectTo({
            url: '/pages/record/choose/choose'
        })
    },


    onClose() {
        this.setData({showDialog: false });
    },

    openMap: function () {
        var that=this
        //获取当前位置
        wx.getLocation({
          type: 'gcj02',
          success: function (res) {
            var latitude = res.latitude
            var longitude = res.longitude
            var speed = res.speed
            var accuracy = res.accuracy
          }
        })
        wx.chooseLocation({ // 添加任务的回调函数
            success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude
                var speed = res.longitude
                var accuracy = res.accuracy
                that.setData({
                    latitude:latitude,
                    longitude: longitude,
                    speed: speed,
                    accuracy: accuracy
                })
            }
        })
      }

    })
