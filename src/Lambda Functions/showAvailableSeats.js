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
  
  let getShow = (venueName, startTime) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT * FROM Shows WHERE venueName=? AND startTime = ?", [venueName, startTime], (error, rows) =>{
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
  
  let getVenue = (venueName) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT leftSection, centerSection, rightSection, s1.numColumns leftColumns, s1.numRows leftRows, s2.numColumns centerColumns, s2.numRows centerRows, s3.numColumns rightColumns, s3.numRows rightRows FROM Venues JOIN Sections s2 ON Venues.centerSection = s2.sectionID JOIN Sections s1 ON Venues.leftSection = s1.sectionID JOIN Sections s3 ON Venues.rightSection = s3.sectionID WHERE venueName = ?;", [venueName], (error, rows) => {
        if (error) {return reject(error);}
        return resolve(rows[0]);
      });
    });
  }
  
  let getBlocks = (showID) =>{
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Blocks WHERE showID = ?;", [showID], (error, rows) => {
        if (error) {return reject(error);}
        return resolve(rows);
      });
    });
  }
  
  let getAvailableSeats = (showID) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT `row`, `column`, isAvailable, section, block FROM Seats WHERE `show`=?;", [showID], (error, rows) => {
        if (error) {return reject(error);}
        return resolve(rows)
      });
    });
  }
  
  let response = undefined
  try{
    let show = await getShow(event.venueName, event.startTime)
    let blocks = await getBlocks(show.showID)
    if(show != false){
      console.log(show)
      let venue = await getVenue(event.venueName)
      let seats = await getAvailableSeats(show.showID)
      for(let seat of seats){
        if(seat.section == venue.leftSection){
          seat.section = "leftSection"
        }
        else if(seat.section == venue.centerSection){
          seat.section = "centerSection"
        }
        else if(seat.section == venue.rightSection){
          seat.section = "rightSection"
        }
      }
      
      response = {
        statusCode: 200,
        success:seats,
        show: show,
        blocks: blocks,
        venue:venue
      }
    }
    else{
      response = {
        statusCode: 400,
        error:"invalid show"
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
