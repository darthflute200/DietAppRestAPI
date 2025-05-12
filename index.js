require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const User = require("./Mongo/User")
const bcrypt = require("bcrypt");
const cors = require('cors');
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB'ye başarıyla bağlandı"))
  .catch((err) => console.error("MongoDB bağlantı hatası:", err));
  
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.post("/api/signup" , async(req,res) =>{
    const hashedPassword = await bcrypt.hash(req.body.Password, 10);
    try{
       const user = await User.create({
        name: req.body.name,
        Surname: req.body.Surname,
        email: req.body.Email,
        password: hashedPassword
       })
       const newUser = {
        userId:  user._id,
        name: user.name,
        surname: user.Surname
      }
      res.json({user: newUser})
    }
    catch(error){
        console.log(error);
    }
})
app.post("/api/signin" , async(req,res) =>{
    try{
        const user = await User.findOne({email : req.body.email})
        if(user){
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if(isMatch){
                const newUser = {
                    userId:  user._id,
                    name: user.name,
                    surname: user.Surname
                  }
                res.json({user: newUser})
            }
        }
    }
    catch(error){
        console.log(error);
    }
})
app.post("/api/savefood/:userid" , async(req,res) =>{
    try{
        const user = await User.findById(req.params.userid);
        if(!user){
            return;
        }
        const newFoodItem = {
            brand: req.body.brand,
            name: req.body.name,
            energy: req.body.energy,
          };
      
          
          user.FoodList.push(newFoodItem);
      
          await user.save();
          res.json({message: "Başarılı"});
    }
    catch(error){
        console.log(error);
    }
})
app.get("/api/getfood/:userid" ,async(req,res) =>{
    try{
        const user = await User.findById(req.params.userid);
        if(!user){
            return
        }
        const foodlist = user.FoodList;
        res.json({Foods: foodlist})
    }
    catch(error){
        console.log(error);
    }
})
app.delete('/api/deletefood/:userid/:index', async (req, res) => {
    const { userid, index } = req.params;  
  
    try {
      const user = await User.findById(userid);
      if (!user) {
        return 
      }
      user.FoodList.splice(index, 1);  
      await user.save();  
  
      res.json({message: "Başarılı"})
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  app.post("/api/drankwater/:userid" , async(req,res) =>{
    try{
        const user = await User.findById(req.params.userid);
        user.CurrentWater = req.body.currentWater;
        user.save()
        res.json({message:"Başarılı"})
    }
    catch(error){
        console.log(error);
    }
  })
  app.post("/api/totalwater/:userid" , async(req,res) =>{
    try{
        const user = await User.findById(req.params.userid);
        user.TotalWater = req.body.totalWater;
        user.save()
        res.json({message:"Başarılı"})
    }
    catch(error){
        console.log(error);
    }
  })
  app.get('/api/waterinfo/:userId', async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);
  
    res.json({
      currentWater: user?.CurrentWater ?? 0,
      totalWater: user?.TotalWater ?? 0
    });
  });
app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});