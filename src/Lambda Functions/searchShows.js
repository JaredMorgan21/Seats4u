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
  
  let searchShows = (title) => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT title, startTime, endTime, venueName FROM Shows WHERE title LIKE ? AND isActive = 1 ORDER BY startTime DESC;", ['%' + title + '%'], (error, rows) => {
        if (error) {return reject(error);}
        return resolve(rows)
      });
    });
  }
  
  let response = undefined
  try{
    const shows = await searchShows(event.title)

    response = {
      statusCode: 200,
      success: shows
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
  return response;
};
