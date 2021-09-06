// checking whether the user have logged in or not! by getting the token which is stored in session storage(front-end) through request headers and checking it with the previosly stored secret!

// As the acessToken has both the username and password, we need to assign it to req.user in order to see which comment is posted by which user!

const {verify} = require("jsonwebtoken");

const validateToken = (req, res, next) => {
   const accessToken = req.header("accessToken");
   
   if(!accessToken) {
       return res.json({ error: "User not logged in!"})
   }

   try {
       const validToken = verify(accessToken, "importantsecret")
       req.user = validToken;

       if(validToken) {
           return next();
       }
   } catch (err) {
       return res.json({error: err})
   }
}

module.exports = { validateToken };