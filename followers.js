const fetch = require('node-fetch');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports.retrieveFollowers = (name) => {
  return  fetch(`https://instagram.com/${name}`)
  .then(res => res.text())
  .then(body => {
    const dom = new JSDOM(body);
    const document = dom.window.document;
    //const description = document.querySelector('meta[property~="og:description"]').getAttribute("content");
    const description = document.querySelector('meta[name="description"]').getAttribute("content");
    //const followers = parseInt(description.split(' ')[0].replace(/,/g, ''));
    const followers = description.split(' ')[0].replace(/,/g, '');
    return followers;
  });
}
