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

#### User Experience Flow

The User Experience flow with accompanying bounty status is as follows:

1. **Open**: Bounty creator creates new bounty; status is now "Open" in Discord.
2. **Publish/Open**: Bounty creator clicks thumbs up emoji in Discord, bounty published to #🧀-bounty-board channel and website (url provided); status is still "Open" on website.
3. **Claim/In Progress**: Within #🧀-bounty-board Bounty _claimer_ click black flag emoji to 'start', card changes color in Discord, Bounty creator receives message that bounty has been claimed; Bounty card on website now has _Claimed By_; card status is now "In Progress".
4. **Complete/In Review**: Bounty claimer hits green check mark in Discord, receives auto-generated message from Bot indicating "bounty in review"; card status is now "In Review". Bounty claimer informed to look for follow-up message from Bounty creator.
5. **Submit/In Review**: Alternative to previous step, user can submit directly through a new bot command `/bounty submit`, entering `HashId`; card status is now "In Review".
6. **Complete/Completed**: Bounty claimer can signal completion directly through a new bot command `/bounty complete true`; card status is now "Completed".

#### Bot Commands

1. Within The Bankless Bot Garage, head to #spam-tastic
2. Enter `/` and see a list of Bots pop up, choose `SERENDIPITY MK-I`

The following commands are available for Serendipity MK-I:

/bounty create new
/bounty create open
/bounty claim
/bounty complete
/bounty list
/bounty delete
/bounty submit

##### Create New

TBD

##### Create Open

TBD

##### Claim

TBD

##### Complete

TBD

##### List

TBD

##### Delete

TBD

##### Submit

TBD
