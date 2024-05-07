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