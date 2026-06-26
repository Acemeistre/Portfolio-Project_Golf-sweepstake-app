<p align="center">
<img src="./src/assets/Banner_desktop_v2.2.png">
</p>

[![Static Badge](https://img.shields.io/badge/version%3A-1.1.06.26-darkgreen)](#)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
[![Static Badge](https://img.shields.io/badge/github-repo-blue?logo=github
)](https://github.com/Acemeistre/Portfolio-Project_Golf-sweepstake-app)
[![LinkedIn](https://custom-icon-badges.demolab.com/badge/LinkedIn-0A66C2?logo=linkedin-white&logoColor=fff)](https://www.linkedin.com/in/glenn-niblett-618180112/)
[![Codecademy](https://img.shields.io/badge/Codecademy-%2321759B.svg?logo=codecademy&logoColor=white)](https://www.codecademy.com/profiles/Acemeistre)
[![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?logo=vercel&logoColor=white)](https://vercel.com/glenn-niblett-s-projects/golf-sweepstake-app)
[![Visual Studio Code](https://custom-icon-badges.demolab.com/badge/Visual%20Studio%20Code-0078d7.svg?logo=visualstudiocode&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)](#)
[![Javascript](https://img.shields.io/badge/-%2320232a.svg?logo=javascript)](#)
[![CSS](https://img.shields.io/badge/-red?style=flat&logo=css&logoColor=white&color=red
)](#)
[![Figma](https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white)](#)
[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?&logo=discord&logoColor=white)](https://discord.com/invite/acemeistre)

# Golf Sweepstake app
An app for enhanced enjoyment of golf's 4 major championships.

## Table of contents
- [Overview](#overview)
- [Screenshots](#screenshots)
- [Full code](#full-code)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & usage](#installation--usage)
- [Known limitaions](#known-limitations)
- [Roadmap](#roadmap)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## Overview
The Major Sweepstake is a three-stage web app that lets groups of friends run a sweepstake across golf's four major championships.

The overall idea is for users to be able to choose which of the 4 golf’s majors they want to enter into a sweepstake with their friends (can be for 2 to 8 participants), by entering their name, choosing a colour to represent their assign professional players (drawn in stage 2 of the app) and choose which way they want the professional golfers to be drawn by (odds or rank).

After confirmation of options the app then proceeds to the 2nd stage, which could be viewed as “the main event” where there’s a scrollable list showing every golf player in the chosen tournament’s field, a spinner with button to randomly assign players to participants and then a draw results column showing the result of the group in which players are assigned to their participants for the “current” round and its “previous round” that dynamically updates as the draw progresses.

Once the full draw is complete users can then progress to the final stage of the app, where they’ll be able to see a live leaderboard of the real tournament taking place, where they can track their assigned players via the colours they chose in stage one - each participant’s respectively assigned players will have their selection represented by their chosen colour being set as the background colour of the player’s row of data (position, national flag, name, current hole and current score).
The leaderboard updates every 15 minutes via API polling and can be paused via a polling button for edge scenarios like weather interruptions, etc.
There’s also a little plus “+” button below the leaderboard for any late entries in case of the withdrawal of other players before the tournament began.

## Screenshots

## Full code

## Features

## Tech Stack

## Installation & usage

## Known limitations

## Roadmap

## Acknowledgements

## License






## Note on World Ranking API

"World rankings data is maintained via a static JSON file updated when each major field is announced. 
A paid API such as DataGolf or Sportradar would automate this in a production environment."