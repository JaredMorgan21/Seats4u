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
  
  let ValidateExists = (name, password) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT * FROM Venues WHERE venueName = ? AND venueCredentials=?", [name, password], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows)
        if((rows) && rows.length == 1){
          return resolve(true);
        }
        else{
          return resolve(false)
        }
      });
    });
  }
  
  let getShows = (name) => {
      return new Promise((resolve, reject) =>{
      pool.query("SELECT title, startTime, endTime, isActive, usesBlocks, ticketsSold, totalRevenue FROM Shows WHERE venueName=?;", [name], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows)
        return resolve(rows)
      });
    });
  }
  
  let response = undefined
  try{
    const passwordAccepted = await ValidateExists(event.name, event.password)
    if(passwordAccepted){
      const result = await getShows(event.name)
      
      response = {
        statusCode: 200,
        success: result
      };
    }
    else{
      response = {
        statusCode: 400,
        error:"invalid password or invalid venue name"
      }
    }
  }
  catch(err){
    response = {
      statusCode: 400,
      error:err
    }
  }
  finally{
    pool.end()
  }
  return response;
};
