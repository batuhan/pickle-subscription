const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const expressSession = require('express-session');
const knexSession = require("connect-session-knex")(expressSession);
const flash = require('connect-flash');
const swaggerJSDoc = require('swagger-jsdoc');
const logger = require('morgan');
const passport = require('passport');
const path = require('path');
const helmet = require('helmet')
const consume = require("pluginbot/effects/consume");
const {call, put, spawn, takeEvery, select} = require("redux-saga/effects")

const HOME_PATH = path.resolve(__dirname, "../../", "public");
const createServer = require("./server");

module.exports = {
    *run (config, provide, services) {
        const {appConfig} = config;
        const app = express();
        app.use(helmet({
            frameguard: false
        }));
        const exphbs = require('express-handlebars');
        app.engine('handlebars', exphbs({defaultLayout: 'main', layoutsDir: HOME_PATH}));
        app.set('view engine', 'handlebars');
        app.set('views', HOME_PATH);

        if(appConfig.trustProxy){
            app.enable("trust proxy");
        }
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));

        // todo: possibly unsafe? -- look to make this configurable, rather have opt-in than opt-out so default is secure
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Credentials", true);
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            next();
        });

        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, '../../public')));
        const servers = createServer(appConfig, app);
        yield provide({expressApp: app});

        // wait for database to become available
        const database = yield consume(services.database);
        const fileManager = yield consume(services.fileManager);

        const CONFIG_PATH = appConfig.configPath;
        const Settings = require('../../models/system-options');
        const injectProperties = require("../../middleware/property-injector");
        require('../../config/passport.js')(passport);
        yield provide({passport});
        const hostname = process.env.VIRTUAL_HOST || "localhost"



        // var subpath = express();

        // swagger definition
        const swaggerDefinition = {
            info: {
                title: 'ServiceBot API',
                version: '1.0.0',
                description: 'Rest API documentation for ServiceBot',
            },
            host: `${hostname}:${appConfig.port || 3000}`,
            basePath: '/api/v1/',
        };

        // options for the swagger docs
        const options = {
            // import swaggerDefinitions
            swaggerDefinition,
            // path to the API docs
            apis: ["../../api/*"],
        };

        // initialize swagger-jsdoc
        // serve swagger
        const swaggerSpec = swaggerJSDoc(options);

        swaggerSpec.paths = {...require('../../api-docs/api-paths.json'), ...require('../../api-docs/api-entity-paths.json')};
        swaggerSpec.definitions = {...require('../../api-docs/api-model-definitions.json'), ...require('../../api-docs/api-definitions.json')};
        swaggerSpec.securityDefinitions = require('../../api-docs/api-security-definitions.json');

        app.get('/swagger.json', function (req, res) {
            res.setHeader('Content-Type', 'application/json');

            res.send(swaggerSpec);
        });


        const KnexStore = new knexSession({knex: database});
        // todo: move this into a plugin
        app.use(expressSession({
            secret: process.env.SECRET_KEY,
            resave: true,
            saveUninitialized: true,
            store: KnexStore

        }));

        app.use(passport.initialize());
        app.use(passport.session());
        app.use(require("../../middleware/role-session")());
        app.use(flash());
        app.use(injectProperties());

        // auth route doesn't go in express route so it doesn't need auth

        // initialize api route
        const api = express.Router();
        const pages = express.Router();

        app.use("/api/v1", api);
        app.use("/page", pages)
        yield provide({"pageRouter" : pages});
        require("../../api/auth")(api, passport);

        // force all requests to api route to look for token, if token is present in header the user will be logged in with taht token
        api.use(function (req, res, next) {
            passport.authenticate('jwt', function (err, user, info) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return next();
                }
                req.logIn(user, {
                    session: false
                }, function (err) {
                    if (err) {
                        return next(err);
                    }
                    return next();
                });
            })(req, res, next);
        });

        // todo: move apis to plugins.
        require('../../api/users')(api, passport);
        require('../../api/funds')(api);
        require('../../api/invoices')(api);
        require('../../api/service-instances')(api);
        require('../../api/service-instance-properties')(api);
        require('../../api/service-instance-messages')(api);
        require('../../api/service-instance-cancellations')(api);
        require('../../api/service-templates')(api);
        require('../../api/service-template-properties')(api);
        require('../../api/service-categories')(api);
        require('../../api/system-options')(api);
        require('../../api/charge')(api);
        require('../../api/event-logs')(api);
        require('../../api/notification-templates')(api);
        require('../../api/notifications')(api);
        require('../../api/permissions')(api);
        require('../../api/roles')(api);
        require('../../api/tiers')(api);
        require('../../api/webhooks')(api);
        const routeConsumer = require("./router");
        const authService = yield consume(services.authService);
        yield spawn(routeConsumer, api, services.routeDefinition, authService);


        api.use(function (req, res, next) {
            if (res.locals.json) {
                res.json(res.locals.json);
            } else {
                next();
            }
        });

        const store = require("../../config/redux/store");

        app.get('*', async function (req, res) {
            if (req.path.split("/")[3] == "embed" && req.method === 'GET') {
                res.removeHeader('X-Frame-Options');
            }

            const configBuilder = require("pluginbot/config");
            const clientPlugins = Object.keys((await configBuilder.buildClientConfig(CONFIG_PATH)).plugins);
            const {site_title, site_description, hostname} = store.getState().options;
            res.render("main", {vendor: appConfig.vendor_path, bundle : appConfig.bundle_path, plugins : clientPlugins, site_title, site_description, hostname});
        })


        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            const err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // error handler
        app.use(function (err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            console.error(err);
            res.locals.error = req.app.get('env') === 'development' ? err : "unhandled error has happened in server";
            if (err.message == "File too large") {
                err.status = 413;
                res.locals.error = "File too large";

            }

            // send the error
            res.status(err.status || 500).json({error: res.locals.error});

            // res.render('error');
        });



    }
}