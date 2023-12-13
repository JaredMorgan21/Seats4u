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
  
  let validateVenue = (venueName) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT leftSection, centerSection, rightSection FROM Venues WHERE venueName=?", [venueName], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        if((rows) && rows.length == 1){ //if there is an instance of it then it's true
          return resolve(rows[0]);
        }
        else{
          return resolve(false);
        }
      });
    });
  };
  
  let validateShow = (startTime, venueName) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT * FROM Shows WHERE startTime=? AND venueName = ?", [startTime, venueName], (error, rows) =>{
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
  
  let checkValidSeats = (seats) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT * FROM Seats WHERE (`column`, `row`, `show`, section, isAvailable) IN(?)", [seats], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        if(rows.length == seats.length){
          return resolve(true);
        }
        else{
          return resolve(rows);
        }
      });
    });
  };
  
  let getInvalidSeats = (seats) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT * FROM Seats WHERE (`column`, `row`, `show`, section, isAvailable) IN(?)", [seats], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        return resolve(rows)
      });
    });
  };
  
  let purchaseSeats = (seats) => {
    return new Promise((resolve, reject) =>{
      pool.query("UPDATE Seats SET isAvailable = 0 WHERE (`column`, `row`, `show`, section, isAvailable) IN(?)", [seats], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        console.log("LOOK HERE", rows.affectedRows, seats.length)
        if(rows.affectedRows == seats.length){
          return resolve(true);
        }
        else{
          return resolve(false);
        }
      });
    });
  };
  
  let getBlocks = (blocks) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT block FROM Seats WHERE (`column`, `row`, `show`, section) IN(?)", [blocks], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        if((rows)){
          return resolve(rows);
        }
        else{
          return resolve(false);
        }
      });
    });
  };
  
  let getBlockPrices = (blockIDs) => {
    return new Promise((resolve, reject) =>{
      pool.query("SELECT price, blockID FROM Blocks WHERE blockID IN (?)", [blockIDs], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        if((rows)){
          return resolve(rows);
        }
        else{
          return resolve(false);
        }
      });
    });
  };
  
  let processPayment = (price, ticketsSold, venueName, startTime) => {
    console.log(price, ticketsSold);
    return new Promise((resolve, reject) =>{
      pool.query("UPDATE Shows SET totalRevenue = ?, ticketsSold = ? WHERE venueName = ? AND startTime = ?", [price, ticketsSold, venueName, startTime], (error, rows) =>{
        if(error){return reject(error);}
        console.log(rows);
        if((rows) && rows.affectedRows == 1){
          return resolve(rows[0]);
        }
        else{
          return resolve(false);
        }
      });
    });
  };
  
  let response = undefined;
  try{
    const sectionIDs = await validateVenue(event.venue);
    if (sectionIDs != false ) { //meaning the correct venue name was given
      let leftID = sectionIDs.leftSection;
      let centerID = sectionIDs.centerSection;
      let rightID = sectionIDs.rightSection;
    
      let show = await validateShow(event.startTime, event.venue);
      let validSeats = false;
      let invalidSeats = [];
      if (show != false) { //meaning the startTime and venue Name were given
        let showID = show.showID;
        let usesBlocks = show.usesBlocks;
        console.log("uses blocks: ", usesBlocks);
        if(usesBlocks){
          let blocks = [];
          let seats = [];
      
          for(let seat of event.seats){
            let id = 0;
            if(seat.section == "leftSection"){
              id = sectionIDs.leftSection;
            }
            else if(seat.section == "centerSection"){
              id = sectionIDs.centerSection;
            }
            else if(seat.section == "rightSection"){
              id = sectionIDs.rightSection;
            }
            seats.push([seat.column, seat.row, showID, id, 1]);
            blocks.push([seat.column, seat.row, showID, id]);
          }
          
          validSeats = await checkValidSeats(seats);
          if(validSeats == true){
            let purchasedSeats = await purchaseSeats(seats);
            console.log("purchase: ", purchaseSeats);
            let blockIDs = await getBlocks(blocks);
            console.log("block IDs", blockIDs);
        
            let ids = [];
            for(let id of blockIDs){
              ids.push([id.block]);
            }
            console.log("ids: ", ids);
            let blockPrices = await getBlockPrices(ids);
        
            let blockSum = 0;
            for(let bp of blockPrices){
              for(let id of ids){
                if(id == bp.blockID){
                  blockSum += bp.price
                }
              }
            }
        
            console.log('pre-revenue: ', show.totalRevenue);
            console.log('tickets sold: ', show.ticketsSold);
            console.log('seats length: ', event.seats.length);
            console.log('block sum: ', blockPrices);
            let updatedShow = await processPayment(show.totalRevenue + blockSum, show.ticketsSold + event.seats.length, event.venue, event.startTime);
          }
          else{
            for(let seat of seats){
              seat[4] = 0;
            }
            
            invalidSeats = await getInvalidSeats(seats)
          }
        }
        else{
          let seats = [];
          for(let seat of event.seats){
            let id = 0;
            if(seat.section == "leftSection"){
              id = sectionIDs.leftSection;
            }
            else if(seat.section == "centerSection"){
               id = sectionIDs.centerSection;
            }
            else if(seat.section == "rightSection"){
              id = sectionIDs.rightSection;
            }
            seats.push([seat.column, seat.row, showID, id, 1]);
          }
          
          validSeats = await checkValidSeats(seats);
          if(validSeats == true){
            let purchasedSeats = await purchaseSeats(seats);
            console.log('pre-revenue: ', show.totalRevenue);
            console.log('tickets sold: ', show.ticketsSold);
            console.log('seats length: ', event.seats.length);
            console.log('optional price: ', show.optPrice);
            let updatedShow = await processPayment(show.totalRevenue + event.seats.length*show.optPrice, show.ticketsSold + event.seats.length, event.venue, event.startTime);
          }
          else{
            for(let seat of seats){
              seat[4] = 0;
            }
            
            invalidSeats = await getInvalidSeats(seats)
          }
        }
        if(validSeats == true){
          response = {
            statusCode: 200,
            success: event.seats
          };
        }
        else{
          for(let seat of invalidSeats){
            if(seat.section == sectionIDs.leftSection){
              seat.section = "leftSection"
            }
            else if(seat.section == sectionIDs.centerSection){
              seat.section = "centerSection"
            }
            else if(seat.section == sectionIDs.rightSection){
              seat.section = "rightSection"
            }
          }
          response = {
            statusCode: 400,
            invalidSeats: invalidSeats
          };
        }
      } else if (show==false) {
        response = {statusCode: 400, error: "A shows startTime or venue was incorrect."};
      }
    } else if (sectionIDs==false) {
      response = {statusCode: 400, error: "A invalid venue name was given"};
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
