const puppeteer = require('puppeteer')

const exp = {};


exp.link = async(req,res) => {
    const search = req.body.search
    var link = `https://www.youtube.com/results?search_query=`
    const browser = await puppeteer.launch({
        'args' : [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      });
    const page = await browser.newPage()
    const terms= search.split(' ').join('+')
    await page.goto(link + terms + ' audio')
    const href = await page.$eval("a#thumbnail", (elm) => elm.href)
    console.log(href)
    
    await browser.close()
    return res.send({link: href})
}


module.exports = exp;