const cloud = require('wx-server-sdk')
const got = require('got');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  let postResponse = await got(event.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(event.data)
  })

  return postResponse.body
}