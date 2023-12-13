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
  
  let ValidateExists = (venueName, venueCredentials) => {
    console.log(venueName, venueCredentials)
    return new Promise((resolve, reject) =>{
      pool.query("SELECT * FROM Venues WHERE venueName=? AND venueCredentials =?", [venueName,venueCredentials], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows)
        if((rows) && rows.length == 1){ //if there is an instance of it then it's true
          return resolve(true);
        }
        else{
          return resolve(false)
        }
      });
    });
  }

  let validTime = (venueName, startTime, endTime) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT * FROM Shows WHERE venueName=? AND ((startTime <= ? AND endTime >= ?) OR (startTime <= ? AND endTime >=?))", [venueName, startTime, startTime, endTime, endTime], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows)
        if((rows) && rows.length == 1){ //if there is an instance of it then there is a conflicting time in Shows
          return resolve(false);// meaning not valid time work
        }
        else{
          return resolve(endTime > startTime) 
        }
      });
    });
  }

  let CreateShow = (title, startTime, endTime, usesBlocks,venueName, optPrice) => {
    return new Promise((resolve, reject) =>{
      //showID, title, startTime,endTime, isActive, usesBlocks, venueName
      pool.query("INSERT INTO Shows VALUES(?,?,?,?,?,?,?,?,?,?)", [0, title, startTime, endTime, 0, usesBlocks,venueName, 0, 0, optPrice], (error, rows) =>{
        if (error) {return reject(error);}
        if((rows) && (rows.affectedRows == 1)){
          return resolve(rows);
        }
        else{
          return resolve(false);
        }
      });
    });
  }
  
  let getShowID = (startTime, venueName) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT showID FROM Shows WHERE startTime=? AND venueName = ?", [startTime, venueName], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows)
        if((rows) && rows.length == 1){
          return resolve(rows[0].showID);
        }
        else{
          return resolve(false)
        }
      });
    });
  }
  
  let CreateSeats = (seats) => {
    return new Promise((resolve, reject) =>{
      pool.query("INSERT INTO Seats VALUES ?", [seats], (error, rows) =>{
        if(error){return reject(error);}
        return resolve(true);
      });
    });
  }
  
  let getVenues = (venueName) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT leftSection, centerSection, rightSection, s1.numColumns leftColumns, s1.numRows leftRows, s2.numColumns centerColumns, s2.numRows centerRows, s3.numColumns rightColumns, s3.numRows rightRows FROM Venues JOIN Sections s2 ON Venues.centerSection = s2.sectionID JOIN Sections s1 ON Venues.leftSection = s1.sectionID JOIN Sections s3 ON Venues.rightSection = s3.sectionID WHERE venueName = ?;", [venueName], (error, rows) => {
        if (error) {return reject(error);}
        return resolve(rows[0]);
      });
    });
  }

  let response = undefined
  const venueExistsAndPassword = await ValidateExists(event.venueName, event.password) //validating the venue exists with the correct credentials
  const validTiming = await validTime(event.venueName,event.startTime,event.endTime)
  const startBeforeEnd = event.startTime < event.endTime; //double checking start is before end 
  if (venueExistsAndPassword && validTiming && startBeforeEnd) { //that we can create show  && validTiming && gave us valid timing
    console.log(event.optPrice)
    let createShowResult = await CreateShow(event.title, event.startTime, event.endTime, event.usesBlocks, event.venueName, event.optPrice)
    let showID = await getShowID(event.startTime, event.venueName)
    let venue = await getVenues(event.venueName)

    let leftCols = venue.leftColumns
    let leftRows = venue.leftRows
    let centerCols = venue.centerColumns
    let centerRows = venue.centerRows
    let rightCols = venue.rightColumns
    let rightRows = venue.rightRows
    
    let leftID = venue.leftSection
    let centerID = venue.centerSection
    let rightID = venue.rightSection

    console.log("venue: ", venue)
    console.log("showID: ", showID)
    console.log("leftCols: ", leftCols)
    console.log("leftRows: ", leftRows)
    console.log("centerCols: ", leftCols)
    console.log("centerRows: ", leftRows)
    console.log("rightCols: ", leftCols)
    console.log("rightRows: ", leftRows)
    console.log("leftID: ", leftID)
    console.log("centerID: ", centerID)
    console.log("rightID: ", rightID)
    
    let seats = []
    for (let i = 0; i < leftRows; i++){
      for (let j = 0; j < leftCols; j++){
        seats.push([0, 1, j+1, String.fromCharCode(65 + i), null, showID, leftID])
      }
    }
    let leftSeats = await CreateSeats(seats)
    
    seats = []
    for (let i = 0; i < centerRows; i++){
      for (let j = 0; j < centerCols; j++){
        seats.push([0, 1, j+1, String.fromCharCode(65 + i), null, showID, centerID])
      }
    }
    let centerSeats = await CreateSeats(seats)
    
    seats = []
    for (let i = 0; i < rightRows; i++){
      for (let j = 0; j < rightCols; j++){
        seats.push([0, 1, j+1, String.fromCharCode(65 + i), null, showID, rightID])
      }
    }
    let rightSeats = await CreateSeats(seats)
  
    response = {statusCode: 200, success: event.title};
  }  else if (venueExistsAndPassword == false) {
    response = {statusCode: 400, error: "A invalid password to a venue has been given or an incorrect venueName."}
  } else if (validTiming ==false) {
    response = {statusCode: 400, error: "A invalid timing to a show has been given."}
  }
  else{
    response = {statusCode: 400, error: false}; 
  } 
  return response;
};