//index.js
var Record = require('../../libs/record.js');
const app = getApp();

Page({
data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    records: [
    ],
    openid: '', // 没获取到 用户信息 默认用热门的替代
},

onLoad: function() {
    if (!wx.cloud) {
        wx.redirectTo({
            url: '../chooseLib/chooseLib',
        })
        return;
    }

    // 获取用户信息
    var that = this;
    wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
            console.log('[云函数] [login] user openid: ', res.result.openid)
            app.globalData.openid = res.result.openid
            var records = wx.getStorageSync('records');

            console.log("in index function", records);
            this.setData({records: records});
            // that.setData({records: [
            //     {
            //         id:1,
            //         address: "测试地址open",
            //         status: 1,
            //         city: '==',
            //         latitude: 114.06,
            //         longitude: 114.06
            //     },
            //     {
            //         id:2,
            //         address: "测试地址open",
            //         status: 1,
            //         city: '==',
            //         latitude: 114.06,
            //         longitude: 114.06
            //     }
            // ]});
            // Record.PromiseGetRecord(res.result.openid).then( res =>{
            //     console.log(res);
            //     //that.setData({records: res.data});
            //     that.setData({records: [
            //         {
            //             id:1,
            //             address: "测试地址open",
            //             status: 1,
            //             city: '==',
            //             latitude: 114.06,
            //             longitude: 114.06
            //         },
            //         {
            //             id:2,
            //             address: "测试地址open",
            //             status: 1,
            //             city: '==',
            //             latitude: 114.06,
            //             longitude: 114.06
            //         }
            //     ]}
            // );
            // }
            // );
        },
        fail: err => {
            console.error('[云函数] [login] 调用失败', err);
            that.setData({records: [
                {
                    id:1,
                    address: "测试地址open",
                    status: 1,
                    city: '==',
                    latitude: 114.06,
                    longitude: 114.06
                },
                {
                    id:2,
                    address: "测试地址open",
                    status: 1,
                    city: '==',
                    latitude: 114.06,
                    longitude: 114.06
                }]}
            );
            Dialog.alert({
                title: '获取记录失败',
                message: '使用默认记录'
                }).then(() => {
                // on close
                });
        }
    });
},

testBackgroundL: function(){
    var addHandler = {
        params: {"data": "data"},
        url: '/point/add',
        header: {'content-type': 'application/json'} ,
        success: function (res) {
            console.log("add record success");
        },
        fail: function () {
        },
    };
    Request.GET(addHandler);
    console.log('test');

    setTimeout(this.testBackgroundL, 10000);

},

onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
    this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
    })
    }
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



onShareFunction: function(e){
    console.log("in onShareFunction ", e);
    return {
        title: '转发',
        path: '/pages/record/choose/choose?' + 'latitude=22.540746&longitude=113.979399&recordlatitude=113.900884&recordlongitude=22.553961&name=黄丽家&desc=酸奶在家',
        success: function (res) {
          console.log('成功', res)
        }
    }

},




natigateToAddRecord: function(){ // 跳转到 添加任务的界面
    wx.navigateTo({
        url:"../record/choose/choose?user_id=" + this.data.user_id
    })
},


saveUserInfoBake: function(){ // 保存用户信息到
    console.log(" save User Info function 【 test】");
    wx.cloud.callFunction({
        name: 'post',
        data: {
            "url": 'http://test.baidu.com:8085/user/add',
            "data": {...this.data.userInfo, ...{"user_id": this.data.openid}}
        },
        success: res => {
            console.log('[云函数] [post add user Info] user openid: ', res.result);
            this.getUserRecord(); // 获取 用户信息 例如 record 历史信息
        },
        fail: err => {
            console.error('[云函数] [add user Info] 调用失败', err)
        },
        complete: res =>{
            console.log("[clound function ]", res);
        }
        }).then( res =>{
            console.log(JSON.parse(res.result))
        })
},

})
