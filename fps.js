const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false
  })
  const page = await browser.newPage()
  const protocol = await page.target().createCDPSession()
  await protocol.send('Overlay.setShowFPSCounter', { show: true })
  await page.goto('http://www.know-it.nl/leden')

  // Do graphical regressions here by interacting with the page
  await protocol.send('Input.synthesizeScrollGesture', {
    x: 100,
    y: 100,
    yDistance: -400,
    repeatCount: 5
  })

  await page.screenshot({
    path: 'fps.jpeg',
    type: 'jpeg',
    clip: {
      x: 0,
      y: 0,
      width: 370,
      height: 370
    }
  })
  await page.close()
  await browser.close()
})()
