// Post api/Users/:id (update ONE user)

var User = require('../../models/user');
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
        inputPendingTasks = req.body.email;
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
            return sendResponse(res, 400, responseMessages.NON_EXSISTENT, null);
        }
    } catch {
        // failed 500
        return sendResponse(res, 500, responseMessages.SERVER_ERROR, null);
    }

    user_exists.name = inputName;
    user_exists.email = inputEmail;
    user_exists.pendingTasks = inputPendingTasks;

    // try-catch adding it to the database
    try {
        await user_exists.save()
        // succeeded (201 with resource in data)
        return sendResponse(res, 201, responseMessages.USER_UPDATED, user_exists);

    } catch {
        // failed (500 error)
        return sendResponse(res, 500, responseMessages.SERVER_ERROR, null);
    }
};