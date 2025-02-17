// import Affine from './Affine'

import { Map } from 'ol'
import View from 'ol/View.js'

class MapCanvas {
  constructor(opts) {
    this.opts = opts
    this.srid = 0
    if (!this.opts.el || !(this.opts.el instanceof HTMLDivElement)) {
      console.log('A div element must be provided')
      return
    }
    this.olMap = new Map({
      view: new View({
        center: [0, 0],
        zoom: 14,
        srid: this.srid === 0 ? 3857 : this.srid,
      }),
      controls: [],
      layers: [],
      target: this.opts.el,
    })
  }

  getSrid() {
    return this.srid
  }

  setSrid(srid) {
    this.srid = srid
    this.olMap.getView().setProjection('EPSG:' + this.srid)
  }
}

export { MapCanvas }
