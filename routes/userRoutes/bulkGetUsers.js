// GET api/Users/ (get ALL user)

var User = require('../../models/user');
var sendResponse = require('../../utils/response');
var queryManager = require('../../utils/queryManager');
var responseMessages = require('../../utils/responseMessages');

module.exports = async function (req, res) {
    // Retrieve all users
    var queries = queryManager(req, "User");

    try {
        var returnedUsers = null;
        // console.log("COUNT QUERY" + queries.countQuery);
        if (queries.countQuery == true) {
            returnedUsers = await User.countDocuments(queries.whereQuery);
        } else {
            returnedUsers = await User.find({})
            .select(queries.selectQuery)
            .limit(queries.limitQuery)
            .where(queries.whereQuery)
            .sort(queries.sortQuery)
            .skip(queries.skipQuery);
        }
        
        // user exists, return data and 
        return sendResponse(res, 200, responseMessages.ALL_USERS, returnedUsers);


    } catch (error) {
        // server error (500)
        console.log(error);
        return sendResponse(res, 500, responseMessages.SERVER_ERROR, null);
    }
  
};