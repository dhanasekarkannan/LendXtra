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
      borrowId: {
          type: 'int',
          unique: true,
          autoIncrement: true,
          notNull: true
      },
      image: {
          type: 'string',
          notNull: false
      },
      category: {
          type: 'string',
          notNull: false
      },
      brand: {
          type: 'string',
          notNull: false
      },
      bidRange: {
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
      note: {
          type: 'string',
          notNull: false
      },
      borrowUserId: {
          type: 'string',
          notNull: true
      },
      approvedUserId: {
          type: 'string',
          notNull: false
      },
      borrowLat: {
          type: 'string',
          notNull: true
      },
      borrowLong: {
          type: 'string',
          notNull: true
      },
      borrowApprovedTime: {
          type: 'timestamp',
          notNull: false
      },
      borrowApprovedBid: {
          type: 'string',
          notNull: false
      },
      borrowApprovedCurrency: {
          type: 'string',
          notNull: false
      },
      borrowDesc: {
          type: 'string',
          notNull: false
      },
      bidCurrency: {
          type: 'string',
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
  db.dropTable('lend_borrow_request_info', {
      ifExists: true
  });
  return null;
};

exports._meta = {
  "version": 1
};
