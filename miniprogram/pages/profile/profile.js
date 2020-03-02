    // pages/profile/profile.js
    Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    onTest: function(){
        wx.navigateTo({
            url: '/pages/detail/detail?latitude=22.540746&longitude=113.979399&recordlatitude=113.900884&recordlongitude=22.553961'//实际路径要写全
        })
    },
    testScale: function(){
        wx.navigateTo({
            url: '/pages/record/more/more?latitude=113.979399&longitude=22.540746&record_latitude=113.900884&record_longitude=22.553961&name=黄丽家&desc=酸奶在家'//实际路径要写全
        })
    }

})