const puppeteer = require('puppeteer')
const pti = require('puppeteer-to-istanbul')

// Inspiration: https://github.com/trentmwillis/devtools-protocol-demos/blob/master/testing-demos/code-coverage.js

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Enable both JavaScript and CSS coverage
  await Promise.all([
    page.coverage.startJSCoverage(),
    page.coverage.startCSSCoverage()
  ])

  await page.setRequestInterception(false)
  /**
  page.on('request', interceptedRequest => {
    if (
      interceptedRequest.url().includes('praxis') ||
      interceptedRequest.url().includes('cloudfront')
    )
      interceptedRequest.continue()
    else interceptedRequest.abort()
  })
  */

  await page.goto('http://www.know-it.nl/', {
    waitUntil: 'networkidle2'
  })

  // Disable both JavaScript and CSS coverage
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage()
  ])

  let totalBytes = 0
  let usedBytes = 0
  for (const entry of [...cssCoverage]) {
    totalBytes += entry.text.length
    for (const range of entry.ranges) usedBytes += range.end - range.start - 1
  }
  console.log(`Bytes used: ${(usedBytes / totalBytes) * 100}%`)

  pti.write([...cssCoverage])
  await page.close()
  await browser.close()
})()
