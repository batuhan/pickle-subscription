const semver = require("semver")
const semver_sort = require("semver-sort")
const glob = require("glob");
const Promise = require("bluebird");




async function migrate(knex){
    const SystemOptions = require("../../../models/system-options");
    console.log(process.env.npm_package_version);
    const migrations = await getMigrations()
    const appVersion = (await SystemOptions.getOptions()).app_version;
    console.log(migrations);
    console.log(appVersion);
    const order = semver_sort.asc(Object.keys(migrations))
    const migrationStart = order.findIndex((migrationVersion) => { return semver.gt(migrationVersion, appVersion)})
    if(migrationStart == -1){
        console.log("db current - no migrations needed")
        return Promise.resolve();
    }
    const migrationsToPerform = order.slice(migrationStart);
    return knex.transaction(trx => {
        return Promise.mapSeries(migrationsToPerform, (migration) => {
            return migrations[migration].up(trx)
        })
    }).then(result => {
        return new Promise(resolve => {
            console.log("migration complete - switching app version to latest");
            console.log(result);
            SystemOptions.findOne("option", "app_version", (version => {
                version.set("value", order.pop());
                version.update(result => {resolve(result)});
            }))
        })
    }).catch(err => {
        console.error(err)
    })
}
function getMigrations(){
    return new Promise((resolve, reject) => {
        glob(require("path").join(__dirname, './versions/*.js'), (err, files) => {
            const migrationVersions = files.reduce((acc, file) => {
                console.log(file);
                const version = file.split("/").pop().slice(0, -3);
                 acc[version] = require(file);
                 return acc;
            },{});
            resolve(migrationVersions);
        })
    })
}

module.exports = migrate;

