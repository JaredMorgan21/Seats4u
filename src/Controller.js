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
            document.getElementById("result").innerHTML = "Venue with that name already exists"
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
            document.getElementById("result").innerHTML = "Show created with name \'" + json.success + "\'"
        }
        else{
            document.getElementById("result").innerHTML = "Error. No work"
        }
    }

    post('/show/create', data, handler)
}

export function createBlock() {

}

export function activateShow() {

}

export function deleteShow() {

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
            document.getElementById("venueDeleteResult").innerHTML = "No venue with that name exists"
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
            let venues = "Name, leftCols, leftRows, centerCols, centerRows, rightCols, rightRows <br>"
            for(let v of json.success){
                venues += v.venueName + ' ' + v.leftColumns + ' ' + v.leftRows + ' ' + v.centerColumns + ' ' + v.centerRows + ' ' + v.rightColumns + ' ' + v.rightRows + '<br>'
            }
            
            document.getElementById("venuesList").innerHTML = venues
        }
        else{
            document.getElementById("venuesList").innerHTML = "Invalid password"
        }
    }

    post('/venue/list', data, handler)
}


//consumer
export function searchShows(title) {
    let data = {"title" : title}
    const handler = (json) => {
        console.log(json.success)
        if(json.statusCode == 200) {
            let shows = "title, venue, date <br>"
            for(let v of json.success) {
                shows += v.title + ' ' + v.venueName + ' ' + v.startTime + '<br>'
            }

            document.getElementById("searchShowsList").innerHTML = shows

        } else {
            document.getElementById("searchShowsList").innerHTML = "some sort of error maybe change later"
        }
    }

    post('/show/search', data, handler) //this is where it talks to API?

}