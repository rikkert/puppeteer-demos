const puppeteer = require('puppeteer')
const ora = require('ora')
var Table = require('cli-table3')

;(async () => {
  const browser = await puppeteer.launch({ userDataDir: '.persgroep' })
  const news = [
    {
      title: 'Parool',
      fetcher: getTops(browser, 'https://www.parool.nl/best-gelezen')
    },
    {
      title: 'Volkskrant',
      fetcher: getTops(browser, 'https://www.volkskrant.nl/best-gelezen')
    },
    {
      title: 'Trouw',
      fetcher: getTops(browser, 'https://www.trouw.nl/best-gelezen')
    }
  ]

  news.forEach(obj => {
    ora.promise(obj.fetcher, `Reading ${obj.title}...`)
    obj.fetcher.then(result => {
      var table = new Table({
        head: [obj.title],
        colWidths: [80]
      })

      for (let i = 0; i < 5; i++) {
        table.push([result[i]])
      }
      console.log(table.toString())
    })
  })

  await Promise.all(news.map(obj => obj.fetcher))
  await browser.close()
})()

const getTops = async (browser, url) => {
  const page = await browser.newPage()
  await page.goto(url)

  // Accept cookie wall
  const btn = await page.$('.button.fjs-set-consent')
  if (btn) {
    await btn.click()
    await page.waitForNavigation({ waitUntil: 'networkidle0' })
  }

  return page.$$eval('article a', articles =>
    articles.map(article => article.getAttribute('aria-label'))
  )
}
