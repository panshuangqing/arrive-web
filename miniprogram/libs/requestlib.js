var DOMAIN ="http://arrive-webchat.com"
DOMAIN='http://test.baidu.com';

var util = require('./utils.js');
//GET请求
function GET(requestHandler) {
    requestfunc('GET', requestHandler)
}
//POST请求
function POST(requestHandler) {
    console.log('in POST function');
    requestfunc('POST', requestHandler)
}

function requestfunc(method, requestHandler) {
    //注意：可以对params加密等处理
    var params = requestHandler.params;
    var url = requestHandler.url;
    //var url = 'https://www.baidu.com';

    console.log('in requestfunc function', method, requestHandler);

    if(method == 'GET'){
        var request_data = {
            url: url,
            data: params,
            method: method,
            header: requestHandler.header, // 设置请求的 header
            success: function (res) {
                //注意：可以对参数解密等处理
                requestHandler.success(res.data)
            },
            fail: function () {
                requestHandler.fail()
            },
            complete: function () {
                // complete
            }
        }
    } else{
        console.log(request_data);
        var request_data = {
            url: url,
            data: params,
            method: 'POST',
            aaa: 'aaa',
            header: requestHandler.header, // 设置请求的 header
            success: function (res) {
                //注意：可以对参数解密等处理
                requestHandler.success(res.data)
            },
            fail: function () {
                requestHandler.fail()
            },
            complete: function () {
                // complete
            }
        }
        console.log(request_data);
    }

    console.log(request_data);


    wx.request(request_data)
}

module.exports = {
  GET: GET,
  POST: POST,
  DOMAIN: DOMAIN
}