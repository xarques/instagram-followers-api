const fetch = require('node-fetch');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports.retrieveFollowers = (name) => {
  return  fetch(`https://instagram.com/${name}`)
  .then(res => res.text())
  .then(body => {
    const dom = new JSDOM(body, { runScripts: "dangerously" });
    const user = dom.window._sharedData.entry_data.ProfilePage[0].graphql.user;
    const followers = user.edge_followed_by.count
    return followers;
  });
}
