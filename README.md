## Stellar Splendor
[Stellar Splendor](https://stellarsplendor.netlify.app) is a web application that allows users to explore random captivating images of the universe. The users can also learn intriguing details about different images or videos. There's some extra support for videos.

Users can create accounts, log in, and personalize their experience. All liked images and videos will be stored in the user's account. They can remove any liked images whenever they want.

Stellar Splendor provides credits for every image.

URL: [stellarsplendor.netlify.app](https://stellarsplendor.netlify.app)

## Technologies used
I used ReactJS for building the frontend. I also used Firebase for login authentication and I used the Realtime Database as my database. I used Vite as opposed to Webpack due to its high bundling speed. I used React Bootstrap  because I wanted to focus on a minimalist user design for a user-friendly interface. I wanted users to get a random image or video, to keep the experience engaging. I used the Axios library for extracting the images from the NASA API. The login session will persist until the user explicitly log out of the application. The design is also responsive.

## Firebase Configuration and API Key Access
1. Create a new Firebase project on https://firebase.google.com/
2. Obtain your Firebase configuration json file from the project settings.
3. Place the json file in firebaseConfig.json in src/Components directory of the project, replacing the old one.
4. Sign up for an API key on https://api.nasa.gov/. Once you get your API key, put that in key.json file in src/Components.
5. Save all files

## Installation
1. Fork and clone this repo. The configure Firebase and get the API key.
2. Go to this repo and run ```npm install```.
3. Run ```npm run dev``` or ```npm run dev -- --port <port>``` to run on a specific port. The web app should open up at http://localhost:3000/ or whichever port you have selected.