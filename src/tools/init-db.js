const 
		db = require('db')
	,	_ = require('underscore');


_.each(db.tableDefinitions, table => {
  const params = {
    TableName: table.tableName,
    KeySchema: table.keySchema,
    AttributeDefinitions: table.attributeDefinitions,
    ProvisionedThroughput: table.provisionedThroughput,
    GlobalSecondaryIndexes: table.GlobalSecondaryIndexes
  };

  db.dbConnection.createTable(params, (err, data) => {
    if (err) {
      console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
    }
  });
});
