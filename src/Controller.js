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

export function createShow(venueName, password, title, startTime, endTime, usesBlocks, optPrice){
    if (optPrice == "") {
        optPrice = null
    }
    let data = {  "venueName": venueName,
                  "password" : password,
                  "title" : title,
                  "startTime" : startTime,
                  "endTime" : endTime,
                  "usesBlocks" : usesBlocks,
                  "optPrice" : optPrice}

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

export function createBlock(name, password, startTime, section, startRow, endRow, price) {
    let data = {  "venueName": name,
                  "password" : password,
                  "startTime" : startTime,
                  "section" : section,
                  "startRow" : startRow,
                  "endRow" : endRow,
                  "price" : price}

    const handler = (json) => {
        console.log(json)
        if(json.statusCode == 200){
            document.getElementById("createBlockResult").innerHTML = "The following block have been created: \'" + json.success + "\'" //TODO 
        }
        else{
            document.getElementById("createBlockResult").innerHTML = "Error: " + json.error
        }
    }

    post('/show/createBlock', data, handler)
}


export function deleteBlock(name, password, startTime, section, startRow, endRow) {
    let data = {  "venueName": name,
                  "password" : password,
                  "startTime" : startTime,
                  "section" : section,
                  "startRow" : startRow,
                  "endRow" : endRow}
                  
    const handler = (json) => {
        console.log(json)
        if(json.statusCode == 200){
            document.getElementById("deleteBlockResult").innerHTML = "The following block have been deleted: \'" + json.success + "\'" //TODO 
        }
        else{
            document.getElementById("deleteBlockResult").innerHTML = "Error: " + json.error
        }
    }
    post('/show/deleteBlock', data, handler)
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

export function listBlocks(name, password, startTime) {
    let data = { "name": name,
                 "password" : password,
                "startTime" : startTime}

    const handler = (json) => {
        console.log(json)
        if(json.statusCode == 200){
            let blocks = "<table style='width: 80%'> <tr><th>BlockID</th> <th>price</th> <th>section</th> <th>startRow</th> <th>endRow</th> <th>showID</th></tr>"
            for(let b of json.success){
                blocks += "<tr> <td style='text-align: center'>" + b.blockID + "</td><td style='text-align: center'>" + b.price + "</td><td style='text-align: center'>" + b.section + "</td><td style='text-align: center'>" + b.startRow + "</td><td style='text-align: center'>" + b.endRow + "</td><td style='text-align: center'>" + b.showID +  "</tr>"
            }
            blocks += "</table>"
            
            if(json.success.length == 0) {
                document.getElementById("blocksList").innerHTML = "No blocks currently exist for this show"
            } else {
                document.getElementById("blocksList").innerHTML = blocks
            }
        }
        else{
            document.getElementById("blocksList").innerHTML = "Error: " + json.error //want this instead of writing the errors here?
        }
    }

    post('/show/listBlocks', data, handler)
}

export function listShows(name, password) {
    let data = { "name": name,
                 "password" : password}

    const handler = (json) => {
        if(json.statusCode == 200){
            let shows = "<table style='width: 80%'> <tr><th>Title</th> <th>isActive</th> <th>startTime</th> <th>endTime</th> <th>usesBlocks</th> <th>ticketsSold</th> <th>totalRevenue</th></tr>"
            for(let s of json.success){
                s.startTime = s.startTime.replace(/T/g, " ").replace(/Z/g, " ")
                s.startTime = s.startTime.replace(".000"," ")
                s.endTime = s.endTime.replace(/T/g, " ").replace(/Z/g, " ")
                s.endTime = s.endTime.replace(".000"," ")
                shows += "<tr> <td style='text-align: center'>" + s.title + "</td><td style='text-align: center'>" + s.isActive + "</td><td style='text-align: center'>" + s.startTime + "</td><td style='text-align: center'>" + s.endTime + "</td><td style='text-align: center'>" + (s.usesBlocks ? "true" : "false") + "</td><td style='text-align: center'>" + s.ticketsSold + "</td><td style='text-align: center'>" + s.totalRevenue +"</td><td><button onclick='redirectToShowPage()'>Go to show</button></td></tr>"
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
            let result = "<table style='width: 80%'> <tr> <th>Name</th> <th>leftCols</th> <th>leftRows</th> <th>centerCols</th> <th>centerRows</th> <th>rightCols</th> <th>rightRows</th> </tr>";
            for(let v of json.venues){
                result += "<tr> <td style='text-align: center'>" + v.venueName + "</td><td  style='text-align: center'>" + v.leftColumns + "</td><td  style='text-align: center'>" + v.leftRows + "</td><td  style='text-align: center'>" + v.centerColumns + "</td><td  style='text-align: center'>" + v.centerRows + "</td><td  style='text-align: center'>" + v.rightColumns + "</td><td  style='text-align: center'>" + v.rightRows + "</td></tr>"

                //ARRAYS INSIDE OF ARRAYS AHHHHH
                for(let s of json.shows) {
                    for(let show of s) {
                        if (show.venueName === v.venueName) { //could probably optimize
                            show.startTime = show.startTime.replace(/T/g, " ").replace(/Z/g, " ")
                            show.startTime = show.startTime.replace(".000"," ")
                            result += "<tr> <td  style='text-align: center'>-----</td> <td  style='text-align: center'>" + show.title + "</td><td  style='text-align: center'>" + show.startTime + "</td></tr>"
                        }
                    }

                }
            }
            result += "</table>"
            console.log(result)
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
//        json.success = "<table><tr><td>" + json.success
//        json.success = json.success.replaceAll("<br>", "</tr><tr>").replaceAll(" ", "</td><td>")
        console.log(json.success)
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
            let shows = "<table style='width: 80%'> <tr> <th>title</th> <th>venue</th> <th>date</th>"
            for(let s of json.success) {
                s.startTime = s.startTime.replace(/T/g, " ").replace(/Z/g, " ")
                s.startTime = s.startTime.replace(".000"," ")
                shows += "<tr> <td style='text-align: center'>"+ s.title + "</td><td style='text-align: center'>" + s.venueName + "</td><td style='text-align: center'>" + s.startTime + "</td></tr>"
            }
            shows += "</table>"

            if(json.success.length == 0) {
                document.getElementById("searchShowsList").innerHTML = "No shows match your search"
            } else {
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
            let blocks = []
            for(let s of json.success) {
                if(s.block != null && !blocks.some(row => row.includes(s.block))){
                    let price = 0
                    for(let b of json.blocks){
                        if(b.blockID == s.block){
                            price = b.price
                        }
                    }
                    let randomColor = "hsl(" + Math.random() * 360 + "," + (Math.random() * 40 + 60) + "%," + (Math.random() * 50 + 30) + "%)";
                    blocks.push([s.block, randomColor, price])
                }
            }

            let prevRow = "A";
            let prevSection = "leftSection";
            let display = "leftSection" + "<table> <tr><td> </td>"

            for(let i = 0; i < json.venue.leftColumns; i++){
                display += "<th>" + (i+1) + "</th>"
            }

            display += "<tr> <th>A</th>"

            for(let seat of json.success){
                if(seat.section != prevSection){
                    prevSection = seat.section
                    display += "</table> " + seat.section + "<table> <tr><td> </td>"

                    if(seat.section == "centerSection"){
                        for(let i = 0; i < json.venue.centerColumns; i++){
                            display += "<th>" + (i+1) + "</th>"
                        }
                    }
                    else if(seat.section == "rightSection"){
                        for(let i = 0; i < json.venue.rightColumns; i++){
                            display += "<th>" + (i+1) + "</th>"
                        }
                    }

                    display += "</tr><tr>"
                }

                if(seat.row != prevRow){
                    prevRow = seat.row
                    display += "</tr><tr><th>" + seat.row + "</th>"
                }

                if(seat.isAvailable){
                    let hasBlock = false;
                    for(let i = 0; i < blocks.length; i++){
                        if(seat.block == blocks[i][0]){
                            display += "<td style='color:" + blocks[i][1] + ";'>x</td>"
                            hasBlock = true;
                        }
                    }
                    if(!hasBlock){
                        display += "<td>x</td>"
                    }
                }
                else{
                    display += "<td> </td>"
                }
            }

            display += "</tr></table>"

            for(let i = 0; i < blocks.length; i++){
                display += "<p style='color:" + blocks[i][1] + ";'> block " + (i+1) + ": $" + blocks[i][2] +"</br></p>"
            }

            if(blocks.length == 0){
                display += "price: " + "$" + json.show.optPrice 
            }

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
export function purchaseSeats(name, startTime, title, seats) {
    let arraySeats = seats.split(", ")
    console.log(arraySeats)
    let seatsForLambda = []
    for(let element of arraySeats) {
        let separating = element.split(" ")
        let dict = {
            "column" : separating[0][0],
            "row" : separating[0][1],
            "section" : separating[1], //assuming user inputs everything correctly
        }
        seatsForLambda.push(dict)
    }
    console.log(seatsForLambda)
    
    let data = {"venue" : name,
                "startTime" : startTime,
                "title" : title,
                "seats" : seatsForLambda}

    const handler = (json) => {
        console.log(json)
        if(json.statusCode == 200) {
            let seats = "The following seats were purchased for " + title + ": <br>"
            for(let s of json.success) {
                seats += s.column + s.row + ' ' + s.section + '<br>'
            }
            document.getElementById("purchaseSeatsResult").innerHTML = seats
        }
        else {
            if(json.invalidSeats){
                let returnStr = "The following seats could not be purchased: <br>"

                for(let s of json.invalidSeats) {
                    returnStr += s.column + s.row + ' ' + s.section + '<br>'
                }

                document.getElementById("purchaseSeatsResult").innerHTML = returnStr
            }
            else{
                document.getElementById("purchaseSeatsResult").innerHTML = "Error: " + json.error
            }
        }
    }

    post('show/purchaseSeats', data, handler)

}
