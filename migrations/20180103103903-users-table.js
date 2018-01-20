'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
    db.createTable('lend_user_info_table', {
        columns: {
            id: {
                type: 'int',
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: 'string',
                unique: true,
                notNull: true
            },
            mobile_no: {
                type: 'string',
                unique: true,
                notNull: true
            },
            password: {
                type: 'string',
                notNull: true
            },
            mobile_token: {
                type: 'string',
                unique: true,
                notNull: true
            },
            mobile_id: {
                type: 'string',
                unique: true,
                notNull: true
            },
            slug: {
                type: 'string',
                unique: true,
                notNull: true
            },
            created_at: {
                type: 'timestamp',
                defaultValue: new String('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: 'timestamp',
                defaultValue: new String('CURRENT_TIMESTAMP')
            }
        },
        ifNotExists: true
    });
  return null;
};

exports.down = function(db) {
    db.dropTable('lend_user_info_table', {
        ifExists: true
    });
  return null;
};

exports._meta = {
  "version": 1
};
