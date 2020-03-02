// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const request = require('request')

  request(event.url, function (err, response, body) {

    if (!err && response.statusCode == 200) {
      console.log(body)
      return { "code": "0", "body": body };
    } else{
      return { "code": "-1", "body": err };
    }
  })

}