const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.uitcheckgemist.nl/')

  // Login
  let i = 1
  for (const num of process.env.OV_CARD.split('-')) {
    await page.type(`#tls_card_information_engravedId_${i++}`, num)
  }
  await page.type('#tls_card_information_expirationDate', '17-01-2024')
  await page.click('#tls_card_information_optIn')
  await page.click('.submit')

  const bday = '#tls_person_information_holderBirthDate'
  await page.waitForSelector(bday)
  await page.type(bday, '09-09-1983')
  await page.click('.submit')

  await page.waitForSelector('#routes')
  const missed = await page.$eval('.resp-tab-item', tab =>
    tab.textContent.replace(/\D/g, '')
  )
  console.log(`Missed checkouts: ${missed}`)

  await page.click('.resp-tab-item:nth-of-type(2)')
  const claims = await page.waitForSelector('#summary_claims_history', {
    visible: true
  })
  await claims.screenshot({
    path: 'claims.png'
  })

  await browser.close()
})()
