const fs = require('fs'); 
const express = require('express');
const app = express();


var { saved, fonts } = JSON.parse(fs.readFileSync('featured.json', 'utf8'));

const elapsedMilliseconds = new Date().getTime() - saved;
const elapsedDays = dateInDays(elapsedMilliseconds)

if (elapsedDays >= 7) {
  updateFontFile()
} 

app.get('/featured', (req, res) => {
  res.send(fonts)
})

app.get('*', (req, res) => {
  res.send(`
Available endpoints: 
<ul>
  <li><a href="/featured">/featured</a></li>
</ul>
  `)
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});


function updateFontFile() {
  fetchFonts().then((fontItems) => {

    const date = new Date().getTime();
    var jsonContent = JSON.stringify({
      saved: date,
      fonts: fontItems
    }); 

    fs.writeFile("featured.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }

        console.log("JSON file has been saved.");
    }); 

  })
}

function fetchFonts() {
  const rp = require('request-promise');
  const $ = require('cheerio');
  const url = 'https://fontpair.co/#featured-pairs';

  return rp(url)
    .then(function(html){
      const container = $('#list > [class="container-small"] > .row', html);
      const fontItems = container[0]['children']
        .filter(i => i.children)
        .map(i => [i.children[5], i.children[7]])
        .filter(i => i[0])
        .map(i => ({
          heading: i[0]['children'][1]['children'][0]['data'],
          body: i[1]['children'][1]['children'][0]['data']
        }))

        return fontItems
    })
    .catch(function(err){
      console.error(err)
    });
}

function dateInDays(ms) {
  let minutes = Math.floor(ms / 60000);
  let hours = Math.round(minutes / 60);
  let days = Math.round(hours / 24);

  return days
}
