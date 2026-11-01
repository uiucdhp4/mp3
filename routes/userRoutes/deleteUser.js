// DELETE api/Users/:id  (delete ONE user)

var User = require('../../models/user');
var sendResponse = require('../../utils/response');
var responseMessages = require('../../utils/responseMessages');

module.exports = async function (req, res) {
    // Delete one user
    var inputId = req.params.id;

    try {
        var toDeleteUser = await User.findById(inputId);

        if (toDeleteUser == null) {
            // non-existent user, 404 error)
            return sendResponse(res, 404, responseMessages.NON_EXSISTENT, null)
        } else {
            // user exists, return data and 
            await toDeleteUser.deleteOne();
            // only exception to sendResponse
            return res.status(204).end();
        }

    } catch (error) {
        // server error (500)
        console.log(error);
        return sendResponse(res, 500, responseMessages.SERVER_ERROR, null);
    }
};