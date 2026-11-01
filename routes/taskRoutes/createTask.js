// Post api/Task/ (create ONE task)

var Task = require('../../models/task');
var sendResponse = require('../../utils/response');
var responseMessages = require('../../utils/responseMessages');

module.exports = async function (req, res) {
    // Create one task
    var inputName = req.body.name;
    var inputDescription = req.body.description;
    var inputDeadline = req.body.deadline;
    var inputCompleted = false;
    var inputAssignedUser = "";
    var inputAssignedUserName = "unassigned";
    var inputDateCreated = new Date();

    // just in case it is missing:
    if (req.body.description == null) {
        inputDescription = "No Description Provided";
    }
    if (req.body.assignedUser != null) {
        inputAssignedUser = req.body.assignedUser;
        inputAssignedUserName = req.body.assignedUserName;
    }

    if (inputName == null || inputName.trim() == "" || inputDeadline == null) {
        // missing so return 400
        return sendResponse(res, 400, responseMessages.MISSING_NAME_OR_DEADLINE, null);
    }

    var newTask = new Task();
    newTask.name = inputName;
    newTask.description = inputDescription;
    newTask.deadline = inputDeadline;
    newTask.completed = inputCompleted;
    newTask.assignedUser = inputAssignedUser;
    newTask.assignedUserName = inputAssignedUserName;
    newTask.dateCreated = inputDateCreated;

    try {
        await newTask.save();
        // successful to return 201
        return sendResponse(res, 201, responseMessages.TASK_CREATED, newTask);
    } catch {
        // failed (500 error)
        return sendResponse(res, 500, responseMessages.SERVER_ERROR, null);
    }
};