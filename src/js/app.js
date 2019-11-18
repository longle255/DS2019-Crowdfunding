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
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Crowdfunding.json', function(crowdfunding) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Crowdfunding = TruffleContract(crowdfunding);
      // Connect provider to interact with contract
      App.contracts.Crowdfunding.setProvider(App.web3Provider);

      return App.render();
    });
  },

  donate: async function () {
    if (!confirm("Send 1 ETH?")) return;
    let ret = await App.contract.donate(App.account, {from: App.account, value: web3.toWei("1", "ether")})
    console.log(ret);
    return App.render();
  },

  render: async function() {
    var loader = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $('#accountAddress').html('Your Account: ' + account);
      }
    });

    // Load contract data
    try {
      App.contract = await App.contracts.Crowdfunding.deployed();
      const goal = web3.fromWei((await App.contract.getGoal()).toNumber() || 0, "ether");
      const sum = web3.fromWei((await App.contract.getSum()).toNumber() || 0, "ether");
      $('#goal').text(goal + ' ETH');
      $('#sum').text(sum + ' ETH');
      $('#percent').attr('data-percent', Math.round(sum/goal * 100))
    } catch (e) {
      console.log(e);
    }
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });

  $('#fund').click(e=>{
    App.donate();
  });
});
