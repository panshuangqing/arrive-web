var POST = require("./request")
function GetPhoneInfo(){
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            getApp().globalData.openid = res.result.openid
                            resolve(res);
                        },
                        fail : res => {
                            console.log(res); // 用户提示 可能无法使用一些功能
                            reject(res);
                        }
                    })
                }
            }
        })
    })
}
function GetOpenid(){
    return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
                getApp().globalData.openid = res.result.openid
                resolve(res);
            },
            fail: error => {
                reject(error);
            },
            complete: res =>{
                //console.log('[云函数] [getOpenId done]', res);
            }
        })
    });
}


function SaveUserInfo(userInfo, openid){ // 保存用户信息到
    //call.postData('', , function(res){
    let promiseArr = [];
    promiseArr.push(onGetOpenid());
    promiseArr.push(getPhoneInfo());
    Promise.all(promiseArr).then( (result) => {
        var addHandler = {
            params: {...userInfo, ...{"user_id": openid}},
            url: '/user/add',
            header: {'content-type': 'application/json'} ,
            success: function (res) {
                console.log("add record success", res);
            },
            fail: function () {
            },
        }
        POST(addHandler);
    });



}

module.exports = {
    GetOpenid: GetOpenid,
    SaveUserInfo: SaveUserInfo,
    GetPhoneInfo: GetPhoneInfo
}