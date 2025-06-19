import Web3 from "web3";
import { responseHandler } from "../../../../../utils/response-handler";
import { User } from "../../models/user-model";
import axios from 'axios';


const web3 = new Web3(new Web3.providers.WebsocketProvider("wss://eth-sepolia.g.alchemy.com/v2/BPICn6Du2Z3RJj7yCI8F6iISH389bjTw"));


class CreateBuyTransactionController {

    /**
      * @description   api to make buy transaction
      * @param {*} req 
      * @param {*} res 
      */

    async create(req, res) {

        try {
            
                const wallet_id = req.query.wallet_id
            


    const apiKey = process.env.PRIVY_API_KEY;       // your privy-app-id
    const apiSecret = process.env.PRIVY_SECRET_KEY; // your privy-app-secret

    // Encode Authorization
    const authString = `${apiKey}:${apiSecret}`;
    const encodedAuth = Buffer.from(authString).toString('base64');
    const amountInEth = 0.1;
     const valueInWei = (BigInt(Number(amountInEth) * 1e18)).toString();

    // Define your transaction data
    const requestBody = {
      method: "eth_sendTransaction",
      caip2: "eip155:11155111", // Sepolia testnet
      chain_type: "ethereum",
      params: {
        transaction: {
          to: "0x285568EDd848676Db31c14343dE177326506C021", // Replace with actual recipient
          value: valueInWei // 0.001 ETH in wei
        }
      }
    };

    const response = await axios.post(
      `https://api.privy.io/v1/wallets/${wallet_id}/rpc`,
      requestBody,
      {
        headers: {
          'Authorization': `Basic ${encodedAuth}`,
          'Content-Type': 'application/json',
          'privy-app-id': apiKey
        }
      }
    );

    console.log("✅ Transaction sent:", response.data);





            // const result = await checkWalletBalance(walletAddress);
            // if(result){
            //     return responseHandler.successResponse(res, result, "Wallet details retrived successfully", 200);
            // } else{
            //     return responseHandler.errorResponse(res, {}, "Wallet details not found", 400);
            // }
        }
        catch (err) {
            console.error(err);
            return responseHandler.errorResponse(res, err);
        }

    }
}

export default new CreateBuyTransactionController();

