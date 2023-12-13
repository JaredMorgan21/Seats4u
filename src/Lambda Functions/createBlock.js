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
  
  let ValidateExists = (name, password) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT * FROM Venues WHERE venueName = ? AND venueCredentials=?", [name, password], (error, rows) =>{
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
  
  let ValidateShow = (startTime, venueName) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT showID FROM Shows WHERE startTime=? AND venueName = ? AND usesBlocks=1", [startTime, venueName], (error, rows) =>{
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
  
  let getVenues = (venueName) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT s1.numColumns leftColumns, s1.numRows leftRows, s2.numColumns centerColumns, s2.numRows centerRows, s3.numColumns rightColumns, s3.numRows rightRows FROM Venues JOIN Sections s2 ON Venues.centerSection = s2.sectionID JOIN Sections s1 ON Venues.leftSection = s1.sectionID JOIN Sections s3 ON Venues.rightSection = s3.sectionID WHERE venueName = ?;", [venueName], (error, rows) => {
        if (error) {return reject(error);}
        return resolve(rows[0]);
      });
    });
  }
  
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
  
  let checkValidBlock = (section, startRow, endRow, showID) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Blocks WHERE section = ? AND showID = ? AND ((startRow <= ? AND endRow >=?) OR (startRow <= ? AND endRow >=?));", [section, showID, startRow, startRow, endRow, endRow], (error, rows) => {
        if (error) {return reject(error);}
        console.log(rows)
        if((rows) && (rows.length == 1)){
          return resolve(false);
        }
        else{
          return resolve(true);
        }
      });
    });
  }
  
  let createBlocks = (price, section, startRow, endRow, showID) => {
    return new Promise((resolve, reject) => {
      pool.query("INSERT INTO Blocks Values(?, ?, ?, ?, ?, ?);", [0, price, section, startRow, endRow, showID], (error, rows) => {
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
  
  let getID = (section, startRow, showID) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT blockID FROM Blocks WHERE section =? AND startRow =? AND showID =?", [section, startRow, showID], (error, rows) => {
        console.log(rows)
        if (error) {return reject(error);}
        if((rows) && (rows.length == 1)){
          return resolve(rows[0].blockID);
        }
        else{
          return resolve(false);
        }
      });
    })
  }
  
  let updateSeats = (seats, blockID) => {
    return new Promise((resolve, reject) => {
      pool.query("UPDATE Seats SET block = ? WHERE (`column`, `row`, `show`, section) IN(?)", [blockID, seats], (error, rows) => {
        if (error) {return reject(error);}
        if((rows)){
          return resolve(true);
        }
        else{
          return resolve(false);
        }
      });
    })
  }
  
  let response = undefined;
  const passwordAccepted = await ValidateExists(event.venueName, event.password);
  if(passwordAccepted){
    try{
      let showID = await ValidateShow(event.startTime, event.venueName);
      let sectionID = await getSection(event.venueName, event.section);
      let validBlock = await checkValidBlock(sectionID, event.startRow, event.endRow, showID); //letters can check using <=> apparently
      //added in this if statement so that if we don't get proper sectionID and showID it won't try and add it in
      if (showID!==false && sectionID!==false && validBlock){
        
        let block = await createBlocks(event.price, sectionID, event.startRow, event.endRow, showID);
        let blockID = await getID(sectionID, event.startRow, showID);
        const venue = await getVenues(event.venueName);
      

        let cols = 0;
        if(event.section == "leftSection"){
          cols = venue.leftColumns;
        }
        else if(event.section == "centerSection"){
          cols = venue.centerColumns;
        }
        else if(event.section == "rightSection"){
          cols = venue.rightColumns;
        }
        
        let seats = [];
        for (let i = 0; i < cols; i++){
          for (let j = event.startRow.charCodeAt(0)-65; j <= event.endRow.charCodeAt(0)-65; j++){
            seats.push([i+1, String.fromCharCode(65 + j), showID, sectionID]);
          }
        }
        console.log(seats);
        console.log(cols);
        let updatedSeats = await updateSeats(seats, blockID);
        
        response = {
          statusCode: 200,
          success: blockID
        };
      }
      else if(!validBlock){
          response = {
            statusCode: 400,
            error:"invalid block"
          };
      }
      else if (showID==false && sectionID==false) {
          response = {
            statusCode: 400,
            error:"invalid showID and sectionID meaning something was wrong with information given"
          };
        }else if (showID==false) {
          response = {
            statusCode: 400,
            error:"invalid showID meaning something was wrong with information give. Could be startTime."
          };
        } else if (sectionID==false) {
          response = {
            statusCode: 400,
            error:"invalid sectionID meaning something was wrong with information given. Meaning invalid section name was given"
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
  }
  else{
    response = {
      statusCode: 400,
      error:"invalid password"
    };
  }
  return response;
};
