<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
***
***
***
*** To avoid retyping too much info. Do a search and replace for the following:
*** github_username, repo_name, twitter_handle, email, Uptime Monitoring API, A RESTful API to monitor up or down time of user defined links.
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<p align="center">

  <h3 align="center">Uptime Monitoring API</h3>`

  <p align="center">
    A RESTful API built with Node to monitor URLs and send SMS if they are up or down.
    <br />
    <!-- <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/github_username/repo_name">View Demo</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Report Bug</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues">Request Feature</a> -->
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<!-- <details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
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
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details> -->

<!-- ABOUT THE PROJECT -->

## About The Project


### Built With

- [Node](https://nodejs.org/en/)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

<!-- USAGE EXAMPLES -->

## Usage

**Create User**
----
  Returns json response after creating a single user.

* **URL**

  /user

* **Method:**

  `POST`

* **Data Params**

  ```
  {
	"firstName": "Minhajul",
	"lastName": "Karim",
	"phone": "01711091062",
	"password": "xxxx",
	"tosAgreement": true
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"Message":"User created"}`
 
* **Error Response:**

  * **Code:** 400 Bad Request <br />
    **Content:** `{"Error":"There is a problem in your request."}`



**Create Token**
----
  Returns json response after creating a token.

* **URL**

  /token

* **Method:**

  `POST`

* **Data Params**

  ```
  {
    "phone": "01711091062",
    "password": "123456"
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{"Message":"Token created"}`
 
* **Error Response:**

  * **Code:** 403 Forbidden <br />
    **Content:** `{"Error":"Authentication failure"}`


**Create Check File**
----
  Returns json response after creating a token.

* **URL**

  /check

* **Method:**

  `POST`

* **Header:**

  `token`

* **Data Params**
    ```
    {
      "protocol": "https",
      "url": "google.com",
      "method": "GET",
      "successCodes": [200, 201, 301],
      "timeoutSeconds": 2
    }
    ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
      ```
      {
        "id": "ep7nwmvuhgd33caht1he",
        "protocol": "https",
        "phone": "01711091062",
        "url": "google.com",
        "method": "GET",
        "successCodes": [200,201,301],
        "timeoutSeconds": 2
      }
      ```
 
* **Error Response:**

  * **Code:** 403 Forbidden <br />
    **Content:** `{"Error":"Authentication failure"}`


**Show the console to see the alerts.**


