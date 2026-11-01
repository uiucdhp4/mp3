// GET api/Tasks/ (get ALL tasks)

var Task = require('../../models/task');
var sendResponse = require('../../utils/response');
var queryManager = require('../../utils/queryManager');
var responseMessages = require('../../utils/responseMessages');

module.exports = async function (req, res) {
    // Retrieve one tasks
    var inputId = req.params.id;

    var queries = queryManager(req);

    try {
        var returnedTasks = null;
        // console.log("COUNT QUERY" + queries.countQuery);
        if (queries.countQuery == true) {
            returnedTasks = await Task.find({})
                .select(queries.selectQuery)
                .limit(queries.limitQuery)
                .where(queries.whereQuery)
                .sort(queries.sortQuery)
                .skip(queries.skipQuery)
                .countDocuments(queries.countQuery);
        } else {
            returnedTasks = await Task.find({})
            .select(queries.selectQuery)
            .limit(queries.limitQuery)
            .where(queries.whereQuery)
            .sort(queries.sortQuery)
            .skip(queries.skipQuery);
        }
        
        // task exists, return data and 
        return sendResponse(res, 200, responseMessages.ALL_TASKS, returnedTasks);


    } catch {
        // server error (500)
        return sendResponse(res, 500, responseMessages.SERVER_ERROR, null);
    }
  
};