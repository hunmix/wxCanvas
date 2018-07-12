// 事件总线
class EventBus {
  constructor () {
    this.eventList = []
  }
  // 监听事件
  listen (name, event, scope) {
    if (this.eventList.length) {
      this.eventList.forEach((ele) => {
        if (ele.name === name) {
          ele.thingsList.push(event)
          return false
        }
      }, this)
    }
    this.eventList.push({
      name: name,
      scope: scope,
      thingsList: [event]
    })
    // console.log(this.eventList[0].thingsList[0])
  }
  // 触发事件
  emit (name) {
    console.log('emit')
    let tempArgs = arguments
    if (tempArgs.length < 1) {
      return false
    }
    // var params = Array.prototype.slice.call(tempArgs, 1)
    // console.log(params)
    this.eventList.forEach((ele) => {
      console.log(ele)
      if (ele.name === name) {
        let scope = ele.scope
        ele.thingsList.forEach((_ele) => {
          _ele(scope)
        })
      }
    })
  }
}

export {EventBus}
