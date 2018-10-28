const followers = require('./followers');
const { retrieveFollowers } = followers;

retrieveFollowers('adrelanine').then(followers => console.log("Followers " + followers));
