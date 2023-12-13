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
  
  let getShow = (startTime, venueName) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT * FROM Shows WHERE startTime=? AND venueName = ?", [startTime, venueName], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows)
        if((rows) && rows.length == 1){
          return resolve(rows[0]);
        }
        else{
          return resolve(false)
        }
      });
    });
  }
  
  let ActivateShow = (title, startTime, name) => {
    return new Promise((resolve, reject) => {
      pool.query("UPDATE Shows SET isActive = 1 WHERE title = ? AND startTime= ? AND venueName = ?", [title, startTime, name], (error, rows) => {
        if (error) {return reject(error);}
        if((rows) && (rows.affectedRows == 1)){
          return resolve(true);
        }
        else{
          return resolve(false);
        }
      });
    });
  }
  
  let checkSeats = (showID) =>{
    return new Promise((resolve, reject) =>{
      pool.query("SELECT * FROM Seats WHERE `show` = ?", [showID], (error, rows) =>{
        if(error){return reject(error);}
        return resolve(rows);
      });
    });
  }
  
  let response = undefined
  try{
    const passwordAccepted = await ValidateExists(event.name, event.password)
    if(passwordAccepted){
      let show = await getShow(event.startTime, event.name)
      let showID = show.showID
      
      if(show.usesBlocks){
        
        let seats = await checkSeats(showID);
        let blocksActivated = true
        for(let seat of seats){
          if(seat.block == null){
            blocksActivated = false
          }
        }
        if(blocksActivated){
          const result = await ActivateShow(event.title, event.startTime, event.name)
          
          response = {
            statusCode: 200,
            success: event.title // returning show name when show activates
          };
        }
        else{
          response = {
            statusCode: 400,
            error: "Error: Some seats are unblocked" // returning show name when show activates
          };
        }
      }
      else{
        const result = await ActivateShow(event.title, event.startTime, event.name)
        
        response = {
          statusCode: 200,
          success: event.title // returning show name when show activates
        };
      }
    }
    else{
      response = {
        statusCode: 400,
        error:"invalid password"
      }
    }
  }
  catch(err){
    response = {
      statusCode: 400,
      error:err
    }
  }
  return response;
};
