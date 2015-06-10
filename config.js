var config = {};

config.mongo = {}
config.mongo.path = process.env.MONGO_PATH || ""

config.ssl = {}
config.ssl.pkey = process.env.SSL_PKEY || ""
config.ssl.cert = process.env.SSL_CERT || ""

module.exports = config;