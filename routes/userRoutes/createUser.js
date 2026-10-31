// Post api/Users/ (create ONE user)

var User = require('../../models/user');
var sendResponse = require('../../utils/response');
var responseMessages = require('../../utils/responseMessages');

module.exports = async function (req, res) {
    // Create one user
    var inputName = req.body.name;
    var inputEmail = req.body.email;
    var inputPendingTasks = [];
    var inputDateCreated = new Date();

    // validate that the user provided a name and email (400 error):
    if (inputName == null || inputName.trim() == "" || inputEmail == null || inputEmail.trim() == "") {
        // return error code
        return sendResponse(res, 400, responseMessages.MISSING_NAME_OR_EMAIL, null);
    }

    try {
        var potential_duplicate = await User.findOne({email: inputEmail});
        if (potential_duplicate != null) {
            // verify that the email is not a duplicate (400 error)
            return sendResponse(res, 400, responseMessages.DUPLICATE_EMAIL, null);
        }
    } catch {
        // failed 500
        return sendResponse(res, 500, responseMessages.SERVER_ERROR, null);
    }

    var newUser = new User ();
    newUser.name = inputName;
    newUser.email = inputEmail;
    newUser.pendingTasks = inputPendingTasks;
    newUser.dateCreated = inputDateCreated;

    // try-catch adding it to the database
    try {
        await newUser.save()
        // succeeded (201 with resource in data)
        return sendResponse(res, 201, responseMessages.USER_CREATED, newUser);

    } catch {
        // failed (500 error)
        return sendResponse(res, 500, responseMessages.SERVER_ERROR, null);
    }
};