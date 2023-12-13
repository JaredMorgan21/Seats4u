const mysql = require('mysql');
const db_access  = require('/opt/nodejs/db_access');

exports.handler = async (event) => { //needed venueName, venueCredentials, startTime, block information startRow, endRow, price, section--string
  // TODO implement
  var pool = mysql.createPool({
    host: db_access.config.host,
    user: db_access.config.user,
    password: db_access.config.password,
    database: db_access.config.database
  });
  
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
  
  let getShows = (venueName) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT * FROM Shows WHERE venueName=?", [venueName], (error, rows) =>{
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
  const venueExistsAndPassword = await ValidateExists(event.name, event.venueCredentials); //validating the venue exists with the correct credentials
 
  if (venueExistsAndPassword) {
    
    let shows = await getShows(event.name);
  
    let totalRevenue = 0;
    let totalTicketsSold = 0;
    let returnString = "";
    
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
        
        returnString = returnString + show.title + ' ' + show.startTime + ' ' + (show.isActive ? "active" : "inactive") + ' ' + show.ticketsSold+'/'+show.totalSeats + ' ' + show.totalRevenue + ' </br>';
        
      }
      
      returnString = returnString + 'Total Revenue: ' + totalRevenue + ' Total Tickets Sold: ' + totalTicketsSold + '<br>';
      returnString = returnString.replaceAll('GMT+0000 (Coordinated Universal Time) ','');
      
      console.log(returnString);
      response = {
        statusCode: 200,
        success: returnString
      };
  }
  else{
    response = {statusCode: 400,success: "invalid password or venue name"}; 
}
return response;
};