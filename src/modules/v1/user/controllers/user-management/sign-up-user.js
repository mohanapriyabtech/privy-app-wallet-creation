import { responseHandler } from "../../../../../utils/response-handler";
import { createSession } from "../../../../../utils/encrypt";
import { User } from "../../models/user-model";
import bcrypt from "bcrypt";
import Web3 from "web3";
import crypto from 'crypto';
import mailContent from "../../../../../utils/mail-content";
import axios from "axios";


class SignupController {
    /**
     * @description   API for user signup
     * @param {*} req /api/v1/user/signup
     * @param {*} res 
     */
    async create(req, res) {
        try {
            const email = req.body.email.toLowerCase(); // Normalize the email if needed
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                return responseHandler.errorResponse(res, {}, "Email already exists", 400);
            }
            const { is_being_affilate, is_being_campaigner,password, is_crypto_user, ...otherFields } = req.body;
            // Hash the password before saving
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const userPayload = {
                ...otherFields,
                email: email,
                password: hashedPassword,
                is_being_affilate,
                is_being_campaigner,
               // affilate_code: null,
            };

            if (is_being_affilate) {
                const generatedCode = await generateUniqueCode();
                userPayload.affilate_code = generatedCode;
                console.log(userPayload.affilate_code);

            }
            if (is_being_campaigner) {
                const campaigner_code = await generateCampaignerCode(User);
                userPayload.campaigner_code = campaigner_code;
            }

            if (!is_crypto_user) {
                try {
                    const walletDetails = await createWallet();
                    userPayload.wallet_address = [];
                    userPayload.wallet_address.push(walletDetails?.address);
                    userPayload.wallet_id = walletDetails?.id
                } catch (walletErr) {
                    return responseHandler.errorResponse(res, {}, "Wallet creation failed. Please try again later.", 500);
                }
            }



            const user = await User.create(userPayload);
            if (user) {
                const session = await createSession(user);
  
                // Run the function
              // const applicantId = await createApplicant(user.first_name,user.last_name);  
              // await User.findByIdAndUpdate(user._id, { applicant_id: applicantId }, { new:true })

              
                return responseHandler.successResponse(res, { user, session }, "User Registered Successfully", 200);
            } else {
                return responseHandler.errorResponse(res, {}, "User creation failed", 200);
            }
        } catch (err) {
            console.error(err);
            return responseHandler.errorResponse(res, err);
        }
    }
}

export default new SignupController();


export const generateUniqueCode = async () => {
    const randomCode = crypto.randomBytes(Math.ceil(8 / 2))
        .toString('hex')
        .slice(0, 8)
        .toUpperCase();
    return `Jilai-${randomCode}`;
}




 const createApplicant = async (first_name,last_name) => {
    try {
    
        const response = await axios.post("https://api.us.onfido.com/v3.6/applicants", {
            first_name: first_name,
            last_name: last_name,
        }, {
            headers: {
                Authorization: `Token token=${process.env.ONFIDO_API_KEY}`,
                "Content-Type": "application/json",
            },
        });

        console.log("✅ New Applicant Created:", response.data);
        createWallet();
        return response.data.id;
    } catch (error) {
        console.error("❌ Error Creating Applicant:", error.message);
        throw new Error(`Error creating applicant: ${error.message}`);
        
    }
};



 const generateUniqueId = () => {
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000); // 8 digits
    return `C_${ randomNumber }`;
};

export const generateCampaignerCode = async (user) => {
    let uniqueId;
    let exists = true;

    while (exists) {
        uniqueId = generateUniqueId();
        const existing = await user.findOne({ yourUniqueField: uniqueId }); // replace yourUniqueField
        if (!existing) exists = false;
    }

    return uniqueId;
};




async function createWallet() {
  try {

    const apiKey = process.env.PRIVY_API_KEY;
    const apiSecret = process.env.PRIVY_SECRET_KEY;
    // Step 1: Get Authorization Token
    const authString = `${apiKey}:${apiSecret}`;
    const encodedAuth = Buffer.from(authString).toString('base64');

    console.log(`Encoded Authorization: ${encodedAuth}`);

    // Body param
    const requestBody = {
        chain_type: 'ethereum'
    };

    // Step 2: Create Wallet
    const walletResponse = await axios.post(
      'https://api.privy.io/v1/wallets',
        requestBody,
      {
        headers: {
          'Authorization': `Basic ${encodedAuth}`,
          'Content-Type': 'application/json',
          'privy-app-id': apiKey
        }
      }
    );

    console.log('Wallet Created:', walletResponse.data);
    return walletResponse.data;
  } catch (error) {
    console.error('Error creating wallet:', error.response?.data || error.message);
    throw new Error('Wallet creation failed');
  }
}


