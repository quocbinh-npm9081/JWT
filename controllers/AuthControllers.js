const bcrypt = require('bcrypt');
const userModel = require('../models/User');
const jwt = require('jsonwebtoken');
let refreshTokens = [];
class AuthControllers {

    async register(req, res) {

        const { username, email, password } = req.body;

        const saltRounds = 10;

        try {

            const salt = await bcrypt.genSalt(saltRounds);

            const hashed = await bcrypt.hash(password, salt)

            const user = new userModel({
                username: username,
                email: email,
                password: hashed
            })

            await user.save();
            console.log("add user gone")
            res.status(200).json(user)

        } catch (error) {
            res.status(500).json(error);
        }
    }


    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await userModel.findOne({ email: email })

            if (!user) {
                res.status(404).json("user not found")
            }

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) res.status(404).json("password not valid");

            if (user && validPassword) {


                const { password, ...others } = user._doc;

                const accessToken = jwt.sign({
                    id: user.id,
                    admin: user.admin
                }, process.env.JWT_SECRET_KEY, {
                    expiresIn: "1d"
                });
                console.log("accessToken: ", accessToken);
                const refreshToken = jwt.sign({
                    id: user.id,
                    admin: user.admin
                }, process.env.JWT_SECRET_REFRESH_KEY, {
                    expiresIn: "356d"
                });
                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken, { //< luu refresh token vao` cookie
                    httpOnly: true,
                    path: "/",
                    sameSite: "strict",
                    secure: false
                })
                res.status(200).json({...others, accessToken, refreshToken });

            }
        } catch (error) {
            res.status(500).json(error);
        }
    }


    async requestRefreshToken(req, res) {
        //Take refresh token from user
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json("You are not authencated")
        if (!refreshTokens.includes(refreshToken)) return res.status(401).json("Refresh token is not valid")
        jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_KEY, (err, user) => {
            if (err) {
                console.log(err);
            }

            //create new access token
            const newAccessToken = jwt.sign(
                user,
                process.env.JWT_SECRET_KEY, {
                    expiresIn: "1d"
                }
            )
            const newRefreshToken = jwt.sign(
                user,
                process.env.JWT_SECRET_REFRESH_KEY, {
                    expiresIn: "365d"
                }
            )
            refreshTokens = refreshTokens.filter(token => token != refreshToken);
            refreshTokens.push(newRefreshToken);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                path: "/",
                sameSite: "strict",
                secure: false
            })

            res.status(200).json({ newAccessToken });

        })
    }
}

//STORE TOKEN
//1) Local Storage ( de bi loi tan cong XSS)
//2) Cookie (de bi tan cong CSRF => su dung Samesite de khac phuc)
//3) REDUX STORE -> accessTtoken , HTTPonly Cookie -> refreshToken   || <=== nen chon cach nay
//4) BFF Partern <== back end for front end
module.exports = new AuthControllers;