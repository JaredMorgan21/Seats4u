const mysql = require('mysql');
const db_access  = require('/opt/nodejs/db_access');

exports.handler = async (event) => {
  // TODO implement
  var pool = mysql.createPool({
    host: db_access.config.host,
    user: db_access.config.user,
    password: db_access.config.password,
    database: db_access.config.database
  });
  
  let ValidateExists = (password) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT * FROM Admins WHERE adminCredentials=?", [password], (error, rows) =>{
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
  
  let getShowID = (startTime, venueName) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT showID FROM Shows WHERE startTime=? AND venueName = ?", [startTime, venueName], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        if((rows) && rows.length == 1){
          return resolve(rows[0].showID);
        }
        else{
          return resolve(false);
        }
      });
    });
  };
  
  let deleteBlocks = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM Blocks WHERE showID=?;", [showID], (error, rows) => {
        if (error) {return reject(error);}
        resolve(true)
      });
    });
  };
  
  let deleteSeats = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM Seats WHERE `show`=?;", [showID], (error, rows) => {
        if (error) {return reject(error);}
        resolve(true)
      });
    });
  };
  
  let deleteShow = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM Shows WHERE showID=?;", [showID], (error, rows) => {
        if (error) {return reject(error);}
        if((rows) && (rows.affectedRows == 1)){
          return resolve(true);
        }
        else{
          return resolve(false);
        }
      });
    });
  };
  
  let response = undefined;
  try{
    const passwordAccepted = await ValidateExists(event.password);
    if(passwordAccepted){
      
      let showID = await getShowID(event.startTime, event.name);
      if (showID!=false) {
        console.log(showID)
        let deleteSeatsSuccess = await deleteSeats(showID);
        let deleteBlocksSuccess = await deleteBlocks(showID); //we try and delete blocks even if they aren't using blocks
        let deleteShowSuccess = await deleteShow(showID);
      
        response = {
          statusCode: 200,
          success: event.title //returning show name when correctly deleted
        };
      } else if (showID==false) {
        response = {
          statusCode: 400,
          error:"invalid show time or venue Name were given."
        };
      }
    }
    else{
      response = {
        statusCode: 400,
        error:"invalid admin password given."
      };
    }
  }
  catch(err){
    response = {
      statusCode: 400,
      error:err
    };
  }
  finally{
    pool.end();
  }
  return response;
};
