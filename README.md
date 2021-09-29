# DAO Bounty Board

[![Netlify Status](https://api.netlify.com/api/v1/badges/8e12fc34-94a3-4c7a-8323-fc2b7e1d4d14/deploy-status)](https://app.netlify.com/sites/bounty-board-29081e/deploys)

Project Page:
https://www.notion.so/bankless/Bounty-Board-318dc164cc5640cca17e0fb5f484fd90

### Specifications:

- [Specs page](https://docs.google.com/document/d/1VJXin9Uoqt54JjfQEtyM11XESb2l4C1SSAzgc0kvxIs/edit?usp=sharing)
- [Figma](https://www.figma.com/file/venmq7OWr8iRsjR9ecttvc/Untitled?node-id=1%3A7)
- [Whimsical](https://whimsical.com/bounty-board-design-bankless-2cPEEZinYKJ2zE2Zvq7iAZ)
- [Heroku](https://bounty-board.herokuapp.com/)
- [Possible Queries](https://www.notion.so/Bounty-Board-Queries-33d03a4330454e67b8194aa86274ec34)
- [Data Fields](https://docs.google.com/document/d/10jgHxEpkPlArGlsQH1g22utFrAFh2lK-fbXjbq8KkuU/edit)
- [Personas](https://www.notion.so/Bounty-Board-Personas-8e8f2789775a445c82d13c2a9c545185)
- [Bot flowchart](https://media.discordapp.net/attachments/852736763205910538/857786834682511370/image0.jpg?width=978&height=683)

For full details on running the project locally, please see the 'getting started' section below.
# Project Overview

## Problem

Currently, Bankless DAO bounties are not in a centralized location causing confusion and makes it challenging for members, new and old, to contribute. Also Level 0's do not have intuitive ways to get involved and earn $BANK other than buying in the secondary markets.

## Solution

For the DAO to grow, we need a way to attract, retain and coordinate talent. The bounty board, accessible to members and non-members will connect the DAO to a continually expanding talent pool.

In addition, we need a way to codify meaningful units of work. Given the diversity of jobs to be done in a DAO, the bounty board allows bounty _creators_ to define and specify the scope of tasks along with expected deliverables.

Finally, we need a way to formalize the flow of capital, beyond an informal, organic tipping culture that exists to formally recognize contributors for their knowledge, skills and abilities.

The bounty board will be a key mechanism for coordinating talent, tasks and capital.

## Minimal Viable Product 1.0

### Bounty Card Definition

For the MVP, we are focusing on the bare requirements for a Bounty Card to be created by a user via DEGEN and/or Frontend UI, with the following key fields:

- **Title**: Bounty Titles should be like headlines
- **Description**: Provides space to flesh out the scope, deliverables and timeline for the bounty.
- **Criteria**: When is a task considered "done" or "complete"?
- **Reward**: Bounty creator indicates `amount` (i.e., 10000) and `currency` (i.e., $BANK) to be paid for completing the work.
- **HashId**: Auto-generated ID for each bounty.
- **CreatedBy / RequestedBy**: Bot automatically enters bounty creator's `discordHandle`.
- **ClaimedBy**: Bot automatially notes `discordHandle` claiming the bounty.
- **SubmittedBy**: Bot automatically notes `discordHandle` submitting the bounty.

#### User Experience Flow: Bot in Discord

The User Experience flow with accompanying bounty status is as follows:

1. **Draft**: Bounty creator creates new bounty with `/bounty create new`; status is now "Draft" and _not_ shown in Discord. Bounty creator must publish the bounty before it is available to the public.
2. **Publish/Open**: Bounty creator clicks thumbs up emoji 👍 or `/bounty create publish` in Discord, bounty published to #🧀-bounty-board channel and website (url provided); status is now _Open_ on website.
3. **Claim/In Progress**: Within #🧀-bounty-board Bounty _claimer_ click black flag 🏴 or `/bounty claim` to 'start', card changes color in Discord, Bounty creator receives message that bounty has been claimed; Bounty card on website now has _Claimed By_; card status is now "In Progress".
4. **Submit/In Review**: Bounty claimer hits red mail box emoji 📮 in Discord, receives auto-generated message from Bot indicating "bounty in review". The creator of the bounty is notified that the bounty is ready for review. They should reach out to the claimee. Alternatively, user can submit directly through a new bot command `/bounty submit`, entering `HashId`; card status is now "In Review".
5. **Complete/Completed**: Bounty claimer can signal completion ✅ on the post in the #🧀-bounty-board channel or directly through a new bot command `/bounty complete true`; card status is now "Completed".

#### Bot Commands

1. Within The Bankless Bot Garage, head to #spam-tastic
2. Enter `/` and see a list of Bots pop up, choose `SERENDIPITY MK-I`

The following commands are available for Serendipity MK-I:

/bounty create new
/bounty create publish
/bounty claim
/bounty complete
/bounty list
/bounty delete
/bounty submit

Refer to the [Bounty Board Commands and Workflow](https://bankless.notion.site/The-Bounty-Board-Commands-and-Workflow-7f15bbc3f2c744afab1cb5f90daac4a2) Notion Page for in-depth details.

#### User Experience Flow: Frontend

**Note**: Currently, the frontend mirrors the interaction with the Bot in discord and displays changes in card status. Both Discord/Bot actions and Frontend Statuses are displayed below:

1. **Discord/Bot: Draft**: Bounty creator creates new bounty with `/bounty create new`; status is now "Draft" and _not_ shown in Discord. Bounty creator must publish the bounty before it is available on the frontend.
2. **Frontend Status: Open**: Bounty creator clicks thumbs up emoji 👍 or `/bounty create publish` in Discord, bounty published to #🧀-bounty-board channel and website (url provided); status is now _Open_ on the frontend.
3. **Discord/Bot: Claim**: Now that a bounty card is _Open_, we can click "Claim It".
4. **Frontend Status: In Progress**: Within #🧀-bounty-board Bounty click black flag 🏴 or `/bounty claim` to 'claim'. A link back to the frontend shows card status as "In Progress" and "Claimed By" claimer's discord handle.
5. **Discord/Bot: Submit**: Bounty claimer hits red mail box emoji 📮 in Discord, receives auto-generated message from Bot indicating "bounty in review".
6. **Frontend Status: In Review**: Card status on the frontend is "In Review".
7. **Discord/Bot: Complete**: Bounty claimer can signal completion ✅ on the post in the #🧀-bounty-board channel. Bounty creator receives message to tip bounty completer.
8. **Frontend Status: Completed**: Work is done.


# Getting Started
In order to run a local instance of the application you will need to configure a few things.
### Install Packages
You can either run the application from this top-level monorepo, or change into the `packages/react-app` directory. You will need the yarn package manager installed then run

```bash
$ yarn
$ yarn dev 
```
Which will install packages and run the application on port 3000. The `package.json` file in the respective repo gives a full list of commands.
### Configure local `.env` file

The react application looks for an environment variables file named `.env.local` on starting. You can copy the `.env.qa` file for most of the variables. You will need to add the `DEV_MONGODB_URI` and `DEV_DEV_DISCORD_BOUNTY_BOARD_WEBHOOK` as covered below.
### Setup MongoDB

Connection to MongoDB is handled through the Mongoose DRM. You can either connect to a hosted instance of MongoDB, or run a local development copy.

If running locally, your `.env.local` will contain something like:
```
DEV_MONGODB_URI=mongodb://localhost:27017/bountyboard
```
If connecting to a remote mongo server, your connection string will be in the format:
```
DEV_MONGODB_URI=mongodb://username:password@host:port/bountyboard
```
Please refer to [the Mongoose docs](https://mongoosejs.com/docs/connections.html) for more information.

### Setting Up Data in MongoDB
The app expects a MongoDB db `bountyboard` with the collection `bounties`, as specified in the json files within `mongo/bounties` (note: these might need some slight tweaking to fit with the app).

If you're firing up a fresh instance of Mongo, you will need to seed the database from the command line or discord, as the board does not currently have an 'add bounty` functionality.

If you're adding from command line, you can use the mongoimport utility to import one of the JSON files in the `mongo/bounties` folder. 

```bash
$ mongoimport\
    --db bountyboard\
    --collection bounties\
    --file path/to/mongo/bounties/file.json\
    --jsonArray # only needed if loading an array
```
If you've made it this far, the application should run and should be showing a bounty on the main screen. You can directly query the API backend through the app at `localhost:3000/api/bounties`
### Setting Up the Discord Webhook
The `DEV_DEV_DISCORD_BOUNTY_BOARD_WEBHOOK` is not required to start the app, but can be fetched from a member of the bounty board development team. Add it to your `.env.local` file once you have it. 