const fs = require("fs");
const http = require("http");
const https = require("https");

module.exports = function(appConfig, app) {
    let certConfig = {}
    if (appConfig.certificate_path) {
        const key = fs.readFileSync(`${appConfig.certificate_path  }servicebot.key`);
        const cert = fs.readFileSync(`${appConfig.certificate_path  }servicebot.crt`);
        const ca = fs.readFileSync(`${appConfig.certificate_path  }servicebot_bundle.crt`);
        certConfig = {key, cert, ca};
    }
    const server = http.createServer(app);
    const httpsServer = https.createServer(certConfig, app);
    httpsServer.listen(appConfig.ssl_port || 3000);
    server.listen(appConfig.port);
    return {server, httpsServer}
};