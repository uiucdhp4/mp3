// GET api/Users/:id  (get ONE user)

var User = require('../../models/user');
var sendResponse = require('../../utils/response');
var responseMessages = require('../../utils/responseMessages');

module.exports = async function (req, res) {
    // Retrieve one user
    var inputId = req.params.id;
    var selectQuery = {} // if null then we're good
    if (req.query.select != null) {
        selectQuery = JSON.parse(req.query.select);
    }

    try {
        var returnedUser = await User.findById(inputId).select(selectQuery);

        if (returnedUser == null) {
            // non-existent user, 404 error)
            return sendResponse(res, 404, responseMessages.NON_EXSISTENT, null)
        } else {
            // user exists, return data and 
            return sendResponse(res, 200, responseMessages.FOUND_USER, returnedUser);
        }

    } catch {
        // server error (500)
        return sendResponse(res, 500, responseMessages.SERVER_ERROR, null);
    }
    
};