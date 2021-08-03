require("dotenv").config();
const { ApolloClient } = require("apollo-client");
const { InMemoryCache } = require("apollo-cache-inmemory");
const { createHttpLink } = require("apollo-link-http");
const fetch = require("node-fetch");
const gql = require("graphql-tag");
const Web3 = require("web3");
const abi = require("./dividend.json");
const BigNumber = require("bignumber.js");

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_HALF_FLOOR });

const web3 = new Web3(
  new Web3.providers.WebsocketProvider(process.env.PROVIDER_URI)
);
const contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);
const moderator = web3.eth.accounts.privateKeyToAccount(
  "0x" + process.env.MODERATOR_KEY
);
web3.eth.accounts.wallet.add(moderator);
web3.eth.defaultAccount = moderator.address;

const client = new ApolloClient({
  link: createHttpLink({ uri: process.env.GRAPH_ENDPOINT, fetch }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

const query = gql`
  {
    accounts(where: { balance_gte: 20 }) {
      id
      balance
    }
  }
`;

const distribute = async () => {
  const time = new Date().toUTCString();
  console.log(">>>>> " + time + " <<<<<");

  try {
    const result = await client.query({
      query,
      fetchPolicy: "cache-first",
    });

    const dividend = new BigNumber(
      await web3.eth.getBalance(process.env.CONTRACT_ADDRESS)
    );

    const users = [];
    const amounts = [];
    const balances = [];
    let sum = 0;

    (result.data.accounts || []).forEach(({ id, balance }) => {
      users.push(id);
      balances.push(parseInt(balance));
      sum += parseInt(balance);
    });

    balances.forEach((balance) => {
      amounts.push(dividend.times(balance).dividedBy(sum).decimalPlaces(0));
    });

    await contract.methods
      .distribute(users, amounts)
      .send({ from: moderator.address, gas: 560000 })
      .on("transactionHash", console.log)
      .on("receipt", () => console.log("Success"))
      .on("error", () => console.error("Failure"));
  } catch (e) {
    console.error(e.toString());
  } finally {
    console.log("=========================================\n");
    process.exit(0);
  }
};

distribute();
