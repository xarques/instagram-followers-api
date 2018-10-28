const followers = require('./followers');
const { retrieveFollowers } = followers;

retrieveFollowers('dvnentity').then(followers => console.log("Followers " + followers));
