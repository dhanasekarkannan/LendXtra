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
  db.createTable('lend_user_kyc_info', {
    columns: {
      userId: {
          type: 'string',
          unique: true,
          notNull: true
      },
      firstName: {
          type: 'string',
          notNull: false
      },
      middleName: {
          type: 'string',
          notNull: false
      },
      lastName: {
          type: 'string',
          notNull: false
      },
      idProof: {
          type: 'string',
          notNull: false
      },
      idProofDesc: {
          type: 'string',
          notNull: false
      },
      sex: {
          type: 'string',
          notNull: false
      },
      dob: {
          type: 'date',
          notNull: false
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
  db.dropTable('lend_user_kyc_info', {
      ifExists: true
  });
  return null;
};

exports._meta = {
  "version": 1
};
