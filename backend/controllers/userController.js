import User from "../models/User.js";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

dotenv.config()
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString()
}

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: process.env.NODEMAILER_USERNAME,
      pass: process.env.NODEMAILER_PASSWORD,
  }
});

let otp_storage=[]

const login = async (req, res) => {
  try {
    // validate request body
    if (!req.body.email || !req.body.password) {
      return res
        .status(404)
        .json({ message: "Error: email/password field not found" });
    }

    // search for user
    const searchUser = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (searchUser === null) {
      return res.status(400).json({ message: "Error: failed to authenticate" });
    }

    const otp = generateOTP();
    otp_storage[req.body.email]=otp

        // Send OTP via Email
        await transporter.sendMail({
            from: process.env.NODEMAILER_USERNAME,
            to: req.body.email,
            subject: "Your OTP Code",
            text: `Your OTP is: ${otp}. It is valid for 5 minutes.`
        });

        return res.status(200).json({ message: "OTP sent successfully!" }); 
    } catch (error) {
        return res.status(500).json({ message: "Error sending OTP", error: error.message });
    }
  };

const verifyotp = async (req,res) => {
  dotenv.config();

    const { email, otp } = req.body;

    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    try {
      const stored_otp=otp_storage[email]
      if (!stored_otp){
        return res.status(400).json({message: "Invalid email, no otp registered"})
      }
      if(otp!=stored_otp){
        return res.status(400).json({message:"Otp did not match"})
      }
      delete otp_storage[email]
    
    const token = jsonwebtoken.sign(
      { email:email },
      process.env.JWT_KEY,
      {
        expiresIn: 60 * 60,
        issuer: "https://localhost:5173/api/auth",
        audience: "https://localhost:3000/login",
      }
    );
    return res.status(200).json({ message: token });
  } catch (err) {
    console.log(`Error in login function - ${err.message}`);
    return res.sendStatus(400);
  }
}


const signup = async (req, res) => {
  try {
    // validate request body
    if (!req.body.email || !req.body.password) {
      return res
        .status(404)
        .json({ message: "Error: email/password field not found" });
    }
console.log(req.body)
    // check for unique email
    const searchUser = await User.findOne({ email: req.body.email });
    if (searchUser != null) {
      return res
        .status(400)
        .json({ message: "Error: A user with this email already exists" });
    }

    // save user
    const newUser = new User(req.body);
    await newUser.save();
    return res.status(200).json({message:"Resgistation successful"})
  } catch (err) {
    console.log(`Error in signup function - ${err.message}`);
    return res.sendStatus(400);
  }
};
export { login, verifyotp, signup };
