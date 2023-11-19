const url = "https://pailbvgk57.execute-api.us-east-2.amazonaws.com/Stage1/"

function api(resource){
    return url+resource
}

export function post(resource, data, handler){
    fetch(api(resource),{
        method: "POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((responseJson) => handler(responseJson))
    .catch((err) => handler(err))
}

export async function get(resource){
    const response = await fetch(api(resource), {
        method: "GET"
    })

    return response.json()
}