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
        console.log(rows);
        if((rows) && rows.length == 1){
          return resolve(rows[0]);
        }
        else{
          return resolve(false);
        }
      });
    });
  };

  let showID = (startTime, venueName) => {
    return new Promise((resolve, reject) =>{
    pool.query("SELECT showID FROM Shows WHERE startTime=? AND venueName=? ;", [startTime,venueName], (error, rows) =>{
      if(error){return reject(error);}
      console.log(rows);
      if((rows) && rows.length == 1){
        return resolve(rows[0].showID);//return showID
      }
      else{
        return resolve(false);
      }
    });
  });
};
 let usingBlocks = (startTime, venueName) => {
    return new Promise((resolve, reject) =>{
    pool.query("SELECT usesBlocks FROM Shows WHERE startTime=? AND venueName=? ;", [startTime,venueName], (error, rows) =>{
      if(error){return reject(error);}
      console.log(rows);
      if((rows) && rows.length == 1){
        return resolve(rows[0].usesBlocks); //return usesBlocks
      }
      else{
        return resolve(false);
      }
    });
  });
};
  
  let getBlocks = (showID) => {
      return new Promise((resolve, reject) =>{
      pool.query("SELECT blockID, price, section, startRow, endRow, showID FROM Blocks WHERE showID=?;", [showID], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        return resolve(rows);
      });
    });
  };
  let response = undefined;
  response = "hiiii"; //testing purposees
  try{
    const venue = await ValidateExists(event.name, event.password);
    if(venue!= false){ //correct password
      const blocksBeingUsed = await usingBlocks(event.startTime, event.name);
      const ID = await showID(event.startTime, event.name);
      //response = {blocksBeingUsed, ID};
      console.log(blocksBeingUsed, ID);
      if (ID!= false && (blocksBeingUsed ==1)) {
        const result = await getBlocks(ID);
        console.log(result)
        console.log(venue)
        console.log(result[0].section, venue.leftSection, venue.centerSection, venue.rightSection)
        
        for(let r of result){
          if(r.section == venue.leftSection){
            r.section = "leftSection"
          }
          if(r.section == venue.centerSection){
            r.section = "centerSection"
          }
          if(r.section == venue.rightSection){
            r.section = "rightSection"
          }
        }
        //if (result =="") {
        //  response = {
        //  statusCode:400,
        //  error:"show doesn't have any blocks currently"
        //};
        //}  else {
          response = {
            statusCode: 200,
            success: result
          };
      //}
        
      } else if (ID==false) {
        response = {
          statusCode: 400,
          error:"invalid venueName of startTime"
        };
      } else if (blocksBeingUsed==0) {
        response = {
          statusCode: 400,
          error:"show not using blocks"
        };
      } else if (blocksBeingUsed==false) {
        response = {
          statusCode: 400,
          error:"show was not able to get the usesBlocks variable from the row for some reason"
        };
      }
    }
    else{
      response = {
        statusCode: 400,
        error:"invalid password"
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
