import {post} from "./API"

//venue manager
export function createVenue(name, password, leftRows, leftCols, centerRows, centerCols, rightRows, rightCols){
    let data = {  "name": name,
                  "password" : password,
                  "leftRows" : leftRows,
                  "leftCols" : leftCols,
                  "centerRows" : centerRows,
                  "centerCols" : centerCols,
                  "rightRows" : rightRows,
                  "rightCols" : rightCols}

    const handler = (json) => {
        console.log(json)
        if(json.statusCode == 200){
            document.getElementById("result").innerHTML = "Venue created with name \'" + json.success + "\'"
        }
        else{
            document.getElementById("result").innerHTML = "Error: " + json.error
        }
    }

    post('/venue/create', data, handler)
}

export function createShow(venueName, password, title, startTime, endTime, usesBlocks){
    let data = {  "venueName": venueName,
                  "password" : password,
                  "title" : title,
                  "startTime" : startTime,
                  "endTime" : endTime,
                  "usesBlocks" : usesBlocks}

    const handler = (json) => {
        console.log(json)
        if(json.statusCode == 200){
            document.getElementById("resultShow").innerHTML = "Show created with name \'" + json.success + "\'"
        }
        else{
            document.getElementById("resultShow").innerHTML = "Error: " + json.error
        }
    }

    post('/show/create', data, handler)
}

//TODO something is wrong with this function (doesn't work locally)
export function createBlock(name, password, startTime, section, startRow, endRow, price) {
    let data = {  "name": name,
                  "password" : password,
                  "startTime" : startTime,
                  "section" : section,
                  "startRow" : startRow,
                  "endRow" : endRow,
                  "price" : price}

    const handler = (json) => {
        console.log(json)
        if(json.statusCode == 200){
            document.getElementById("createBlockResult").innerHTML = "The following blocks have been created: [insert blocks created here]" //TODO 
        }
        else{
            document.getElementById("createBlockResult").innerHTML = "Error: " + json.error
        }
    }

    post('/show/createBlock', data, handler)
}

export function deleteBlock() {

}

export function activateShow(name, password, title, startTime) {
    let data = {  "name": name,
                  "password" : password,
                  "title" : title,
                  "startTime" : startTime}
    
    const handler = (json) => {
        console.log(json)
        if(json.statusCode == 200) {
            document.getElementById("showActivateResult").innerHTML = "Show with name \'" + json.success + "\'" + " is now active"
        } else {
            document.getElementById("showActivateResult").innerHTML = "Error: " + json.error
        }
    }

    post('/show/activate', data, handler)

}

export function listShows(name, password) {
    let data = { "name": name,
                 "password" : password}

    const handler = (json) => {
        if(json.statusCode == 200){
            let shows = "<table> <tr><th>Title</th> <th>isActive</th> <th>startTime</th> <th>endTime</th> <th>usesBlocks</th> <th>ticketsSold</th> <th>totalRevenue</th></tr>"
            for(let s of json.success){
                s.startTime = s.startTime.replace(/T/g, " ").replace(/Z/g, " ")
                s.endTime = s.endTime.replace(/T/g, " ").replace(/Z/g, " ")
                shows += "<tr> <td>" + s.title + '</td><td>' + s.isActive + '</td><td>' + s.startTime + '</td><td>' + s.endTime + '</td><td>' + (s.usesBlocks ? "true" : "false") + '</td><td>' + s.ticketsSold + '</td><td>' + s.totalRevenue + '</tr>'
            }
            shows += "</table>"
            
            if(json.success.length == 0) {
                document.getElementById("showsList").innerHTML = "No shows currently exist for this venue"
            } else {
                document.getElementById("showsList").innerHTML = shows
            }
        }
        else{
            document.getElementById("showsList").innerHTML = "Error: " + json.error //want this instead of writing the errors here?
        }
    }

    post('/venue/listShows', data, handler)
}

export function generateReportVM(name, password) {
    let data = {"name" : name,
                "venueCredentials" : password}

    const handler = (json) => {
        console.log(json)
        if(json.statusCode == 200) {
            document.getElementById("showsReportVM").innerHTML = json.success 
        } else {
            document.getElementById("showsReportVM").innerHTML = "Error: " + json.error 
        }
    }

    post('/show/generateReportVM', data, handler)
    
}

export function deleteShow(name, password, title, startTime) {
    let data = {  "name": name,
                  "password" : password,
                  "title" : title,
                  "startTime" : startTime}

    const handler = (json) => {
        console.log(json)
        if(json.statusCode == 200) {
            document.getElementById("showDeleteResultVM").innerHTML = "Show deleted with name \'" + json.success + "\'"
        } else {
            document.getElementById("showDeleteResultVM").innerHTML = "Error: " + json.error
        }
    }

    post('/show/deleteVM', data, handler)

}


export function deleteVenue(name, venuePass){
    let data = {  "name": name,
                  "password" : venuePass}
    const handler = (json) => {
        console.log(json)
        if(json.statusCode == 200){
            document.getElementById("venueDeleteResult").innerHTML = "Venue deleted with name \'" + json.success + "\'"
        }
        else{
            document.getElementById("venueDeleteResult").innerHTML = "Error: " + json.error
        }
    }

    post('/venue/delete', data, handler)
}


//admin
export function listVenues(adminPass){
    let data = {"password" : adminPass}
    const handler = (json) => {
        console.log(json.success)
        if(json.statusCode == 200){
            let result = "Name, leftCols, leftRows, centerCols, centerRows, rightCols, rightRows <br>"
            for(let v of json.venues){
                result += v.venueName + ' ' + v.leftColumns + ' ' + v.leftRows + ' ' + v.centerColumns + ' ' + v.centerRows + ' ' + v.rightColumns + ' ' + v.rightRows + '<br>'
        
                //ARRAYS INSIDE OF ARRAYS AHHHHH
                for(let s of json.shows) {
                    for(let show of s) {
                        if (show.venueName === v.venueName) { //could probably optimize
                            show.startTime = show.startTime.replace(/T/g, " ")
                            show.startTime = show.startTime.replace(/Z/g, " ")
                            result += '-----' + show.title + ' ' + show.startTime + '<br>' 
                        }
                    }
                    
                }
            }
            
            document.getElementById("venuesList").innerHTML = result
        }
        else{
            document.getElementById("venuesList").innerHTML = "Error: " + json.error //TODO want this instead of writing the errors here?
        }
    }

    post('/venue/list', data, handler)
}

export function deleteShowAdmin(adminPass, name, title, startTime) {
    let data = {"password" : adminPass,
                "name" : name,
                "title" : title,
                "startTime" : startTime}
    
    const handler = (json) => {
        console.log(json)
        if(json.statusCode == 200) {
            document.getElementById("showDeleteResultA").innerHTML = "Show deleted with name \'" + json.success + "\'"
        } else {
            document.getElementById("showDeleteResultA").innerHTML = "Error: " + json.error
        }
    }

    post('/show/deleteAdmin', data, handler)
}

export function generateReportAdmin(adminPass) {
    let data  = {"password" : adminPass}

    const handler = (json) => {
        console.log(json)
        if(json.statusCode == 200) {
            document.getElementById("adminShowsReport").innerHTML = json.success 
        } else {
            document.getElementById("adminShowsReport").innerHTML = "Error: " + json.error 
        }
    }

    post('/show/generateReportAdmin', data, handler)
}


//consumer
export function searchShows(title) {
    let data = {"title" : title}
    const handler = (json) => {
        console.log(json.success)
        if(json.statusCode == 200) {
            let shows = "title, venue, date <br>"
            for(let s of json.success) {
                shows += s.title + ' ' + s.venueName + ' ' + s.startTime + '<br>'
            }

            if(json.success.length == 0) {
                document.getElementById("searchShowsList").innerHTML = "No shows match your search"
            } else { 
                //Fixing the formating , getting rid of those weird T and Z characters
                shows = shows.replace(/T/g, " ")
                shows = shows.replace(/Z/g, " ")
                document.getElementById("searchShowsList").innerHTML = shows
            }


        } else {
            document.getElementById("searchShowsList").innerHTML = "Error: " + json.error
        }
    }

    post('/show/search', data, handler) //this is where it talks to API?

}

export function listActiveShows() {
    searchShows("");
}

export function showAvailableSeats(name, startTime) {
    let data = {"venueName" : name,
                "startTime" : startTime}

    const handler = (json) => {
        console.log(json)
        console.log(name)
        console.log(startTime)
        if(json.statusCode == 200) {
            let seats = "row, column, section <br>"
            for(let s of json.success) {
                seats += s.row + ' ' + s.column + ' ' + s.section + '<br>'
            }

            let prevCol = "1";
            let prevSection = "leftSection";
            let display = "leftSection" + "<table> <tr><td> </td>"

            for(let i = 0; i < json.venue.leftRows; i++){
                display += "<th>" + String.fromCharCode(i + 0x41) + "</th>"
            }
            display += "</tr><tr><th>1</th>"

            for(let seat of json.success){
                if(seat.section != prevSection){
                    prevSection = seat.section
                    display += "</table> " + seat.section + "<table> <tr><td> </td>"

                    if(seat.section == "centerSection"){
                        for(let i = 0; i < json.venue.centerRows; i++){
                            display += "<th>" + String.fromCharCode(i + 0x41) + "</th>"
                        }
                    }
                    else if(seat.section == "rightSection"){
                        for(let i = 0; i < json.venue.rightRows; i++){
                            display += "<th>" + String.fromCharCode(i + 0x41) + "</th>"
                        }
                    }

                    display += "</tr><tr>"
                }

                if(seat.column != prevCol){
                    prevCol = seat.column
                    display += "</tr><tr><th>" + seat.column + "</th>"
                }

                if(seat.isAvailable){
                    display += "<td>x</td>"
                }
                else{
                    display += "<td> </td>"
                }
            }

            display += "</tr></table>"

//            console.log(seats)
//            console.log(display)
    
            if(json.success.length == 0) {
                document.getElementById("showSeatsResult").innerHTML = "No available seats"
            } else {
                document.getElementById("showSeatsResult").innerHTML = display
            }

        } else {
            document.getElementById("showSeatsResult").innerHTML = "Error: " + json.error
        }
    }

    post('show/showAvailableSeats', data, handler)

}

//TODO for iteration 2 
export function purchaseSeats(name, startTime, section, seats) {
    let arraySeats = seats.split(", ")
    console.log(arraySeats)
    let seatsForLambda = []
    for(let element of arraySeats) {
        let dict = {
            "column" : element[0],
            "row" : element[1]
        }
        seatsForLambda.push(dict)
    }
    console.log(seatsForLambda)
    
    let data = {"venue" : name,
                "startTime" : startTime,
                "section" : section,
                "seats" : seatsForLambda}

    const handler = (json) => {
        console.log(json)
        if(json.statusCode == 200) {
            let seats = "The following seats were purchased for " + section + ": <br>"
            for(let s of json.success) {
                seats += s.column + s.row + '<br>'
            }
            document.getElementById("purchaseSeatsResult").innerHTML = seats
        } else {
            document.getElementById("purchaseSeatsResult").innerHTML = "Error: " + json.error
        }
    }

    post('show/purchaseSeats', data, handler)

}