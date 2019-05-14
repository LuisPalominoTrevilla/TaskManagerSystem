const { connection: db } = require('../db/connection');
const mysql = require('mysql');
const moment = require('moment');

moment.tz.setDefault('America/Mexico_City');

const abstractModel = class Model {
    constructor(model) {
        this.model = model;
    }

    exists({ key, id }) {
        let sql = `SELECT count(*) AS count FROM ${this.model} WHERE ${key} = ${mysql.escape(id)}`;
        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) return reject(err);
                const exists = result[0].count !== 0;
                resolve(exists);
            });
        });
    }

    getMany(filter) {
        let sql = `SELECT * FROM ${this.model}`;
        if (filter !== undefined && !Object.keys(filter).length === 0) {
            sql += " WHERE ";
            for (const field in filter) {
                sql += `${field} = ${mysql.escape(filter[field])}, `;
            }
            sql = sql.slice(0, -2);
        }
        console.log(sql);
    }

    insertOne(fields) {
        let sql = `INSERT INTO ${this.model} (`;
        const values = [[]];
        for (const property in fields) {
            sql += `${property},`;
            values[0].push(fields[property]);
        }
        sql = sql.slice(0, -1);
        sql += ") VALUES ?";
        return new Promise((resolve, reject) => {
            db.query(sql, [values], err => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

module.exports = abstractModel;