import RefreshToken from "../Model/TokenModel.js"
import Users from "../Model/UserModel.js"
import { generateAccessToken, generateRefreshToken } from "../Utils/Token.js"


const SignService={
    signUp:async(email,password)=>{
        try {
           const db =new Users({
            email,
            password:await bcrypt.hash(password, 10),
           })
           db.save()
           return ({message:"user signed"})
        } catch (error) {
            console.error(error)
        }
    },
    signIn: async (email, password) => {
        try {
          const signUp = await Users.findOne({ email });
    
          if (!signUp) {
            return { message: "wrong e-mail" };
          }
          if (bcrypt.compareSync(password, signUp.password)) {
            const accessToken = generateAccessToken(signUp);
    
            const refreshToken = generateRefreshToken(signUp);
            const newToken = new RefreshToken({
              userId: signUp._id,
              token: refreshToken,
            });
    
            await RefreshToken.deleteMany({});
            newToken.save();
    
            return {
              accessToken: accessToken,
              refreshToken: refreshToken,
              message: "Logged In",
            };
          } else {
            return { message: "wrong password" };
          }
        } catch (error) {
          console.error(error);
        }
      },
      refresh: async (refreshToken) => {
        try {
          if (refreshToken) {
            const token = await RefreshToken.findOne({ token: refreshToken });
            if (!token) {
              return { message: "User not logged" };
            }
            const decodedToken = jwt.verify(
              refreshToken,
              process.env.REFRESH_TOKEN
            );
    
            await RefreshToken.findOneAndDelete({ token: refreshToken });
            const newAccessToken = generateRefreshToken({
              _id: decodedToken._id,
              email: decodedToken.email,
            });
            const newRefreshToken = generateAccessToken({
              _id: decodedToken._id,
              email: decodedToken.email,
            });
            const newRefreshTokenMongoDB = new RefreshToken({
              userId: decodedToken._id,
              token: newRefreshToken,
            });
            await newRefreshTokenMongoDB.save();
    
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
          } else {
            return { message: "not logged in" };
          }
        } catch (error) {
          console.error(error);
        }
      },
      logout: async (refreshToken) => {
        try {
          if (refreshToken) {
            const token = await RefreshToken.findOneAndDelete({
              token: refreshToken,
            });
            return { message: "Logout succesful" };
          } else {
            return { message: "Invalid Token" };
          }
          // if (!token) {
          //   await RefreshToken.deleteMany({});
          //   return { message: "User out" };
          // } else {
    
          //   return { message: "Logout succesful" };
          // }
        } catch (error) {
          console.error(error);
        }
      },
}

export default SignService