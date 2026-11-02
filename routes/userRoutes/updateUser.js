// Post api/Users/:id (update ONE user)

var User = require('../../models/user');
var Task = require('../../models/task');
var sendResponse = require('../../utils/response');
var responseMessages = require('../../utils/responseMessages');

module.exports = async function (req, res) {
    // Update one user
    var inputId = req.params.id;
    var inputName = req.body.name;
    var inputEmail = req.body.email;
    var inputPendingTasks = null;
    if (req.body.pendingTasks == null) {
        inputPendingTasks = []
    } else {
        inputPendingTasks = req.body.pendingTasks;
    }

    // validate that the user provided a name and email (400 error):
    if (inputName == null || inputName.trim() == "" || inputEmail == null || inputEmail.trim() == "") {
        // return error code
        return sendResponse(res, 400, responseMessages.MISSING_NAME_OR_EMAIL, null);
    }

    try {
        var user_exists = await User.findById(inputId);
        if (user_exists == null) {
            // verify that the email is not a duplicate (400 error)
            return sendResponse(res, 404, responseMessages.NON_EXSISTENT, null);
        }
    } catch {
        // failed 500
        return sendResponse(res, 500, responseMessages.SERVER_ERROR, null);
    }

    // update the task if the pending tasks were changed:
    var tasks = [];
    try {
        // Check that all tasks are valid and exist
        for (var i = 0; i < inputPendingTasks.length; i++) {
            var task_update = await Task.findById(inputPendingTasks[i]);

            if (task_update == null) {
                return sendResponse(res, 404, responseMessages.NON_EXSISTENT, null);
            }

            if (task_update.completed == true) {
                return sendResponse(res, 400, responseMessages.INVALID_REQUEST, null);
            }

            tasks.push(task);
        }
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, responseMessages.SERVER_ERROR, null);
    }

    try {
        // Remove for old pending tasks no longer in the new list
        for (var i = 0; i < user_exists.pendingTasks.length; i++) {
            var oldTaskId = user_exists.pendingTasks[i];

            if (inputPendingTasks.includes(oldTaskId) == false) {
                await Task.findByIdAndUpdate(oldTaskId, {$set: {assignedUser: "", assignedUserName: "unassigned"}});
            }
        }

        // Assign all new pending tasks to this user
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            if (task.assignedUser != "" && task.assignedUser != inputId) {
                await User.findByIdAndUpdate(task.assignedUser, {$pull: {pendingTasks: task._id.toString()}});
            }

            task.assignedUser = inputId;
            task.assignedUserName = inputName;
            await task.save();
        }

        await Task.updateMany({assignedUser: inputId}, {$set: {assignedUserName: inputName}});

    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, responseMessages.SERVER_ERROR, null);
    }


    user_exists.name = inputName;
    user_exists.email = inputEmail;
    user_exists.pendingTasks = inputPendingTasks;

    // try-catch adding it to the database
    try {
        await user_exists.save()
        // succeeded (201 with resource in data)
        return sendResponse(res, 200, responseMessages.USER_UPDATED, user_exists);

    } catch {
        // failed (500 error)
        return sendResponse(res, 500, responseMessages.SERVER_ERROR, null);
    }
};