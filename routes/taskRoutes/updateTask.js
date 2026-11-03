// Post api/Tasks/:id (update ONE task)

var User = require('../../models/user');
var Task = require('../../models/task');
var sendResponse = require('../../utils/response');
var responseMessages = require('../../utils/responseMessages');

function updateFields(newField, defaultVal) {
    if (newField == null) {
        return defaultVal;
    } else {
        return newField;
    }
}

module.exports = async function (req, res) {
    // Update one task
    var inputId = req.params.id;
    try {
        var task_exists = await Task.findById(inputId);
        if (task_exists == null) {
            // verify that the email is not a duplicate (400 error)
            return sendResponse(res, 404, responseMessages.NON_EXSISTENT, null);
        }
    } catch {
        // failed 500
        return sendResponse(res, 500, responseMessages.SERVER_ERROR, null);
    }

    var inputName = updateFields(req.body.name, null); 
    var inputDescription = updateFields(req.body.description, "Missing Task Description"); 
    var inputDeadline = updateFields(req.body.deadline, null);
    var inputCompleted = updateFields(req.body.completed, false);
    var inputAssignedUser = updateFields(req.body.assignedUser, "");;
    var inputAssignedUserName = updateFields(req.body.assignedUserName, "unassigned");
    var oldAssignedUser = null;
    var newAssignedUser = null;

    if (inputName == null || inputName.trim() == "" || inputDeadline == null) {
        // missing so return 400
        return sendResponse(res, 400, responseMessages.MISSING_NAME_OR_DEADLINE, null);
    }

    // update the old and new assigned user and name fields for next steps
    try {
        if (task_exists.assignedUser != "") {
            oldAssignedUser = await User.findById(task_exists.assignedUser);
        }

        if (inputAssignedUser != "") {
            newAssignedUser = await User.findById(inputAssignedUser);
            if (newAssignedUser == null) {
                return sendResponse(res, 404, responseMessages.NON_EXSISTENT, null);
            }
        }
    } catch (error) {
        // failed 500
        console.log(error)
        return sendResponse(res, 500, responseMessages.SERVER_ERROR, null);
    }

    // 2-way referencing stuff

    // task moved from pending -> completed, so remove from user's pending tasks

    try {
        // Remove task from old user's pending tasks if it was assigned
        if (oldAssignedUser != null && (task_exists.assignedUser !== inputAssignedUser || inputCompleted == true)) {
            await User.findByIdAndUpdate(oldAssignedUser._id, {$pull: {pendingTasks: inputId}});
        }

        // Add task to new user's pending tasks if assigned and not completed
        if (newAssignedUser != null && inputCompleted == false) {
            await User.findByIdAndUpdate(newAssignedUser._id, {$addToSet: {pendingTasks: inputId}});
        }

    } catch (error) {
        // 500 failed
        console.log(error);
        return sendResponse(res, 500, responseMessages.SERVER_ERROR, null);
    }

    if (inputAssignedUser != "" && inputCompleted == false) {
        await User.findByIdAndUpdate(newAssignedUser._id, {$addToSet: {pendingTasks: inputId}});
    }

    task_exists.name = inputName;
    task_exists.description = inputDescription;
    task_exists.deadline = inputDeadline;
    task_exists.completed = inputCompleted;
    task_exists.assignedUser = inputAssignedUser;
    task_exists.assignedUserName = inputAssignedUserName;

    // try-catch adding it to the database
    try {
        await task_exists.save()
        // succeeded (201 with resource in data)
        return sendResponse(res, 200, responseMessages.TASK_UPDATED, task_exists);

    } catch {   
        // failed (500 error)
        return sendResponse(res, 500, responseMessages.SERVER_ERROR, null);
    }
};