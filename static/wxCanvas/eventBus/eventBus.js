// 事件总线
class EventBus {
  constructor () {
    this.eventList = []
  }
  // 监听事件
  listen (name, self, event, removeCallback) {
    let eventInfo = [self, event, removeCallback]
    let callbacks = this.eventList[name]
    if (Array.isArray(callbacks)) {
      callbacks.push(eventInfo)
    } else {
      this.eventList[name] = [eventInfo]
    }
  }
  remove (name, self) {
    let callbacks = this.eventList[name]
    if (Array.isArray(callbacks)) {
      this.eventList[name] = callbacks.filter((callbacks) => {
        let retain = callbacks[0] !== self
        if (!retain) {
          let removeCallback = callbacks[2]
          if (typeof removeCallback === 'function') {
            removeCallback.call(self)
          }
        }
        return retain
      })
    }
  }
  // 触发事件
  emit (name, data) {
    console.log('emit')
    let callbacks = this.eventList[name]
    if (Array.isArray(callbacks)) {
      callbacks.forEach((eventInfo) => {
        console.log(eventInfo)
        let _self = eventInfo[0]
        let callback = eventInfo[1]
        callback.call(_self, data)
      })
    }
  }
}

export {EventBus}
