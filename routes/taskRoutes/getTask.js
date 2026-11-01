// GET api/Task/:id  (get ONE task)

var Task = require('../../models/task');
var sendResponse = require('../../utils/response');
var responseMessages = require('../../utils/responseMessages');

module.exports = async function (req, res) {
    // Retrieve one task
    var inputId = req.params.id;
    var selectQuery = {} // if null then we're good
    if (req.query.select != null) {
        selectQuery = JSON.parse(req.query.select);
    }

    try {
        var returnedTask = await Task.findById(inputId).select(selectQuery);

        if (returnedTask == null) {
            // non-existent task, 404 error)
            return sendResponse(res, 404, responseMessages.NON_EXSISTENT, null)
        } else {
            // task exists, return data and 
            return sendResponse(res, 200, responseMessages.FOUND_TASK, returnedTask);
        }

    } catch (error) {
        // server error (500)
        console.log(error);
        return sendResponse(res, 500, responseMessages.SERVER_ERROR, null);
    }
    
};