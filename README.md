<p align="center">
<img src="./src/assets/Banner_desktop_v2.2.png">
</p>

[![Static Badge](https://img.shields.io/badge/Version%3A-1.1.06.26-darkgreen)](#)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
[![Codecademy](https://img.shields.io/badge/Codecademy-%2321759B.svg?logo=codecademy&logoColor=white)](https://www.codecademy.com/profiles/Acemeistre)
[![GitHub](https://img.shields.io/badge/GitHub-repo-blue?logo=github
)](https://github.com/Acemeistre/Portfolio-Project_Golf-sweepstake-app)
[![Figma](https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white)](#)
[![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?logo=vercel&logoColor=white)](https://vercel.com/glenn-niblett-s-projects/golf-sweepstake-app)
[![Visual Studio Code](https://custom-icon-badges.demolab.com/badge/Visual%20Studio%20Code-0078d7.svg?logo=visualstudiocode&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)](#)
[![Javascript](https://img.shields.io/badge/JavaScript-%2320232a.svg?logo=javascript)](#)
[![CSS](https://img.shields.io/badge/CSS-red?style=flat&logo=css&logoColor=white&color=red
)](#)



# ⛳ Golf Sweepstake app
An app for enhanced enjoyment of golf's 4 major championships.

## Table of contents
- [Overview](#overview)
- [Disclaimer](#disclaimer)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & usage](#installation--usage)
- [Known limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Maintenance requirements](#maintenance-requirements)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## 📖 Overview
The Major Sweepstake is a three-stage web app that lets groups of friends run a sweepstake across golf's four major championships.

The overall idea is for users to be able to choose which of the 4 golf’s majors they want to enter into a sweepstake with their friends (can be for 2 to 8 participants), by entering their name, choosing a colour to represent their assigned professional players (drawn in stage 2 of the app) and choose which way they want the professional golfers to be drawn by (odds or rank).

After confirmation of options the app then proceeds to the 2nd stage, which could be viewed as “the main event” where there’s a scrollable list showing every golf player in the chosen tournament’s field, a spinner with button to randomly assign players to participants and then a draw results column showing the result of the group in which players are assigned to their participants for the “current” round and its “previous round” that dynamically updates as the draw progresses.

Once the full draw is complete users can then progress to the final stage of the app, where they’ll be able to see a live leaderboard of the real tournament taking place, where they can track their assigned players via the colours they chose in stage one - each participant’s respectively assigned players will have their selection represented by their chosen colour being set as the background colour of the player’s row of data (position, national flag, name, current hole and current score).
The leaderboard updates every 15 minutes via API polling and can be paused via a polling button for edge scenarios like weather interruptions, etc.
There’s also a little plus “+” button below the leaderboard for any late entries in case of the withdrawal of other players before the tournament began.

## 📋 Disclaimer
This app is intended purely for fun and enhanced enjoyment of golf's four major championships.<br> No real money is required or encouraged — any sweepstake financial arrangements are entirely at the discretion of the participants and outside the scope of this app.

## 📸 Screenshots 

#### Stage 1 - Tournament & Participant Selection
<img src="./src/assets/screenshots/Stage 1_options.jpg" width="600">

#### Stage 2 - The Draw
<img src="./src/assets/screenshots/Stage 2_Draw.jpg" width="600">

#### Stage 3 - Live Leaderboard
*Screenshot coming soon - requires live tournament data*

## ✨ Features
* **Tournament selection** - allows you to choose from any 1 of golf's 4 major events. 
* **Player sorter** - allows users to select how they sort the order that their golfers are drawn to participants, through either a professional golfer's ranking or their tournament odds.
* **Participant entry** - where participants can enter their name and select from a choice of colours from a colour picker that will represent their assigned players drawn in stage 2 and viewed on the live leaderboard in stage 3.
* **Automated player assignment spinner** - allows participants to do a full draw of the tournament's golf pros with the simple click of a button that randomly lands on the app's spinner wheel canvas.
* **Draw Results tracker** - view the results of the spins in the both the "current" round's group of assigned players and the "previous" round of players.
* **Live leaderboard** - track live updates of every participant's player's data, including live score and hole number as players proceed through the real Major event. 
* **Automated/Interactive polling** - keeps constant updates with calls to Slash Golf API every 15 minutes and can also be paused for unexpected events (such as inclement weather).
* **Late Entry field** - Allows users to enter any players who replaced withdrawals after the App's main draw has taken place.

## 🛠️ Tech Stack
- **React** - components-based UI framework.
- **Vite** - build tool and local development server.
- **JavaScript** - core language code.
- **Slash Golf API** - live leaderboard data via RapidAPI.
- **The Odds API** - player odds data for draw sorting.
- **Flagcdn.com** - flag images via free CDN.
- **Vercel** - deployment and hosting.
- **Figma** - UI design and prototyping.


## ⚙️ Installation & usage

### Prerequisites
- Node.js (v18 or higher)
- npm

### Clone the repository
```bash
git clone https://github.com/Acemeistre/Portfolio-Project_Golf-sweepstake-app.git
cd Portfolio-Project_Golf-sweepstake-app
```

### Install dependencies
```bash
npm install
```

### Environment variables
Create a `.env` file in the root directory and add your API keys:
```
VITE_GOLF_SLASH_LEADERBOARDS_API_KEY=[your slash golf key]
VITE_ODDS_API_KEY=[your odds api key]
```

### Run locally
```bash
npm run dev
```

### Or visit the live app
[golf-sweepstake-app.vercel.app](https://golf-sweepstake-app.vercel.app/)

## ⚠️ Known limitations
- This app currently only works on each individual’s own browser, using local storage persistence and has no back end that can share polling or API updates with friend’s other devices.

- The API quota for polling is currently exhausted from the App's build phase - live leaderboard data remains unavailable as this time, due to this limitation and will reset on the 15th of July, 2026.

- The data for odds also met it’s quota during the app build, so there currently is no data available for the odds sort option.

- World rankings data is maintained via a static JSON file, last updated for the week of the U.S.Open 2026. 
A paid API such as DataGolf or Sportradar would automate this in a production environment.

- Automated polling windows are set to capture most of each tournament day, but may miss early day action (each day) due to limited API calls.

- Once the polling button is clicked to pause, users must manually unpause on the same respective day as this will over-ride automated polling windows.


## 🗺️ Roadmap

**The following points are the current pipeline of updates coming to future versions of the Golf Sweepstake app.**

**JULY ONWARDS**:
- Verify vite's hot reload firing the leaderboard API when making code updates.

- Build the fetch command for one off call to odds API data, storing it to a JSON file and also adding a time check to disable the command after the first tee times on day 1 of each tournament.

- Build "fetchField.js" script to grab the appropriate field of players for any given tournament.
    - Update app to filter players by "fetchfield.js".

- Odds restoration and fractional/decimal conversion.

- Change file name "playerCountries.json" to "playerData.json" and add boolean data for each major.
<br><br>

**REST OF YEAR:**
- Look into shared backend databases for sharing app/polling data on multiple devices.

- Add in a component of a key, for the participant's picked colours representing their drawn players, in stage 3 for visual reference.

- Add in a component that calculates the pay-out of a sweepstake break-down, based on total pot size and agreed placement pay-out amounts.

- Build a clean-up script for "playerCountries.json" (*later named "playerData.json"*) — compare existing entries against a fresh top-1000 world rankings to pull and remove players absent from the top 1000 - run ideally at the start of a new year.
    - Ensure previous major winner's data IS NOT wiped.

- Revisit disclaimer wording once the sweepstake payout calculator component is built — ensure language clearly distinguishes between friendly sweepstake tracking and regulated gambling.

## 🔧 Maintenance Requirements

- **Week leading to tournament** <br>
    - Execute the fetchRankings.js command to update "worldRankings.json".
    - Execute the fetchField.js to save to a new (*yet to be named*) json file.
    - Manually add player's data to "playerCountries.json" (*later named "playerData.json"*) for those who get through regional qualification and outside the parameters of our saved data.

- **Yearly**
    - Update tournament dates & polling windows.
    - Execute the clean-up script to refresh the data for "playerCountries.json" (*later named "playerData.json"*).

## 🙏 Acknowledgements
- Slash Golf API
- The Odds API
- Flagcdn.com / Flagpedia.net
- Lucide React (icons)
- react-custom-roulette (spinner)

## 🔓 License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
