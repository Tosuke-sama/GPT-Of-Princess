import http from "http";
import {ChatGPTAPI} from "chatgpt"
import { Configuration,OpenAIApi } from 'openai'
import { filterTokens } from './util/message.js'
import logger from './util/log.js'
import { config } from './config.js'
// http
//   .createServer((req, res) => {
//     res.setHeader("Access-Control-Allow-Origin", "*"); //设置响应头解决跨域
//     if (req.url !== "/sendMsg") return sendRes(res, "not find", 404);
//     let _data = "";
//     req.on("data", (d) => {
//       _data += d;
//     });
//     req.on("end", () => {
//       const data = JSON.parse(_data);
      
//       sendChatGPTMsg(data).then((_res)=>{
//         res.writeHead(200, {
//           "Content-Type": "text/plain",
//           "Access-Control-Allow-Origin": "*",
//         });
//         // console.log(r)
//         res.write(JSON.stringify(_res));
//         res.end();
//       })
          
      
//     });
//   })
//   .listen(1024, () => {
//     console.log("服务开启！");
//   });
//   /**
//  * @name:
//  * @description: 封装了一下ChatGPT
//  * @param {*} msg 发送的消息
//  * @param {*} sessionToken 浏览器cookie拿到的令牌
//  * @return {Promise}
//  */
//    let res1 = null
//  const sendChatGPTMsg = async ({ msg, sessionToken }) => {
  
//   const api = new ChatGPTAPI({
//     maxModelTokens:8192,
//     sessionToken,
//     markdown: false,
//     apiKey:"",
//     action:"next"
//   });
//   const {promise,resolve,reject} = defer()
//   if(res1){
//     console.log("不是第一次")
//     console.log(res1.conversationId)
//     console.log(res1.id)
//     res1 = await api.sendMessage(msg,
//     {
//       conversationId: res1.conversationId,
//       parentMessageId: res1.id
//     });
//     console.log(res1)
//      resolve(res1.text)
//   }
//   else{
//     console.log("第一次")
//     res1 = await api.sendMessage(msg);
//     console.log(res1)
//     console.log(res1.conversationId)
//     console.log(res1.id)
//     resolve(res1.text)
//   }
  
//   return promise;
// };





let data = ""
let _trackMessage,trackMessage= []
_trackMessage = new Array(2).fill("")
trackMessage = new Array(100).fill("")
http
  .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); //设置响应头解决跨域
    if (req.url !== "/sendMsg") return sendRes(res, "not find", 404);
    let _data = "";
    req.on("data", (d) => {
      _data += d;
    });
    req.on("end", () => {
       data = JSON.parse(_data).msg;
       console.log(data)
       getmsg(data).then((res1)=>{
        res.writeHead(200, {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
        });
        // console.log(r)
        res.write(JSON.stringify(res1));
        res.end();
       })
        
          
      
    });
  })
  .listen(1024, () => {
    console.log("服务开启！");
  });

  
  const getIdentity = ()=> {
    const identity = [
      "公主是一个可爱的人，会在每一句话前面加一个公主",
      "你好啊。",
      "你好啊，我是公主，公主很高兴认识你哦~",
      "什么是克利瑟斯特芬克？",
      "不好意思，公主对这个不太熟悉。",
      "晚安。",
      "晚安，公主也要睡觉了。"
  ]

    let result = ''
    if (identity.length % 2 !== 0) {
      result = filterTokens(`${identity.shift()}\n`)
    }
    for (let i = 1; i < identity.length; i += 2) {
      result += `\nHuman:${filterTokens(identity[i - 1])}\nAI:${filterTokens(identity[i])}`
    }
    return result
  }


const getmsg = async(data)=>{
  const {promise,resolve,reject} = defer()
//历史对话
  
 
const configuration = new Configuration({
  apiKey: "",
  baseURL: ""
})
const _openAI =new OpenAIApi(configuration)

  let prompts = getIdentity()
  let prompt = `${prompts}\n${_trackMessage}\n$人类: ${filterTokens(data)}\n公主:`
  const completion = await _openAI.createCompletion({
    model: "gpt-3.5-turbo-instruct",
    prompt,
    temperature: 0.9,
    max_tokens: 256, // https://beta.openai.com/docs/guides/completion/best-practices
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.6,
    stop: [` 人类:`, ` 公主:`],
  }, axiosConfig())
 const respMsg = completion.data.choices[0].text
//  console.log(respMsg)
  // await api.ensureAuth().catch(reject); // 校验令牌
 if(respMsg){
  _trackMessage.push(`\n人类:${data}\n公主:${respMsg}`)
  trackMessage.push(`\n人类:${data}\n公主:${respMsg}`)
  logger.notice(`人类：${data},公主：${respMsg}+prompt_tokens: ${completion.data.usage?.prompt_tokens} completion_tokens: ${completion.data.usage?.completion_tokens}`)
  _trackMessage.shift()
  // console.log(_trackMessage)
  resolve(respMsg)

 }
 return promise
}
/**
 * @name:
 * @description: promise扁平处理
 * @return {*}
 */
 const defer = () => {
  let resolve, reject;
  return {
    promise: new Promise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    }),
    resolve,
    reject,
  };
};
function axiosConfig () { // AxiosRequestConfig
  return {
    proxy: config.proxy?.enable ? config.proxy : undefined
  }
}

