const authRoutes = require('./auth');
const userRoutes = require('./user');

function route(app) {
    app.use('/auth', authRoutes)
    app.use('/users', userRoutes);

    app.get('/', (req, res) => {
        res.send('Hello World!')
    })
}


module.exports = route;