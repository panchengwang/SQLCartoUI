class Affine {
  constructor() {
    // 初始化为单位矩阵
    this.matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1]
  }

  reset() {
    this.matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1]
  }

  // 设置矩阵元素
  setMatrix(matrixArray) {
    if (matrixArray.length === 9) {
      this.matrix = matrixArray
    } else {
      throw new Error('Matrix must be a 3x3 array')
    }
  }

  // 获取矩阵元素
  getMatrix() {
    return this.matrix
  }

  // 打印矩阵
  printMatrix() {
    for (let i = 0; i < 3; i++) {
      console.log(this.matrix.slice(i * 3, (i + 1) * 3))
    }
  }

  // 平移变换
  translate(tx, ty) {
    const translationMatrix = [1, 0, tx, 0, 1, ty, 0, 0, 1]
    this.multiply(translationMatrix)
  }

  // 旋转变换
  rotate(angle, anchorpoint) {
    if (!anchorpoint) {
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const rotationMatrix = [cos, -sin, 0, sin, cos, 0, 0, 0, 1]
      this.multiply(rotationMatrix)
    } else {
      this.translate(anchorpoint.x, anchorpoint.y)
      this.rotate(angle)
      this.translate(-anchorpoint.x, -anchorpoint.y)
    }
  }

  // 缩放变换
  scale(sx, sy) {
    const scalingMatrix = [sx, 0, 0, 0, sy, 0, 0, 0, 1]
    this.multiply(scalingMatrix)
  }

  // 矩阵乘法
  multiply(otherMatrix) {
    const result = []
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        let sum = 0
        for (let k = 0; k < 3; k++) {
          sum += this.matrix[row * 3 + k] * otherMatrix[k * 3 + col]
        }
        result.push(sum)
      }
    }
    this.setMatrix(result)
  }

  inverse() {
    const m = this.matrix
    const det =
      m[0] * (m[4] * m[8] - m[5] * m[7]) -
      m[1] * (m[3] * m[8] - m[5] * m[6]) +
      m[2] * (m[3] * m[7] - m[4] * m[6])

    if (det === 0) {
      throw new Error('Matrix is not invertible')
    }

    const invDet = 1 / det

    const invMatrix = [
      (m[4] * m[8] - m[5] * m[7]) * invDet,
      (m[2] * m[7] - m[1] * m[8]) * invDet,
      (m[1] * m[5] - m[2] * m[4]) * invDet,
      (m[5] * m[6] - m[3] * m[8]) * invDet,
      (m[0] * m[8] - m[2] * m[6]) * invDet,
      (m[2] * m[3] - m[0] * m[5]) * invDet,
      (m[3] * m[7] - m[4] * m[6]) * invDet,
      (m[1] * m[6] - m[0] * m[7]) * invDet,
      (m[0] * m[4] - m[1] * m[3]) * invDet,
    ]

    const inverseAffine = new Affine()
    inverseAffine.setMatrix(invMatrix)
    return inverseAffine
  }

  // 应用变换到点或向量
  applyToPoint(point) {
    let x,
      y,
      w = 1
    if (Array.isArray(point)) {
      x = point[0]
      y = point[1]
    } else if (typeof point === 'object') {
      x = point.x
      y = point.y
    }
    const transformed = [
      this.matrix[0] * x + this.matrix[1] * y + this.matrix[2] * w,
      this.matrix[3] * x + this.matrix[4] * y + this.matrix[5] * w,
      this.matrix[6] * x + this.matrix[7] * y + this.matrix[8] * w,
    ]

    if (Array.isArray(point)) {
      return [transformed[0] / transformed[2], transformed[1] / transformed[2]]
    } else if (typeof point === 'object') {
      return { x: transformed[0] / transformed[2], y: transformed[1] / transformed[2] }
    }

    return null
  }
}

export default Affine
