// 运行环境配置文件

// 开发环境
const dev = {
  baseUrl: 'http://www.srole-xiaoxian.site:5000/cyan-mongo-api',
  ws: 'wss://dev.qq.cn',
  h5: 'https://dev.qq.cn',
  label: 'dev',
}

// 测试环境
const wechat = {
  baseUrl: 'http://127.0.0.1:5000/cyan-mongo-api',
  ws: 'wss://test.qq.cn',
  h5: 'https://test.qq.cn',
  label: 'test'
}

// 生产环境
const prod = {
  baseUrl: 'http://am.tinsfox.com:8085/cyan-mongo-api',
  ws: 'wss://prod.qq.cn',
  h5: 'https://prod.qq.cn',
  label: 'prod'
}
const tinsfox={
  baseUrl: 'https://send.tinsfox.com/cyan-mongo-api',
  ws: 'wss://prod.qq.cn',
  h5: 'https://prod.qq.cn',
  label: 'prod'
}

module.exports = {
  // host: tinsfox
  // host: test
  host: prod
  // host:dev
}