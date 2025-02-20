const getDPI = () => {
  const div = document.createElement('div')
  div.style.cssText = 'width:1in;height:1in;position:absolute;left:-100%;top:-100%;'
  document.body.appendChild(div)

  const dpi = div.offsetWidth
  document.body.removeChild(div)

  return dpi
}

export default getDPI
