<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![project_license][license-shield]][license-url]
<!-- [![LinkedIn][linkedin-shield]][linkedin-url] -->



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/394-w25/Cookbook">
    <img src="https://github.com/394-w25/Cookbook/blob/master/src/assets/images/cookbook-logo.png?raw=true" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Generational Cookbook</h3>

  <p align="center">
    An app designed to digitize and enrich family recipes, preserving culinary traditions across generations.
    <br />
    <a href="https://github.com/394-w25/Cookbook"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/394-w25/Cookbook">View Demo</a>
    &middot;
    <a href="https://github.com/394-w25/Cookbook/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/394-w25/Cookbook/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <!-- <li><a href="#usage">Usage</a></li> -->
    <!-- <li><a href="#roadmap">Roadmap</a></li> -->
    <li><a href="#bugs">Bugs</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![Product Name Screen Shot][product-screenshot]

<!-- Here's a blank template to get started. To avoid retyping too much info, do a search and replace with your text editor for the following: `github_username`, `repo_name`, `twitter_handle`, `linkedin_username`, `email_client`, `email`, `project_title`, `project_description`, `project_license` -->

Users can add recipes to the family cookbook using 3 methods:
* []() Scanning and uploading a photo of a recipe.
* []() Voice recording a recipe.
* []() Manually typing a recipe.

Once the system has the raw recipe information, the user is prompted with a series of journal questions. When the user clicks submit, these answers are processed by OpenAI, returning a completed written journal entry and bringing the user to the final edit page.

On the final edit page, the user can add additional information, such as prep time, cook time, and the creator. Here, they can also edit the recipe text, e.g. steps and instructions. Finally, there is a chatbot available to process user requests to make edits to the recipe contents. Possible modifications:
* []() Add more greens.
* []() Make this mexican-styled.
* []() Double the ingredients.

Once the user is happy with the results, they may submit the final recipe to the database. The home page will retrieve new recipes from the database.


<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

<!-- * [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![Vue][Vue.js]][Vue-url]
* [![Angular][Angular.io]][Angular-url]
* [![Svelte][Svelte.dev]][Svelte-url]
* [![Laravel][Laravel.com]][Laravel-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![JQuery][JQuery.com]][JQuery-url] -->
* []() React
* []() Google MUI
* []() Firebase
* []() Google Cloud Functions
* []() OpenAI API

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

<!-- This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps. -->

### Prerequisites

<!-- This is an example of how to list things you need to use the software and how to install them. -->
<!-- * npm
  ```sh
  npm install npm@latest -g
  ``` -->
* Node.js and npm\
Go here to get node.js and the package manager npm: [https://nodejs.org/en](https://nodejs.org/en)

* Firebase\
Sign into Firebase using your Gmail and make a new project: [https://firebase.google.com](https://firebase.google.com)
*[]() Set the project up for hosting and Firestore on a webapp.
*[]() Once the project is created, enable authentication (Google-sign in).
*[]() Check your project settings for the config deets:
```
const firebaseConfig = {
  apiKey: "api-key",
  authDomain: "project-id.firebaseapp.com",
  databaseURL: "https://project-id.firebaseio.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "sender-id",
  appID: "app-id",
};

firebase.initializeApp(firebaseConfig);
```
Go into **firebase.js** in the **src folder** and replace the parameters with your new project's.\
No initial data needs to be stored in Firestore.

* Google Cloud Functions\
This service automatically comes with Firebase. Enable the API services for your Firebase project: [https://cloud.google.com/functions](https://cloud.google.com/functions)\
You will store the OpenAI key in the environment variables.\
For adding functions:
```sh
cd functions
```
```sh
npm install
```
Add the functions to **index.js**.\
Deploy the functions:
```sh
firebase deploy --only functions
```

### Installation

1. Get an OpenAI API Key at [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Clone the repo
   ```sh
   git clone https://github.com/394-w25/Cookbook.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
<!-- 4. Enter your API in `config.js`
   ```js
   const API_KEY = 'ENTER YOUR API';
   ``` -->
<!-- 5. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin 394-w25/Cookbook
   git remote -v # confirm the changes
   ``` -->
4. Start the app on localhost
    ```sh
    npm start
    ```
5. Go to http://localhost:5173, the default port.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
<!-- ## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->



<!-- ROADMAP -->
<!-- ## Roadmap

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
    - [ ] Nested Feature

See the [open issues](https://github.com/394-w25/Cookbook/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->



<!-- Bugs -->
## Bugs

<!-- Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->

No app is perfect or ever 100% complete. For future developers, here is a list of known bugs.
* []() The 'My Family' button on the navigation bar is not functional.
This is meant for a future feature that allows users to view recipes organized by family lines.
* []() On the voice recording page of the app, the box where transcribed text
shows up does not automatically scroll.
* []() The upload button for adding recipe images from the edit page is not working for some reason.
* []() Recipe card does not show the cook time, per the wireframe.
* []() Markdown appears in the journal text and other recipe elements after editing the recipe using the chatbot.

### Top contributors:

<a href="https://github.com/394-w25/Cookbook/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=394-w25/Cookbook" alt="contrib.rocks image" />
</a>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

<!-- Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - email@email_client.com -->

Project Link: [https://github.com/394-w25/Cookbook](https://github.com/394-w25/Cookbook)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []() This project was created by Team Maroon in Northwestern's CS394 course, taught by Prof. Riesbeck.
* []() Thanks to our product managers in the MPD2 course for their guidance.
<!-- * []() -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/394-w25/Cookbook.svg?style=for-the-badge
[contributors-url]: https://github.com/394-w25/Cookbook/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/394-w25/Cookbook.svg?style=for-the-badge
[forks-url]: https://github.com/394-w25/Cookbook/network/members
[stars-shield]: https://img.shields.io/github/stars/394-w25/Cookbook.svg?style=for-the-badge
[stars-url]: https://github.com/394-w25/Cookbook/stargazers
[issues-shield]: https://img.shields.io/github/issues/394-w25/Cookbook.svg?style=for-the-badge
[issues-url]: https://github.com/394-w25/Cookbook/issues
[license-shield]: https://img.shields.io/github/license/394-w25/Cookbook.svg?style=for-the-badge
[license-url]: https://github.com/394-w25/Cookbook/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: https://github.com/394-w25/Cookbook/blob/master/src/assets/images/add_recipe.png?raw=true
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 