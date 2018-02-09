var AV = require('../utils/av-live-query-weapp-min');


class order extends AV.Object{}
// 需要向 SDK 注册这个 Class
AV.Object.register(order,"order");
module.exports = order

