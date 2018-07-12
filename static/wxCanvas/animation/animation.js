class Animation {
  constructor () {
    this.animationStore = []
  }
  add (option, duration) {
    this.animationStore.push([option, duration])
  }
}

export {Animation}
