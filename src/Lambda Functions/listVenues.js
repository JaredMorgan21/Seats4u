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
  
  let ValidatePassword = (password) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT * FROM Admins WHERE adminCredentials=?", [password], (error, rows) =>{
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
  
  let getVenues = () => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT venueName, s1.numColumns leftColumns, s1.numRows leftRows, s2.numColumns centerColumns, s2.numRows centerRows, s3.numColumns rightColumns, s3.numRows rightRows FROM Venues JOIN Sections s2 ON Venues.centerSection = s2.sectionID JOIN Sections s1 ON Venues.leftSection = s1.sectionID JOIN Sections s3 ON Venues.rightSection = s3.sectionID;", [], (error, rows) => {
        if (error) {return reject(error);}
        return resolve(rows);
      });
    });
  }
  
  let getShows = (name) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT title, startTime, venueName FROM Shows WHERE venueName = ?", [name], (error, rows) =>{
        if (error) {return reject(error);}
        return resolve(rows);
      });
    });
  }
  
  let response = undefined
  const passwordAccepted = await ValidatePassword(event.password)
  if(passwordAccepted){
  try{
      let venues = await getVenues()
      let shows = []
      for (let venue of venues){
        console.log(venue)
        let addShows = await getShows(venue.venueName)
        shows.push(addShows)
      }
      console.log(shows)
      response = {
        statusCode: 200,
        venues: venues,
        shows: shows
      };
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
  }
  else{
      response = {
        statusCode: 400,
        error: "invalid password"
      }
  }
  return response;
};
