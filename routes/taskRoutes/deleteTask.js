// DELETE api/Tasks/:id  (delete ONE task)

var Task = require('../../models/task');
var sendResponse = require('../../utils/response');
var responseMessages = require('../../utils/responseMessages');

module.exports = async function (req, res) {
    // Delete one task
    var inputId = req.params.id;

    try {
        var toDeleteTask = await Task.findById(inputId);

        if (toDeleteTask == null) {
            // non-existent task, 404 error)
            return sendResponse(res, 404, responseMessages.NON_EXSISTENT, null)
        } else {
            // task exists, return data and 
            await toDeleteTask.deleteOne();
            // only exception to sendResponse
            return res.status(204).end();
        }

    } catch (error) {
        // server error (500)
        console.log(error);
        return sendResponse(res, 500, responseMessages.SERVER_ERROR, null);
    }
};