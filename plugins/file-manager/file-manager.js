const {call, put, all, select, fork, spawn, take} = require("redux-saga/effects");
const consume = require("pluginbot/effects/consume");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");

function* run(config, provide, channels) {
    const db = yield consume(channels.database);

    // todo - implement better file system
    const File = require("../../models/file");

    const storage = function (path) {
        return multer.diskStorage({
            destination (req, file, cb) {
                mkdirp(path, err => cb(err, path))
            },
            filename (req, file, cb) {
                require('crypto').pseudoRandomBytes(8, function (err, raw) {
                    cb(err, err ? undefined : `${req.params.id  }-${  raw.toString('hex')}`)
                })
            }
        });
    }
    const fileManager = {
        storage: (filePath) => storage(filePath),
        // middleware: function (req, res, next) {
        //
        // },
        // getFile: function (id) {
        //
        // },
        // //todo : this should be deprecated in future - everythign should be ID
        // getFileByPath: function (path, prefix) {
        //
        // },
        sendFile(file, res){
            const options = {
                headers: {
                    'Content-Disposition': `inline; filename=${  file.get("name")}`
                }
            };
            const abs = path.resolve(__dirname, `../../${  file.get("path")}`);

            res.sendFile(abs, options, (err) => {
                if(err) {
                    console.error(err);
                    res.status(500).json({error: err})
                }
            })

        },
        async deleteFile (file) {
            if (!file) {
                throw "File not found";
            }
            const filePath = file.get("path");
            fs.unlink(filePath, err => {
                if (err) {
                    console.log(`error deleting file ${  err}`);
                }
                else {
                    console.log(`deleted file ${file.get("id")} with path ${filePath}`)
                }
            });
            await file.delete();
            console.log("deleted file");
        },
    };
    yield provide({fileManager});
}

module.exports = {run};