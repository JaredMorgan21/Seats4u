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
  
  let ValidateExists = (name) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT venueCredentials FROM Venues WHERE venueName=?", [name], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        if((rows) && rows.length == 1){
          return resolve(rows[0].venueCredentials);
        }
        else{
          return resolve(false);
        }
      });
    });
  };
  
  
  let leftSectionfk = (name) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT leftSection FROM Venues WHERE venueName=?", [name], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        if((rows) && rows.length == 1){
          return resolve(rows[0].leftSection);
        }
        else{
          return resolve(false);
        }
      });
    });
  };
  
  
  let centerSectionfk = (name) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT centerSection FROM Venues WHERE venueName=?", [name], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        if((rows) && rows.length == 1){
          return resolve(rows[0].centerSection);
        }
        else{
          return resolve(false);
        }
      });
    });
  };
  
  
  let rightSectionfk = (name) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT rightSection FROM Venues WHERE venueName=?", [name], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        if((rows) && rows.length == 1){
          return resolve(rows[0].rightSection);
        }
        else{
          return resolve(false);
        }
      });
    });
  };
  
  
  
  let DeleteSection = (sectionID) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM Sections WHERE sectionID=?;", [sectionID], (error, rows) => {
        if (error) {return reject(error);}
        if((rows) && (rows.affectedRows == 1)){
          return resolve(sectionID);
        }
        else{
          return resolve(false);
        }
      });
    });
  };
  
  
  
  
  let DeleteVenue = (name, password) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM Venues WHERE venueName=?;", [name], (error, rows) => {
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
  
  let response = undefined;
  const passwordFound = await ValidateExists(event.name);
  console.log(passwordFound);
  if(passwordFound == event.password){
    try{
      //delete sections first
      
      //get each fk reference then delete in Venues then sections
      const leftFK = await  leftSectionfk(event.name);
      const centerFK = await  centerSectionfk(event.name);
      const rightFK = await  rightSectionfk(event.name);
      
      console.log(leftFK);
      console.log(centerFK);
      console.log(rightFK);
      
      
      
      //delete the Venue now
      const result = await DeleteVenue(event.name, event.password);
      //delete in Sections
      const section1 = await DeleteSection(leftFK);
      const section2 = await DeleteSection(centerFK);
      const section3 = await DeleteSection(rightFK);
      
      response = {
        statusCode: 200,
        success: result
      };
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
