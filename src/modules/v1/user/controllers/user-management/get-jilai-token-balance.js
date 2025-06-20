import Web3 from "web3";
import { responseHandler } from "../../../../../utils/response-handler";
import { User } from "../../models/user-model";
import tokenAbi from '../../../../../abi-files/jilaiabi.json';

const web3 = new Web3(new Web3.providers.WebsocketProvider("wss://eth-sepolia.g.alchemy.com/v2/BPICn6Du2Z3RJj7yCI8F6iISH389bjTw"));
// Token contract address
const tokenAddress = '0xA35D352947e762D2bEe824997d42026fDaFDccfA';

// Create contract instance
const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);

class GetWalletTokenBalanceController {

    /**
      * @description   api to get wallet balance details
      * @param {*} req 
      * @param {*} res 
      */

    async get(req, res) {

        try {


            // Replace with the wallet address created by Privy
            const walletAddress = req.query.wallet_address;

            const result = await getTokenBalance(walletAddress);
            if (result) {
                return responseHandler.successResponse(res, result, "Wallet details retrived successfully", 200);
            } else {
                return responseHandler.errorResponse(res, {}, "Wallet details not found", 400);
            }
        }
        catch (err) {
            console.error(err);
            return responseHandler.errorResponse(res, err);
        }

    }
}

export default new GetWalletTokenBalanceController();



// Get balance
async function getTokenBalance(walletAddress) {
    try {
        const balance = await tokenContract.methods.balanceOf(walletAddress).call(); // string
        const decimals = await tokenContract.methods.decimals().call();              // string or number

        const balanceBigInt = BigInt(balance);       // e.g., 21292245000000000000n
        const decimalsInt = parseInt(decimals);      // e.g., 18

        const balanceStr = balanceBigInt.toString().padStart(decimalsInt + 1, '0');

        const integerPart = balanceStr.slice(0, -decimalsInt) || '0';
        const fractionalPart = balanceStr.slice(-decimalsInt).slice(0, 6); // Limit to 6 decimals

        const formatted = `${integerPart}.${fractionalPart}`;

        console.log("Raw:", balanceBigInt.toString());
        console.log("Formatted:", formatted);

        return {
            raw: balanceBigInt.toString(),
            formatted
        };

    } catch (error) {
        console.error('Error fetching token balance:', error);
        throw error;
    }
}



