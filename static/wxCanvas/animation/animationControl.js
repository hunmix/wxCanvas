class AnimationControl {
  constructor () {
    this.running = false
    this.loop = 1
    this.index = 0
    this.duration = 1000
    this.startTime = null
    this.goesbyTime = null
  }
  isRunning () {
    return this.running
  }
  start () {
    this.running = true
  }
  complete () {
    this.running = false
  }
  getLoop () {
    return this.loop
  }
  getCurrentIndex () {
    return this.index
  }
  setLoop (loopTime) {
    this.loop = loopTime || 1
    console.log(this.loop)
  }
  setStartTime (startTime) {
    this.startTime = new Date().getTime()
    console.log(this.startTime)
  }
  getGoesbyTime () {
    this.goesbyTime = new Date().getTime() - this.startTime
    return this.goesbyTime
  }
  stop () {
    this.running = false
  }
}

export {AnimationControl}
