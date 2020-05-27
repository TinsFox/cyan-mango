const product = {
	"goodTitle":"商品名称商品名称商品名称",
	"description":"商品描述商品描述商品描述",
	"image":["https://cos.ifeel.vip/gzhu-pi/images/icon/empty.svg"],
	"purchase":true,
	"label":["tags1","tags2","tags3"],
	"affiliation":2,
	"price":"38",
	"phone":"13924387832",
	"weChat":"ga",
	"name":"name"
}
const nav=[
  {
    icon: 'https://cos.ifeel.vip/gzhu-pi/images/icon/house.svg',
    name: '全部'
  }, {
    icon: 'https://cos.ifeel.vip/gzhu-pi/images/icon/books.svg',
    name: '图书文具'
  }, {
    icon: 'https://cos.ifeel.vip/gzhu-pi/images/icon/yashua.svg',
    name: '生活用品'
  }, {
    icon: 'https://cos.ifeel.vip/gzhu-pi/images/icon/dianzi.svg',
    color: 'olive',
    name: '电子产品'
  }, {
    icon: 'https://cos.ifeel.vip/gzhu-pi/images/icon/kouhong.svg',
    name: '化妆用品'
  }, {
    icon: 'https://cos.ifeel.vip/gzhu-pi/images/icon/clothes.svg',
    color: 'blue',
    name: '服装鞋包'
  }, {
    icon: 'https://cos.ifeel.vip/gzhu-pi/images/icon/chanping.svg',
    name: '其它'
  }, {
    icon: 'https://cos.ifeel.vip/gzhu-pi/images/icon/wode.svg',
    name: '我的发布'
  }
]
const brick_option={
  showFullContent: true,
  backgroundColor: "rgb(235, 246, 250)",
  forceRepaint: true,
  defaultExpandStatus: false,
  imageFillMode: 'aspectFill',
  columns: 1,
  icon: {
    fill: 'https://images.ifanr.cn/wp-content/uploads/2018/08/640-90-1024x576.jpeg',
    default: 'https://images.ifanr.cn/wp-content/uploads/2018/08/640-90-1024x576.jpeg',
  },
  fontColor: 'black'
}
const category=["全部", "图书文具", "生活用品", "电子产品", "化妆用品", "服装鞋包", "其它"]

export {
  product,
  nav,
  brick_option,
  category
}