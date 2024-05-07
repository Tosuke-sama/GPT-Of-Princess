/**
 * @name:
 * @description: 封装了一下ChatGPT
 * @param {*} msg 发送的消息
 * @param {*} sessionToken 浏览器cookie拿到的令牌
 * @return {Promise}
 */
 const sendChatGPTMsg = async ({ msg, sessionToken }) => {
    const { promise, resolve, reject } = defer();
    const api = new ChatGPTAPI({
      sessionToken,
      markdown: false,
    });
    await api.ensureAuth().catch(reject); // 校验令牌
    api.sendMessage(msg).catch(reject).then(resolve);
    return promise;
  };