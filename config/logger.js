const winston = require('winston');
require('winston-daily-rotate-file');
const path= require('path');
// const { info } = require('console');


const logFormat= winston.format.combine(
    winston.format.timestamp({
        format:'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(info =>`${info.timestamp}[${info.level.toUpperCase()}]: ${info.message}`)
);


const logger= winston.createLogger({
    level:'info',
    format:logFormat,
    transports:[
        new winston.transports.Console(),

        new winston.transports.DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d'
        }),

        new winston.transports.DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d'
        })

    ]
})

module.exports = logger;