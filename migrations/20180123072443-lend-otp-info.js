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
  db.createTable('lend_otp_info', {
    columns: {
      otpId: {
          type: 'int',
          unique: true,
          autoIncrement: true,
          notNull: true
      },
      userId: {
          type: 'string',
          notNull: true
      },
      otpValue: {
          type: 'string',
          notNull: true
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
  db.dropTable('lend_otp_info', {
      ifExists: true
  });
  return null;
};

exports._meta = {
  "version": 1
};
