const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://fontpair.co/#featured-pairs';

rp(url)
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

    console.log(fontItems);
  })
  .catch(function(err){
    console.error(err)
  });