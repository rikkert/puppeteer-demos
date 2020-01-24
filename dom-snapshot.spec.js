const puppeteer = require('puppeteer')

test('regression testing Know IT page dom snapshot', async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto('http://www.know-it.nl/')

  expect(await page.content()).toMatchSnapshot()

  await page.close()
  await browser.close()
})
