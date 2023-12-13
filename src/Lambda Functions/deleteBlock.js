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
  //needed venueName, venueCredentials, startTime, block information startRow, endRow, section--string
  
  let ValidateExists = (venueName, venueCredentials) => {
    console.log(venueName, venueCredentials);
    return new Promise((resolve, reject) =>{
      pool.query("SELECT * FROM Venues WHERE venueName=? AND venueCredentials =?", [venueName,venueCredentials], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        if((rows) && rows.length == 1){ //if there is an instance of it then it's true
          return resolve(true);
        }
        else{
          return resolve(false);
        }
      });
    });
  };
 //everything else is unfinished
 
 let ValidateShow = (startTime, venueName) => {
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
  
 let getSection = (venueName, section) => {
    return new Promise((resolve, reject) =>{
      if(section == 'leftSection'){
        pool.query("SELECT leftSection FROM Venues WHERE venueName = ?", [venueName], (error, rows) =>{
          if(error){return reject(error);}
          console.log(rows);
          if((rows) && rows.length == 1){
            return resolve(rows[0].leftSection);
          }
          else{
            return resolve(false);
          }
        });
      }
      else if(section == 'centerSection'){
        pool.query("SELECT centerSection FROM Venues WHERE venueName = ?", [venueName], (error, rows) =>{
          if(error){return reject(error);}
          console.log(rows);
          if((rows) && rows.length == 1){
            return resolve(rows[0].centerSection);
          }
          else{
            return resolve(false);
          }
        });
      }
      else if(section == 'rightSection'){
        pool.query("SELECT rightSection FROM Venues WHERE venueName = ?", [venueName], (error, rows) =>{
          if(error){return reject(error);}
          console.log(rows);
          if((rows) && rows.length == 1){
            return resolve(rows[0].rightSection);
          }
          else{
            return resolve(false);
          }
        });
      }
      else{
        return resolve(false);
      }
    });
  };
  
let ValidateBlockExists = (section, startRow,endRow,showID) => {
    return new Promise((resolve, reject) =>{ //price isn't needed technically 
      pool.query("SELECT blockID FROM Blocks WHERE section =? AND startRow=? AND endRow=? AND showID=?", [section,startRow,endRow,showID], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        if((rows)){ //if there is an instance of it then it's true
          return resolve(rows[0].blockID);
        }
        else{
          return resolve(false);
        }
      });
    });
  };
  
  let DeleteBlock = (blockID) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM Blocks WHERE blockID = ?;", [blockID], (error, rows) => {
        if (error) {return reject(error);}
        if((rows) && (rows.affectedRows == 1)){
          return resolve(blockID);
        }
        else{
          return resolve(false);
        }
      });
    });
  };
  
  let updateSeats = (blockID) => {
    return new Promise((resolve, reject) => {
      pool.query("UPDATE Seats SET block = null WHERE block = ?", [blockID], (error, rows) => {
        if (error) {return reject(error);}
        if((rows)){
          return resolve(true);
        }
        else{
          return resolve(false);
        }
      });
    });
  };

  let response = undefined;
  const venueExistsAndPassword = await ValidateExists(event.venueName, event.password); //validating the venue exists with the correct credentials
  
  if (venueExistsAndPassword) { //that we double check other things next
    let showID = await ValidateShow(event.startTime, event.venueName);
    let sectionID = await getSection(event.venueName, event.section);
    console.log(showID, sectionID);
    if (showID!=false && sectionID!=false) {
      console.log(sectionID, event.startRow, event.endRow, showID)
      const blockID = await ValidateBlockExists(sectionID, event.startRow, event.endRow, showID);
      console.log(blockID);
        if (blockID != false) {
          let seatsCleared = await updateSeats(blockID);
          let blockDeleted = await DeleteBlock(blockID);
          
          response = {statusCode: 200, success: blockDeleted};
        } else {
          response = {
            statusCode: 400,
            error:"Can't delete a block not in the table"
          };
        }
    }else if (showID==false) {
      response = {
        statusCode: 400,
        error:"invalid showID meaning something was wrong with information give. Could be startTime."
      };
    } else if (sectionID==false) {
      response = {
        statusCode: 400,
        error:"invalid sectionID meaning something was wrong with information given. Most likely meaning invalid section name was given"
      };
    }
  } else{
    response = {statusCode: 400,error: "invalid password"}; 
  }
return response;
};