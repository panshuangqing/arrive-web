//index.js
//获取应用实例
// 打开具体的 任务页面时 展示的内容 会更新 位置信息和 circle 信息
var CountDistance = require('../../libs/map.js');
var MapFunction = require('../../libs/map.js');

var Record = require('../../libs/record.js');
const app = getApp()
Page({
    data: {
        longitude:0,
        latitude: 0,
        record_latitude: 0,
        record_longitude: 0,
        record_latitude: 0,
        record_longitude: 0,
        speed:0,
        accuracy:10,
        markers:[],
        circles: [],
        call_show_circle_num: 0,
        intervalID: 0, // 定时任务的 id
        position_num: 0, // 定位的次数
        position_flag: true,
        next_time: 10, // 下一次定位的时间
        average_speed: new Float32Array(100)

    },
  //事件处理函数
    bindViewTap: function() {
    },

    onUnload: function() {
        console.log("in onUnload Function", app.globalData.detailCircle);
        this.stopShowCircle();
        console.log("in End onUnload Function", app.globalData.detailCircle);
        // 页面销毁时执行 销毁 显示 circle 的圆圈
    },

    onLoad: function (option) {
        console.log("in onLoad Function");

        var record_latitude = parseFloat(option.record_latitude); // 记录的经纬度
        var record_longitude = parseFloat(option.record_longitude);


        console.log(record_latitude, record_longitude);

        wx.showLoading({
        title:"定位中",
        mask:true
        });
        var that = this;
        wx.getLocation({
            type: 'gcj02',
            altitude:true,//高精度定位
            //定位成功，更新定位结果
            success: function (res) {
                var current_latitude = res.latitude; // 当前经纬度
                var current_longitude = res.longitude
                var speed = res.speed
                var accuracy = res.accuracy

                console.log(res);
                var distance = MapFunction.CountDistance(current_latitude, current_longitude, record_latitude, record_longitude);
                var scale = MapFunction.CountScale(distance); // 将两个点都显示在地图上
                var polylines = [{
                    points: [{
                        longitude: record_longitude,
                        latitude: record_latitude
                        },{
                        longitude: current_longitude,
                        latitude: current_latitude
                    }],
                    color:"#FF0000DD",
                    width: 2,
                    scale: scale,
                    dottedLine: true
                }];
                var markers = [{
                    latitude: record_latitude,
                    longitude: record_longitude,
                    callout:{
                        content: "D",
                        padding: 1,
                        display:'BYCLICK',
                        textAlign:'right'
                    }},{
                        latitude: current_latitude,
                        longitude: current_longitude,
                        callout:{
                            content: "C",
                            padding: 1,
                            display:'BYCLICK',
                            textAlign:'right'
                        }
                    }
                ];
                that.setData({
                    latitude: (record_latitude + current_latitude) / 2, // 记录和当前位置的中点
                    longitude: (record_longitude + current_longitude)/2,
                    record_longitude: record_longitude,
                    record_latitude: record_latitude,
                    record_latitude: current_latitude,
                    record_longitude: current_longitude,
                    speed: speed,
                    polyline: polylines,
                    accuracy: accuracy,
                    markers: markers,
                    scale:13,
                    next_time: 1 // 下一次开始定位的时间 间隔时间
                }, () => {
                    console.log(that.data);
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
        });
    },
    onShow: function(){
        console.log("in onShow Function");
        //this.startShowCircle();
        this.startPosition();
    },
    onHide: function(){
        console.log("in onHide Function");
        this.stopShowCircle();
        this.stopPosition(); //结束下一次的定位
    },

    startShowCircle: function(){ // 开始 起一个周期任务
        var intervalID = setInterval(this.showCircle, 1000);
        this.setData(
            {"intervalID": intervalID}
        );
    },

    stopShowCircle: function(){ // 开始 起一个周期任务
        if(this.data.intervalID){
            clearInterval(this.data.intervalID);
        }
    },

    showCircle: function(){
        var newDate = new Date();
        var radius = 200 + ( this.data.call_show_circle_num % 5) * 200; // 500-1000 长度
        console.log("begin show circle function", radius, this.data.call_show_circle_num, newDate.toLocaleTimeString());
        this.setData({
            circles: [{
                latitude: this.data.record_latitude,
                longitude: this.data.record_longitude,
                color: "#ed1941",
                fillColor: "#fdfdfd00",
                radius: radius,
                strokeWidth: 2,
            }],
            call_show_circle_num: this.data.call_show_circle_num + 1
        }, () => {
            console.log(this.data);
        });
    },

    startPosition: function(){ // 开始 起一个周期任务 在函数中自行定义 下一次开始的时间
        this.setData({position_flag: true});
        this.position();// 第一次调用 position 的函数
    },

    stopPosition: function(){ // 开始 起一个周期任务
        this.setData(
            {position_flag: false}
        );
    },
    /**
     * //计算当前的距离 和过去 100 一段时间的 平均速度， 估计 当前的 所需时间 并提示
     * 递归调用自身， 定位和更新图案， 并 计算 可能到达的时间 根据平均时间
     */
    position: function(){

        var newDate = new Date();
        console.log("begin position function", this.data.position_num, newDate.toLocaleTimeString());

        var that = this;
        wx.getLocation({
            type: 'gcj02',
            altitude: true,//高精度定位
            //定位成功，更新定位结果
            success: function (res) {
                var current_latitude = res.latitude; // 当前经纬度
                var current_longitude = res.longitude
                var speed = res.speed
                var accuracy = res.accuracy
                console.log(res);

                var distance = MapFunction.CountDistance(current_latitude, current_longitude, that.data.record_latitude, that.data.record_longitude);
                var diff_distance = MapFunction.CountDistance(current_latitude, current_longitude, that.data.current_latitude, that.data.current_longitude);
                if(diff_distance < 0.5){ // 跟上一次定位时间太近 直接pass 开启下一次定位
                    return ;
                }
                var scale = MapFunction.CountScale(distance); // 将两个点都显示在地图上
                var polylines = [{
                    points: [{
                        longitude: that.data.record_longitude,
                        latitude: that.data.record_latitude
                        },{
                        longitude: current_longitude,
                        latitude: current_latitude
                    }],
                    color:"#FF0000DD",
                    width: 2,
                    scale: scale,
                    dottedLine: true
                }];
                var markers = [{
                    latitude: that.data.record_latitude,
                    longitude: that.data.record_longitude,
                    callout:{
                        content: "D",
                        padding: 1,
                        display:'BYCLICK',
                        textAlign:'right'
                    }},{
                        latitude: current_latitude,
                        longitude: current_longitude,
                        callout:{
                            content: "C",
                            padding: 1,
                            display:'BYCLICK',
                            textAlign:'right'
                        }
                    }
                ];
                // 设置速度
                var new_average_speed = that.data.average_speed;

                if( speed > 0){
                    new_average_speed[that.data.position_num % 50] = speed;
                }
                console.log("in position function the new_average_speed", new_average_speed);

                var average_speed = MapFunction.CountScale(new_average_speed); // 将两个点都显示在地图上
                if(average_speed <= 0){
                    next_time = 10;
                }
                var next_time = distance / average_speed;
                if(next_time > 10){
                    next_time = 10;
                }
                if(next_time < 2){
                    next_time = 2;
                }

                console.log("in position function the next_time", next_time);

                that.setData({
                    latitude: (that.data.record_latitude + current_latitude) / 2, // 记录和当前位置的中点
                    longitude: (that.data.record_longitude + current_longitude)/2,
                    speed: speed,
                    position_num: that.data.position_num + 1,
                    polyline: polylines,
                    accuracy: accuracy,
                    markers: markers,
                    next_time: next_time, // 下一次定位的时间
                    scale: scale,
                    average_speed: new_average_speed
                }, () => {
                    console.log(that.data);
                })
            },
            //定位失败回调
            fail:function(){
                // wx.showToast({
                //     title:"定位失败",
                //     icon:"none"
                // })
                console.log("call getPosition function fail");
            },
            complete:function(){
                //隐藏定位中信息进度
                if(that.data.position_flag){
                    console.log("begin next position function", that.data.next_time);// 不在进行下一次调用了
                    setTimeout(that.position, that.data.next_time * 5000); // 几秒后再次递归调用自己
                } else{
                    console.log("stop next position function", that.data);// 不在进行下一次调用了
                }

            }
        });

    }


})