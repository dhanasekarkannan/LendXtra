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
  db.createTable('lend_borrow_request_info', {
    columns: {
      biddingId: {
          type: 'int',
          unique: true,
          autoIncrement: true,
          notNull: true
      },
      requestId: {
          type: 'int',
          unique: false,
          autoIncrement: false,
          notNull: true
      },
      userId: {
          type: 'int',
          unique: false,
          autoIncrement: false,
          notNull: true
      },
      image: {
          type: 'string',
          notNull: false
      },
      bidPrice: {
          type: 'string',
          notNull: false
      },
      bidCurrency: {
          type: 'string',
          notNull: false
      },
      type: {
          type: 'string',
          notNull: true
      },
      period: {
          type: 'string',
          notNull: false
      },
      deposit: {
          type: 'string',
          notNull: true
      },
      requiredDoc: {
          type: 'string',
          notNull: false
      },
      note: {
          type: 'string',
          notNull: false
      },
      bidLat: {
          type: 'string',
          notNull: true
      },
      bidLong: {
          type: 'string',
          notNull: true
      },
      bidApprovedTime: {
          type: 'timestamp',
          notNull: false
      },
      status: {
        type: 'string',
        defaultValue: 'ACTIVE'
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
  return null;
};

exports._meta = {
  "version": 1
};
