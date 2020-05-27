// 公共数据

// 星期栏
const weekDays = ['一', '二', '三', '四', '五', '六', '日']

// 课表时间轴
const timeLine = ["08:40-09:25", "09:30-10:15", "10:25-11:10", "11:15-12:00", "14:15-15:00", "15:05-15:50", "16︰00-16:40", "16:40-17:20", "19:00-19:45", "19:50-20:35", "20:40-21:25"]

// 课表颜色
const colors = ["#86b0fe", "#71eb55", "#f7c156", "#76e9eb", "#ff9dd8", "#80f8e6", "#eaa5f7", "#86b3a5", "#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#29ab97", "#61BC69", "#12AEF3", "#E29AAD", "#AFD7A4", "#F1BBB9", "#A0A8AE", "#AD918C", "#ff5f67"]

// 课表数据样例
const course_sample = [{
  "color": 0,//0-21内随机数，用来控制颜色
  "weekday": 1,//星期几
  "start": 1,//第几节开始
  "last": 3,//第几节结束
  "weeks": "1-16周",//上课周期
  "course": "↖点击左上方周数回到校历本周"//课程名称
},
{
  "color": 8,
  "weekday": 1,
  "start": 1,
  "last": 3,
  "weeks": "1-16周",
  "course": "↖点击左上方周数回到校历本周"
},
{
  "color": 11,
  "weekday": 1,
  "start": 5,
  "last": 3,
  "weeks": "1-16周",
  "course": "←点击侧边栏查看课程时间轴←"
},
{
  "color": 2,
  "weekday": 3,
  "start": 1,
  "last": 2,
  "weeks": "1-16周",
  "course": "点开小格子添加课程"
},
{
  "color": 7,
  "weekday": 4,
  "start": 4,
  "last": 3,
  "weeks": "1-16周",
  "course": "有问题记得联系开发者！",
},
{
  "color": 9,
  "weekday": 6,
  "start": 3,
  "last": 2,
  "weeks": "1-16周",
  "course": "点击图标查看更多",
},
{
  "color": 10,
  "weekday": 3,
  "start": 8,
  "last": 2,
  "weeks": "1-16周",
  "course": "觉得好用的话，请分享喔！",
  "classroom": "点击小飞机图标"
},
{
  "color": 3,
  "weekday": 2,
  "start": 3,
  "last": 3,
  "weeks": "1-16周",
  "course": "←左右滑动切换周数 →",
  "classroom": ""
},
{
  "color": 4,
  "weekday": 5,
  "start": 5,
  "last": 2,
  "weeks": "1-16周",
  "course": "点击图标切换模式",
  "classroom": ""
}
]

export {
  weekDays,
  timeLine,
  colors,
  course_sample
}