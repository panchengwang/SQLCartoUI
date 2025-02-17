import Affine from './Affine'

class MapCanvas {
  constructor(opts) {
    this.opts = opts
    if (!this.opts.el || !(this.opts.el instanceof HTMLDivElement)) {
      console.log('A div element must be provided')
      return
    }

    this.draftPoints = []
    this.affine = new Affine()
    this.center = { x: 0, y: 0 }
    this.scale = 1.0
    this.rotateAnchor = { x: 0, y: 0 }
    this.rotateAngle = 0.0

    this.canvas = document.createElement('canvas')
    this.canvas.addEventListener('mousedown', (e) => {
      this.onMouseDown(e)
    })
    this.canvas.addEventListener('mouseup', (e) => {
      this.onMouseUp(e)
    })
    this.canvas.addEventListener('mousemove', (e) => {
      this.onMouseMove(e)
    })
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
      this.repaint()
    }

    this.resizeObserver = new ResizeObserver(handleResize)
    this.resizeObserver.observe(this.opts.el)
  }

  onMouseDown(e) {
    if (e.button === 0) {
      console.log('left down')
    }
  }

  onMouseUp(e) {
    if (e.button === 0) {
      console.log('left up')
    }
  }

  onMouseMove(e) {
    if (e.button === 0) {
      console.log('left move')
    }
  }

  drawPoint(point) {
    const pt = this.affine.applyToPoint(point)
    this.context.beginPath()
    this.context.arc(pt.x, pt.y, 5, 0, 2 * Math.PI)
    this.context.stroke()
  }

  repaint() {
    this.affine.reset()
    this.affine.translate(this.canvas.width * 0.5, this.canvas.height * 0.5)
    this.affine.scale(2.0, -2.0)
    let pt = { x: 0, y: 0 }
    this.drawPoint(pt)

    pt = { x: 100, y: 0 }
    this.drawPoint(pt)

    // this.affine.rotate(Math.PI * 0.25)
    // this.drawPoint(pt)

    pt = { x: 0, y: 0 }
    this.affine.rotate(Math.PI * 0.25, { x: 100, y: 0 })
    this.drawPoint(pt)
  }
}

export { MapCanvas }
