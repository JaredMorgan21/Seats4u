import {post} from "./API"

export function createVenue(){
    let data = {'':''}

    const handler = (json) => {
        document.getElementById("result").value = json.body
    }

    post('/venue/create', data, handler)
}