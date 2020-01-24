# Contacts-Book App

Sontact-Books is a Single Page Application builts using HTML5, CSS3, JavaScript, Materialize.css, Knockout.js and Webpack.

## Installation
You can choose to clone or download the application. Unzip the project and run following commands:
* Installing Dependencies - `npm install`
* Running the application - `npm run start:dev`
* Building production build - `npm run build`

## File & Folder Structure
* package.json - contains dependency list and npm commands required to run and build the application.
* postcss.config.js - contains configuration of postcss tool.
* webpack.config.js - contains configuration of webpack.
* src folder - contains the codebase of Contacts-Book.
  * fonts - contains font files used in the app.
  * js - contains JavaScript code.
    * components - contain the component modules used in the app. Each component module has three files - view model (*-vm.js), html and scss.
    * pages - contain different page modules used in the app. Pages are structured similarly to components - view model (*-vm.js), html and scss - except they have a navigate() function to enable navigation to the page. All the components from /components module reside in pages.
    * services - contains services modules that are injected into individual components or pages. Components or Pages do not initialize new instance of services - app.js is responsible for initialization and injection.
    * models - contains concrete classes used in the app.
    * vendor - contains js code for different frameworks.
    * BaseComponent - base class that is inherited by components and pages.
    * app - contains the application codebase responsible for importing pages, facilitating communication between pages, initializing and injecting services.
  * sass - contains custom stylesheets and css frameworks.
  * index.html - base html layout that contains pages of the app.
  * index.js - root js file to import the stylesheets, frameworks, js libraries and the application.

## GitHub Page Branch
I have created a seperate GitHub Pages branch. However, since I have not used React or Angular or Vue (any such framework that uses Babel or other tools to create a deployment build), the file contents are same.

## WebSockets & HTTPS Issue
If a web app is hosted with https certificate, then all the resource requests need to be carried out over a secure channel. In case of REST api, the api will have to be hosted on https too. Similiarly, for websocket url, the url should have wss:// protocol instead of simple ws://. However, for the given url, it seems there is no version deployed or hosted on wss:// protocol. Because GitHub pages (<rhlranjan50.github.io/Stocks-App>) host the codebase on https, the Stocks App will hosted on the aforementioned url will not work. To demo the code, you will have to download the zip and run index.html locally.

## Author
Rahul Ranjan

## License
[MIT](https://choosealicense.com/licenses/mit/)
