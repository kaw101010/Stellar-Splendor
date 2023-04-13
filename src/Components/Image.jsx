import React, { useState } from "react";
import apikeys from './keys.json';
import '../App.css'

function ImageGenerator() {
    const [url, setUrl] = useState('');
    const [resp, setResp] = useState(0);
    fetch(`${apikeys.ApiUrl}?api_key=${apikeys.ApiKey}`)
    .then(
        (response) => {
            setResp(response.status);
            if (response.status == 200){
            response.json();
            } else {
                return;
            }
        })
    .then(data => {setUrl(data)})

    { 
        if (resp == 200){
        return (
            <div>
                <p>{JSON.stringify(url)}</p>
                <img src = {`${url.hdurl}`} alt = "img" width="500px" height="500px"/>
                <ol id="info">
                    {url.copyright && <li><strong>Made by</strong> {url.copyright}</li>}
                    <li><strong>Date: </strong>{url.date}</li>
                    <li><strong>Explanation: </strong>{url.explanation}</li>
                </ol>
            </div>
    )}
}}

export default ImageGenerator
