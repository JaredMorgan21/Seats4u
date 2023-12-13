const mysql = require('mysql');
const db_access  = require('/opt/nodejs/db_access')

exports.handler = async (event) => {
  // TODO implement
  var pool = mysql.createPool({
    host: db_access.config.host,
    user: db_access.config.user,
    password: db_access.config.password,
    database: db_access.config.database
  });
  
  let ValidateExists = (name) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT * FROM Venues WHERE venueName=?", [name], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        if((rows) && rows.length == 1){
          return resolve(true);
        }
        else{
          return resolve(false);
        }
      });
    });
  };
  
  let CreateSections = (leftRows, leftCols, centerRows, centerCols, rightRows, rightCols) => {
    return new Promise((resolve, reject) =>{
      pool.query("INSERT INTO Sections VALUES(?,?,?,?)", [0, leftCols, leftRows, 'leftSection']);
      pool.query("INSERT INTO Sections VALUES(?,?,?,?)", [0, centerCols, centerRows, "centerSection"]);
      pool.query("INSERT INTO Sections VALUES(?,?,?,?)", [0, rightCols, rightRows, "rightSection"], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        return resolve(rows);
      });
    });
  };
  
  let getIDs = () => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT * FROM Sections ORDER BY sectionID DESC LIMIT 3;", [], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        return resolve(rows);
      });
    });
  };
  
  let response = undefined;
  const can_create = await ValidateExists(event.name);
  console.log(can_create);
  
  if(!can_create){ //moved up here so we are creating sections once we are certain we can create a venue
    let r = await CreateSections(event.leftRows, event.leftCols, event.centerRows, event.centerCols, event.rightRows, event.rightCols);
    console.log(r);
    let ids = await getIDs();
  
    let centerID = 0;
    let leftID = 0;
    let rightID = 0;
    let parseIDs = (id) => {
      if(id.name == 'leftSection'){
        leftID = id.sectionID;
      }
      if(id.name == 'centerSection'){
        centerID = id.sectionID;
      }
      if(id.name == 'rightSection'){
        rightID = id.sectionID;
      }
    };
    console.log(ids);
    ids.forEach(parseIDs);
    console.log(leftID, centerID, rightID);
  
  
    let CreateVenue = (name, password, leftID, centerID, rightID) => {
      return new Promise((resolve, reject) => {
        pool.query("INSERT into Venues VALUES(?, ?, ?, ?, ?);", [name, password, leftID, rightID, centerID], (error, rows) => {
          if (error) {return reject(error);}
          if((rows) && (rows.affectedRows == 1)){
            return resolve(name);
          }
          else{
            return resolve(false);
          }
        });
      });
    };
    let add_result = await CreateVenue(event.name, event.password, leftID, centerID, rightID);
    response = {
      statusCode: 200,
      success: add_result
    };
  } else if (can_create) {
    response = {statusCode: 400, error: "A venue with the same name already exists."};
  }
  else{
    response = {
      statusCode: 400,
      success: false
    };
  }
  return response;
};
