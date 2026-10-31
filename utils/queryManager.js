function queryManager(req) {

    var selectQuery = {}
    var limitQuery = {}
    var whereQuery = {}
    var sortQuery = {}
    var skipQuery = {}
    var countQuery = false;

    if (req.query.select != null) {
        selectQuery = JSON.parse(req.query.select);
    } else {
        selectQuery = {}
    }

    if (req.query.limit != null) {
        limitQuery = JSON.parse(req.query.limit);
    } else {
        limitQuery = {}
    }

    if (req.query.where != null) {
        whereQuery = JSON.parse(req.query.where);
    } else {
        whereQuery = {}
    }

    if (req.query.sort != null) {
        sortQuery = JSON.parse(req.query.sort);
    } else {
        sortQuery = {}
    }

    if (req.query.skip != null) {
        skipQuery = JSON.parse(req.query.skip);
    } else {
        skipQuery = {}
    }

    if (req.query.count != null) {
        countQuery = JSON.parse(req.query.count);
    } else {
        countQuery = false;
    }

    return {
        selectQuery,
        limitQuery,
        whereQuery,
        sortQuery,
        skipQuery,
        countQuery
    };
};

module.exports = queryManager;