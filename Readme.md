# Contacts-Book App

Sontact-Books is a Single Page Application builts using HTML5, CSS3, JavaScript, Materialize.css and Knockout.js The app uses websocket to connect with the server and fetch live stocks data.

## Installation

Simply download the application and run index.html. You need to have an active internet connection as the Material UI framework is served from cdn.

## Choice of Frameworks
* Knockout.js - Due to the less complexity of the app, I wanted to use a minimal JavaScript framework that provided data binding primarily. Initially, I thought to use React, but given the time constraints, I opted Knockout.js as the code set up and deployment is relatively easier as compared to React.
* Materialize.css - Similarly, I wanted a basic grid layout and a simple card component. So instead of writing the css from scratch I opted for Materialize.css that is based on material ui theme. Instead of downloading several minified files (css, js and font) of the framework and then adding each of them manually in the app, I instead used cdn to serve the files as this would be faster and contributed in reduction of project size.
* Sparkline.js - For generating sparklines, I chose a mini sparkline library written by fnando. I wanted a basic sparkline to show how the prices of stocks were behaving for recent past. Hence instead of choosing a fully fledged graphing library such as Highcharts or d3.js, I chose fnando's sparkline library. Shout out to him: <https://github.com/fnando/sparkline>

## GitHub Page Branch
I have created a seperate GitHub Pages branch. However, since I have not used React or Angular or Vue (any such framework that uses Babel or other tools to create a deployment build), the file contents are same.

## WebSockets & HTTPS Issue
If a web app is hosted with https certificate, then all the resource requests need to be carried out over a secure channel. In case of REST api, the api will have to be hosted on https too. Similiarly, for websocket url, the url should have wss:// protocol instead of simple ws://. However, for the given url, it seems there is no version deployed or hosted on wss:// protocol. Because GitHub pages (<rhlranjan50.github.io/Stocks-App>) host the codebase on https, the Stocks App will hosted on the aforementioned url will not work. To demo the code, you will have to download the zip and run index.html locally.

## Author
Rahul Ranjan

## License
[MIT](https://choosealicense.com/licenses/mit/)
