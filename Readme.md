# DSLab 2019 - Distributed Applications

Getting Started with Distributed Apps on Ethereum

## Setting up local development environment

### Node Package Manager (NPM)

*https://nodejs.org/en/*

NPM usually comes along with Node.js. Install by

```
$ brew install node
```

### Truffle Framework

*https://www.trufflesuite.com\/*

+ Allows building decentralized applications on the Ethereum blockchain.
+ Provides a suite of tools for writing smart contacts with the Solidity programming language.
+ Helps testing smart contracts and deploying them to the blockchain.
+ Gives a place to develop client-side application.

Documentations: https://www.trufflesuite.com/docs/truffle/overview

**Installing truffle**
```
$ npm install -g truffle
```

Some example commands (for reference only. You don't need to rurn these commands in our exercise):

**Create Truffle project**

```
truffle init
```

![Truffle project stucture](https://i.imgur.com/rAGG58b.png)


Or use a template at https://www.trufflesuite.com/boxes

```
truffle unbox pet-shop
```

+ **contracts\/**: Directory for Solidity contracts
+ **migrations\/**: Directory for scriptable deployment files
+ **test\/**: Directory for test files for testing your application and contracts
+ **truffle-config.js**: Truffle configuration file

**Deploy contract**

```
$ truffle migrate
```

Update contract & re-deploy

```
$ truffle migrate --reset
```

### Ganache

*https://www.trufflesuite.com/ganache*

Local in-memory blockchain

### Metamask - Chrome extension

*https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en*
Allow user to interact with blockchain

![](https://i.imgur.com/eS7MNmC.png)

Please follow Metamask steps to create a test wallet, with a test account

![](https://i.imgur.com/ad98391.png)



## Getting started with example

Make sure you have all required dependencies installed (npm, ganache, truffle, etc.).

**Installing nodejs dependencies**

Run this command in your project root. It will install all required packages for node to run. You will have **node_modules** directory at the current location after running this command.

```
$ npm install
```

**Start Ganache**

Start **ganache** with new workspace. This will create new blockchain which you can use right away.

![](https://i.imgur.com/vVaEp32.png)


**Connecting Metamask to Ganache**

By default, Ganache start a node at **HTTP://127.0.0.1:7545** (you can change this in the setting of Ganache)

![](https://i.imgur.com/KinuoB3.png)

Open Metamask, create new network with the URL provided by Ganache

![](https://i.imgur.com/Uach8Lv.png)
![](https://i.imgur.com/liOlaCE.png)

Import few accounts from Ganache to Metamask:

![](https://i.imgur.com/JNeTprD.png)
![](https://i.imgur.com/ykuOkom.png)
![](https://i.imgur.com/EdaLSAi.png)
![](https://i.imgur.com/1ClSJv4.png )


**Deploying the smart contract onto the blockchain**

```
$ truffle migrate
```

The deployment should return successful result

![](https://i.imgur.com/dYWxt3v.png)


**Verifing if the smart contract is successfully deployed**

- By unit test:

```
$ truffle test
```
![](https://i.imgur.com/5hjmbpK.png)

- By accessing the contract using truffle console

```
$ truffle console
truffle(development)> Crowdfunding.deployed().then(async (instance) => console.log((await instance.getGoal()).toString()))
100000000000000000000
undefined
truffle(development)> Crowdfunding.deployed().then(async (instance) => console.log(await instance.getDonnors()))
[
  '0x3Fc546D308A3D7617e2c2e74AABd831CA61836b6',
  '0x3Fc546D308A3D7617e2c2e74AABd831CA61836b6',
  '0x3Fc546D308A3D7617e2c2e74AABd831CA61836b6'
]
undefined
```
![](https://i.imgur.com/XRUVREp.png)

\*\* *getDonnors() should return empty array if there were no donation at first, then start listing out addresses of donors*

**Start the application**

```
$ npm run dev
```


The browser will open the app in the url **http://localhost:3000**. Make sure the connection of the application to the blockchain is not blocked by Metamask. (it's blocked by default).
![](https://i.imgur.com/Oyroq5N.png)

In this case, we need to ask metamask to allow connection of this application (from **localhost**)

![](https://i.imgur.com/OFcCc7M.png)
![](https://i.imgur.com/lKnUcEa.png )
![](https://i.imgur.com/CHJHIx7.png)
![](https://i.imgur.com/tNosHbm.png)

**Verify if application is working correctly**

Let's do some donation by clicking on the donate button. A popup of Metamask should show up to confirm the action

![](https://i.imgur.com/sdQUOC5.png)

And the statistic should be changed after the donation

![](https://i.imgur.com/6twRClc.png)
