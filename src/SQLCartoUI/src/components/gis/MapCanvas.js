class MapCanvas {
  constructor(opts) {
    this.opts = opts
    if (!this.opts.el || !(this.opts.el instanceof HTMLDivElement)) {
      console.log('A div element must be provided')
      return
    }
    this.canvas = document.createElement('canvas')
    // this.canvas.className = 'full-width full-height'
    this.context = this.canvas.getContext('2d')
    this.opts.el.appendChild(this.canvas)

    // function debounce(func, timeout = 300) {
    //   let timer
    //   return (...args) => {
    //     clearTimeout(timer)
    //     timer = setTimeout(() => {
    //       func.apply(this, args)
    //     }, timeout)
    //   }
    // }

    // const handleResize = debounce(() => {
    //   this.canvas.width = this.opts.el.clientWidth
    //   this.canvas.height = this.opts.el.clientHeight
    // })

    const handleResize = () => {
      this.canvas.width = this.opts.el.clientWidth
      this.canvas.height = this.opts.el.clientHeight
    }

    this.resizeObserver = new ResizeObserver(handleResize)
    this.resizeObserver.observe(this.opts.el)
  }
}

export { MapCanvas }
