import SignService from "../SignService/SignService.js"



const SignController={
    signUp:async(req,res)=>{
        try {
            const {email,password}=req.body
            const result=await SignService.signUp(email,password)
            res.status(200).send(result)
        } catch (error) {
            console.error(error)
        }
    },
    signIn: async (req, res) => {
        try {
          const { email, password } = req.body;
    
          const signInUser = await SignService.signIn(email, password);
    
          // res.cookie("token", signInUser.token, {
          //   httpOnly: true,
          //   sameSite: "strict",
          //   // secure: true
          // });
    
          res.status(201).send(signInUser);
        } catch (error) {
          console.error(error);
        }
      },
      refresh: async (req, res) => {
        try {
          const { refreshToken } = req.body;
    
          const token = await SignService.refresh(refreshToken);
    
          res.status(200).send(token);
        } catch (error) {
          console.error(error);
        }
      },
      logout: async (req, res) => {
        try {
          const { refreshToken } = req.body;
          //   const token = req.cookies.token;
    
          const logoutuser = await SignService.logout(refreshToken);
    
          res.status(200).send(logoutuser);
        } catch (error) {
          console.error(error);
        }
      },
}
export default SignController