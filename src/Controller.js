import {post} from "./API"

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

export function deleteVenue(name, adminPass){
    let data = {  "name": name,
                  "password" : adminPass}
    console.log(adminPass)
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