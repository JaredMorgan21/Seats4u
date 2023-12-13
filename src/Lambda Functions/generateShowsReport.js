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
  
  let validatePassword = (password) => {
    return new Promise((resolve, reject) =>{ //changed this
      pool.query("SELECT * FROM Admins WHERE adminCredentials=?", [password], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        if((rows&& rows.length == 1)){
          return resolve(true);
        }
        else{
          return resolve(false);
        }
      });
    });
  };
  
  let getShows = () => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT * FROM Shows", [], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        return resolve(rows);
      });
    });
  };
  
  let getSeats = (showIDs) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT * FROM Seats WHERE (`show`) IN(?)", [showIDs], (error, rows) =>{
        if(error){return reject(error);}
        return resolve(rows);
      });
    });
  };
  
  let response = undefined;
  try{
    const passwordAccepted = await validatePassword(event.password);
    if(passwordAccepted){
      let shows = await getShows();
      
      let totalRevenue = 0;
      let totalTicketsSold = 0;
      let returnString = "<table>";
      
      let ids = [];
      for(let show of shows){
        ids.push([show.showID]);
      }
      
      let seats = await getSeats(ids);

      let totalSeats = [];
      for(let show of shows){
        
        let numSeats = 0;
        for(let seat of seats){
          if(seat.show == show.showID){
            numSeats++;
          }
        }
        totalSeats.push(numSeats);
      }
      
      for(let i = 0; i < shows.length; i++){
        shows[i].totalSeats = totalSeats[i];
      }
      console.log(totalSeats);
      console.log(shows);
      
      for(let show of shows){ //believe we need seats sold and seats remaining for this
        totalRevenue += show.totalRevenue;
        totalTicketsSold += show.ticketsSold;
        //need to get the amount of seats sold and remaining
        
        returnString += "<tr> <td>" + show.title + '</td><td>' + show.startTime + '</td><td>' + (show.isActive ? "active" : "inactive") + '</td><td>' + show.venueName + '</td><td>' + show.ticketsSold+'/'+show.totalSeats + '</td><td>' + show.totalRevenue + '</td></tr>';
      }
      
      returnString += "</table>"
      returnString += 'Total revenue: ' + totalRevenue + ' Total tickets sold: ' + totalTicketsSold;//adding in the totalRevene and totalTicketsSold
      returnString = returnString.replaceAll('GMT+0000 (Coordinated Universal Time)','');
      console.log(returnString);
      response = {
        statusCode: 200,
        success: returnString
      };
    }
    else{
      response = {
        statusCode: 400,
        error: "invalid password"
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
