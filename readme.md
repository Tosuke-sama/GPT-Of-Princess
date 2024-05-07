## 公主的AI对话后端
# apikey
请在index.js的configuration中配置正确的apikey（可去openai申请或淘宝战士）
# 注意
京介的提示：该后端使用的OpenAI库已经过时了，需要进行修改。类似于：
```javaScript
const  _openAI  = new OpenAI({
  apiKey: "",
  baseURL: ""
});
```