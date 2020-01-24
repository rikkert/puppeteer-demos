const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://m.timesheets.cronos.be/')
  await page.click('.cc-btn')

  // Login
  await page.click('i.fa-user-alt')
  await page.type('#username', 'ramiro.rikkert@diymaxeda.com')
  await page.type('#password', process.env.CRONOS_PW)
  await page.click('.login input[type=submit]')
  await page.waitForFunction('!document.querySelector(".login")')

  // Process time sheet days
  await page.waitFor('.timesheet-days')
  const days = await page.evaluate(
    'document.querySelectorAll(".timesheet-day .day").length'
  )
  for (let i = 0; i < days; i++) {
    // Get new day handle after removed by adding hours
    const day = (await page.$$('.timesheet-day .day'))[i]
    await day.click()
    await page.waitFor(200)

    const activeDay = await page.$eval('.active .day', el => el.textContent)
    try {
      const hours = await page.$eval('.total-hours', div => div.textContent)
      console.log(`${activeDay}: ${hours}`)
    } catch (e) {
      if (activeDay.includes('Saturday') || activeDay.includes('Sunday')) {
      } else {
        await page.click('#addHoursButton')
        await page.click('#select-a-timesheet-code')
        await page.click('.option:nth-of-type(2)')
        await page.type('#normalHours', '8')
        await page.click('#done')
        console.log(`${activeDay}: booking hours...`)
      }
    }
  }

  await browser.close()
})()
