// 存放shape实例
class Store {
  constructor () {
    this.store = []
    this.deleteItems = []
  }
  // 添加图形
  add (shape) {
    this.store.push(shape)
  }
  // 清空所有图形
  clear () {
    this.store = []
  }
  // 删除最后一个
  cancel () {
    if (this.store.length === 0) { return }
    let deleteItem = this.store.pop()
    this.deleteItems.push(deleteItem)
  }
  // 恢复最后一个删除的
  resume () {
    if (this.deleteItems.length === 0) { return }
    let shape = this.deleteItems.pop()
    this.store.push(shape)
  }
  // 删除特定元素
  delete (item) {
    let index = this.store.indexOf(item)
    if (index !== -1) {
      let deletedItem = this.store.splice(index, 1)[0]
      this.deleteItems.push(deletedItem)
    }
  }
}

export {Store}
