/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
    app.use('/api', require('./home.js')(router));

    // User Routes
    app.get('/api', require('./userRoutes/getUser.js')(router));
    app.get('/api', require('./userRoutes/bulkGetUsers.js')(router));
    app.post('/api', require('./userRoutes/createUser.js')(router));
    app.put('/api', require('./userRoutes/updateUser.js')(router));
    app.delete('/api', require('./userRoutes/deleteUser.js')(router));

    // Task Routes
    app.get('/api', require('./taskRoutes/getTask.js')(router));
    app.get('/api', require('./taskRoutes/bulkGetTask.js')(router));
    app.post('/api', require('./taskRoutes/createTask.js')(router));
    app.put('/api', require('./taskRoutes/updateTask.js')(router));
    app.delete('/api', require('./taskRoutes/deleteTask.js')(router));
};
