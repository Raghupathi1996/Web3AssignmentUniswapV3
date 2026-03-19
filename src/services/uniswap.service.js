const { web3, account } = require('../config/web3');
require('dotenv').config();
// Minimal ABIs
const ERC20_ABI = require('../contract/ERC20ABI.json');
const QUOTER_ABI = require('../contract/UniswapV3QuoterABI.json');

const UNI_ADDRESS = process.env.UNI_ADDRESS;
const WETH_ADDRESS = process.env.WETH_ADDRESS;
const QUOTER_ADDRESS = process.env.QUOTER_ADDRESS;

const uniToken = new web3.eth.Contract(ERC20_ABI, UNI_ADDRESS);
const quoterContract = new web3.eth.Contract(QUOTER_ABI, QUOTER_ADDRESS);

const getUniBalance = async () => {
    try {
        const WALLET_ADDRESS = '0xd9D5528bc2F7E8391d10dc292f33684592f08bbF';
        const checkedAddress = web3.utils.toChecksumAddress(WALLET_ADDRESS);
        
        const balance = await uniToken.methods.balanceOf(checkedAddress).call();
        
        var balanceEther = web3.utils.fromWei(balance.toString(), "ether");
        return balanceEther;
        
    } catch (error) {
        console.error("Error fetching UNI balance:", error);
        return "0";
    }
};

const getEthQuoteForUni = async (amountUni) => {
    const amountOut = web3.utils.toWei(amountUni, 'ether');
    
    const path = web3.utils.encodePacked(
        { value: UNI_ADDRESS, type: 'address' },
        { value: 3000, type: 'uint24' },
        { value: WETH_ADDRESS, type: 'address' }
    );

    try {

        const amountIn = await quoterContract.methods.quoteExactOutput(path, amountOut).call();
        var amountInEther = web3.utils.fromWei(amountIn[0].toString(), "ether");
        return amountInEther;
    } catch (error) {
        console.error("Quote Error:", error);
        return "0";
    }
};

module.exports = { getUniBalance, getEthQuoteForUni };