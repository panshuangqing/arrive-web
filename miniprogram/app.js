//app.js
App({
    onLaunch: function () {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
        wx.cloud.init({
            // env 参数说明
            traceUser: true,
        })
        }
        this.globalData = {}
    },
    intervalPosition: function(){ // 显示 circle params 调用次数
        var newDate = new Date();
        var that = this;
        wx.getLocation({
            type: 'gcj02',
            altitude:true,//高精度定位
            //定位成功，更新定位结果
            success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude
                var speed = res.speed
                var accuracy = res.accuracy
                that.setData({
                    longitude: longitude,
                    latitude: latitude,
                    speed: speed,
                    accuracy: accuracy,
                    scale:13
                }, () => {
                    var scale = 13;
                    that.setData({
                        markers : [{
                                latitude: that.data.record_latitude,
                                longitude: that.data.record_longitude,
                                callout:{
                                    content: "目的地址",
                                    //padding:10,
                                    //display:'ALWAYS',
                                    textAlign:'center'
                                }
                            },
                            {
                                latitude: that.data.latitude,
                                longitude: that.data.longitude,
                                callout:{
                                    content: "当前位置",
                                    //padding:10,
                                    //display:'ALWAYS',
                                    textAlign:'center'
                                }
                            }
                        ],
                        speed: -1,
                        accuracy: 30,
                        scale: scale
                    }, () => {
                        //console.log(that.data);
                    });

                })
            },
            //定位失败回调
            fail:function(){
            },
            complete:function(){
                console.log("in intervalPoaition function", newDate.toLocaleTimeString());
                var nextCallTines = callTimes + 1;
                setTimeout(that.intervalPosition, 8000, nextCallTines);
            }
        });

    }

})
