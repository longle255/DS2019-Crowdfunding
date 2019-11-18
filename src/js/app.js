function getAccount() {
  return new Promise((resolve, reject) => {
    web3.eth.getCoinbase(function(err, account) {
      if (err) return reject(err);
      return resolve(account);
    });
  });
}
App = {
  web3Provider: null,
  contracts: {},

  account: null,
  contract: null,

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return await App.initContract();
  },

  initContract: async function() {
    try {
      const crowdfunding = await $.getJSON('Crowdfunding.json');
      // Instantiate a new truffle contract from the artifact
      App.contracts.Crowdfunding = TruffleContract(crowdfunding);
      // Connect provider to interact with contract
      App.contracts.Crowdfunding.setProvider(App.web3Provider);

      // Get the contract instance
      App.contract = await App.contracts.Crowdfunding.deployed();
      // Get current account provided by Metamask
      App.account = await getAccount();
      // Check if current account is the owner of the contract
      App.isOwner = await App.contract.isOwner(App.account);
      // Check if the campaign is still running
      App.isCampaignLive = await App.contract.isCampaignLive();

      // Listening for Donation event in the contract
      App.contract.Donation().watch(async (err, event) => {
        // if owner is using the app, print a notification on screen
        if (App.isOwner) $.notify(`Address ${event.args.donor} donated ${web3.fromWei(event.args.amount)}`, 'success');
        // re-render the page with new data
        return await App.render();
      });

      // Listening for CampaignEnd event in the contract
      App.contract.CampaignEnded().watch(async (err, event) => {
        $.notify(`We have reached our goal. Campaign ended`, 'success');
        App.isCampaignLive = false;
      });

      return await App.render();
    } catch (e) {
      console.log(e);
    }
  },

  donate: async function(amount) {
    if (!App.isCampaignLive) return $.notify(`Campaign has ended`, 'warn');
    bootbox.confirm(`You are going to send <b>${amount}</b> ETH!`, function(result) {
      if (!result) return;
      App.contract
        .donate(App.account, { from: App.account, value: web3.toWei(amount, 'ether') })
        .then(App.render)
        .catch(e => {
          console.log(e);
        });
    });
  },

  fetchData: async function() {
    try {
      App.goal = web3.fromWei((await App.contract.getGoal()).toNumber() || 0, 'ether');
      App.sum = web3.fromWei((await App.contract.getSum()).toNumber() || 0, 'ether');
    } catch (e) {
      console.log(e);
    }
  },

  render: async function() {
    await App.fetchData();
    var loader = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    $('#accountAddress').html('Your Account: ' + App.account);
    $('#goal').text(App.goal + ' ETH');
    $('#sum').text(App.sum + ' ETH');
    $('#percent').attr('data-percent', Math.round((App.sum / App.goal) * 100));
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });

  $('#donate').submit(e => {
    e.preventDefault();
    const val = $('#donate-box').val();
    if (!val || !val.length || isNaN(val)) return $.notify(`[${val}] is not a valid amount`, 'warn');
    if (!App.isCampaignLive) return $.notify(`Campaign has ended`, 'warn');
    App.donate(val);
  });
});
