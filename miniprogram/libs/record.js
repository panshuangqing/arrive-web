var requestlib = require('./requestlib');
var DOMAIN ="http://arrive-webchat.com";



DOMAIN='http://test.baidu.com';
var AddRecord = function(record) {
    console.log(record);
    var addHandler = {
        params: record,
        method: 'POST',
        url: DOMAIN + '/record/add',
        header: {"content-type": "application/x-www-form-urlencoded"},
        success: function (res) {
            console.log("add record success", record);
        },
        fail: function () {

        },
    }
    console.log('in add record function', addHandler);
    requestlib.GET(addHandler);

}



var PromiseGetRecord = function(user_id) {
    console.log(user_id);

    var url = DOMAIN + '/record/get?user_id=' + user_id;
    return new Promise((resolve, reject) => {
        wx.request({
          url: url,
          success: res => resolve(res)
        })
    });
}



module.exports = {
    AddRecord: AddRecord,
    PromiseGetRecord: PromiseGetRecord
}