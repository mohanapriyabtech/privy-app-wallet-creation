import { responseHandler } from '../../../../../utils/response-handler';
import { createSession } from '../../../../../utils/encrypt';
import { User } from '../../models/user-model';
import bcrypt from 'bcrypt';
import Web3 from "web3";
import { helper } from '../../../../../utils/socket.io-helper';
import { EVENTS } from '../../../../../config/socket';

class LoginController {

    /**
     * @description   api to user login
     * @param {*} req /api/v1/user/login
     * @param {*} res 
     */

    async get(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email: email.toLowerCase() });

            if (!user) {
                return responseHandler.errorResponse(res, {}, "No user exists with this email address", 400);
            }
            if (!user.password) {
                return responseHandler.errorResponse(res, {}, "User has no password set", 400);
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            
            if (!isPasswordMatch) {
                return responseHandler.errorResponse(res, {}, "Incorrect password", 400);
            }

            const session = await createSession(user);
            // helper.sendToSocketClient(user._id.toString(), EVENTS.TESTING, user)
            return responseHandler.successResponse(res, { user, session }, "User logged in successfully", 200);
        } catch (err) {
            console.error(err);
            return responseHandler.errorResponse(res, err);
        }
    }
}

export default new LoginController();
