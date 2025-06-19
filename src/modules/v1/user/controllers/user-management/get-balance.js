import Web3 from "web3";
import { responseHandler } from "../../../../../utils/response-handler";
import { User } from "../../models/user-model";


const web3 = new Web3(new Web3.providers.WebsocketProvider("wss://eth-sepolia.g.alchemy.com/v2/BPICn6Du2Z3RJj7yCI8F6iISH389bjTw"));


class GetWalletBalanceController {

    /**
      * @description   api to get wallet balance details
      * @param {*} req 
      * @param {*} res 
      */

    async get(req, res) {

        try {
            // Replace with the wallet address created by Privy
            const walletAddress = req.query.wallet_address;

            const result = await checkWalletBalance(walletAddress);
            if(result){
                return responseHandler.successResponse(res, result, "Wallet details retrived successfully", 200);
            } else{
                return responseHandler.errorResponse(res, {}, "Wallet details not found", 400);
            }
        }
        catch (err) {
            console.error(err);
            return responseHandler.errorResponse(res, err);
        }

    }
}

export default new GetWalletBalanceController();

async function checkWalletBalance(walletAddress) {
    try {
        console.log(walletAddress)
        const balanceWei = await web3.eth.getBalance(walletAddress);
        console.log(balanceWei,"balanceWei")
        const balanceEth = web3.utils.fromWei(balanceWei, "ether");
        console.log(`Wallet ETH Balance: ${balanceEth} ETH`);
        return balanceEth;
    } catch (error) {
        console.error("Error fetching balance:", error.message);
    }
}