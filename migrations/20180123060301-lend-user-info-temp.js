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
  db.createTable('lend_user_info_temp', {
    columns: {
      userId: {
          type: 'int',
          unique: true,
          autoIncrement: true,
          notNull: true
      },
      emailAddr: {
          type: 'string',
          unique: true,
          notNull: true
      },
      mobileNo: {
          type: 'string',
          unique: true,
          notNull: true
      },
      password: {
          type: 'string',
          notNull: true
      },
      deviceToken: {
          type: 'string',
          unique: true,
          notNull: true
      },
      deviceId: {
          type: 'string',
          unique: true,
          notNull: true
      },
      deviceModel: {
          type: 'string',
          notNull: true
      },
      deviceType: {
          type: 'string',
          notNull: true
      },
      regType: {
          type: 'string',
          notNull: true
      },
      firstLogin: {
          type: 'boolean',
          defaultValue: '0'
      },
      lastLogin: {
          type: 'timestamp',
          notNull: false
      },
      status: {
        type: 'string',
        defaultValue: '001'
      },
      createdAt: {
          type: 'timestamp',
          defaultValue: new String('CURRENT_TIMESTAMP')
      },
      updatedAt: {
          type: 'timestamp',
          defaultValue: new String('CURRENT_TIMESTAMP')
      }
    },
    ifNotExists: true
  });
  return null;
};

exports.down = function(db) {
  db.dropTable('lend_user_info_temp', {
      ifExists: true
  });
  return null;
};

exports._meta = {
  "version": 1
};
