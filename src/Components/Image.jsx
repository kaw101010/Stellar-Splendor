import React, { useState } from "react";
import apikeys from './keys.json';

function ImageGenerator() {
    const [url, setUrl] = useState('')
    function CallApi(){
            fetch(`${apikeys.ApiUrl}?api_key=${apikeys.ApiKey}`)
            .then(
                (response) => 
                response.json()
    )
            .then(data => {
                setUrl(data)})
}
    CallApi()

    return (
        <div>
            <p>{JSON.stringify(url)}</p>
            <img src = {`${url.hdurl}`} alt = "img" width={window.innerWidth / 2} height={window.innerHeight / 2}/>
            <ol>
                <li><strong>Made by</strong> {url.copyright}</li>
                <li><strong>Date: </strong>{url.date}</li>
                <li><strong>Explanation: </strong>{url.explanation.slice(1,)}</li>
            </ol>
        </div>
    )
}

export default ImageGenerator
