// GET api/Users/ (get ALL user)

var User = require('../../models/user');
var sendResponse = require('../../utils/response');
var responseMessages = require('../../utils/responseMessages');

function queryManager(req) {

    var selectQuery = {}
    var limitQuery = {}
    var whereQuery = {}
    var sortQuery = {}
    var skipQuery = {}
    var countQuery = false;

    if (req.query.select != null) {
        selectQuery = JSON.parse(req.query.select);
    } else {
        selectQuery = {}
    }

    if (req.query.limit != null) {
        limitQuery = JSON.parse(req.query.limit);
    } else {
        limitQuery = {}
    }

    if (req.query.where != null) {
        whereQuery = JSON.parse(req.query.where);
    } else {
        whereQuery = {}
    }

    if (req.query.sort != null) {
        sortQuery = JSON.parse(req.query.sort);
    } else {
        sortQuery = {}
    }

    if (req.query.skip != null) {
        skipQuery = JSON.parse(req.query.skip);
    } else {
        skipQuery = {}
    }

    if (req.query.count != null) {
        countQuery = JSON.parse(req.query.count);
    } else {
        countQuery = false;
    }

    return {
        selectQuery,
        limitQuery,
        whereQuery,
        sortQuery,
        skipQuery,
        countQuery
    };
};

module.exports = async function (req, res) {
    // Retrieve one user
    var inputId = req.params.id;

    var queries = queryManager(req);

    try {
        var returnedUsers = null;
        // console.log("COUNT QUERY" + queries.countQuery);
        if (queries.countQuery == true) {
            returnedUsers = await User.find({})
                .select(queries.selectQuery)
                .limit(queries.limitQuery)
                .where(queries.whereQuery)
                .sort(queries.sortQuery)
                .skip(queries.skipQuery)
                .countDocuments(queries.countQuery);
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