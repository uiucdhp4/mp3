/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
    app.use('/api', require('./home.js')(router));

    // User Routes
    app.get('/api/users/:id', require('./userRoutes/getUser.js'));
    app.get('/api/users', require('./userRoutes/bulkGetUsers.js'));
    app.post('/api/users', require('./userRoutes/createUser.js'));
    // app.put('/api', require('./userRoutes/updateUser.js'));
    app.delete('/api/users/:id', require('./userRoutes/deleteUser.js'));

    // Task Routes
    // app.get('/api', require('./taskRoutes/getTask.js'));
    // app.get('/api', require('./taskRoutes/bulkGetTask.js'));
    // app.post('/api', require('./taskRoutes/createTask.js'));
    // app.put('/api', require('./taskRoutes/updateTask.js'));
    // app.delete('/api', require('./taskRoutes/deleteTask.js'));
};
