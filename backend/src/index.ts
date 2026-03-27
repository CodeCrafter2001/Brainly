import jwt from 'jsonwebtoken';
import express from 'express';
import {z} from 'zod';
import bcrypt from "bcrypt";
import { UserModel,LinkModel,ContentModel } from './db.js';
import { random } from './utils.js';
import cors from "cors";
import { userMiddleware } from './middleware.js';
import { JWT_PASSWORD } from './config.js';
import dotenv from "dotenv";
dotenv.config();

const app= express();
app.use(express.json());
app.use(cors());

//zod validation
const signupSchema= z.object({
    username: z.string().min(3).max(30),
    password: z.string().min(6).max(100),
})
const signinSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6).max(100),
});

//signup route
app.post("/api/v1/signup",async (req,res)=>{
const parseData= signupSchema.safeParse(req.body);
if(!parseData.success){
    return res.status(400).json({
        msg:"invail input",
        error: parseData.error.flatten(),
    });
}
   const {username,password} = parseData.data;
    try{
        const existingUser= await UserModel.findOne({username});
        if(existingUser) {
            return res.status(409).json({
                message:"user already exist",
            });
        }
        const hashedPassword= await bcrypt.hash(password,10);

        await UserModel.create({
            username: username,
            password: hashedPassword,
        })
        res.json({
            message:"User signed Up"
        })
    }catch (e) {
  return res.status(500).json({
    message: "Something went wrong during signup",
  });
}
    

})

//signup route
app.post("/api/v1/login", async (req, res) => {
  const parsedData = signinSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsedData.error.flatten(),
    });
  }

  const { username, password } = parsedData.data;

  try {
    const existingUser = await UserModel.findOne({ username });

    if (!existingUser || !existingUser.password) {
      return res.status(403).json({
        message: "Incorrect credentials",
      });
    }

    const passwordMatched = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatched) {
      return res.status(403).json({
        message: "Incorrect credentials",
      });
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
      },
      JWT_PASSWORD
    );

    return res.json({
      message: "Signin successful",
      token,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Something went wrong during signin",
    });
  }
});
//post content route
app.post("/api/v1/content",userMiddleware,async (req,res)=>{
const link= req.body.link;
const type= req.body.type;
await ContentModel.create({
    link,
    type,
    title: req.body.title,  
    userId: req.userId!,
    tags:[]
})
res.json({
    message: "content added"
})
})

// get content route
app.get ("/api/v1/content",userMiddleware, async(req,res)=>{
  // @ts-ignore
  const userId= req.userId!;
  const content= await ContentModel.find({
    userId: userId
  }).populate("userId", "username")
  res.json({
    content
  })

})

// delete content route
app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;

  await ContentModel.deleteOne({
    _id: contentId,
    userId: req.userId!,
  });

  res.json({
    message: "deleted",
  });
});

//share route
app.post ("/api/v1/brain/share",userMiddleware,async(req,res)=>{
const share= req.body.share;
if(share){
  const existingLink= await LinkModel.findOne({
    userId: req.userId!
  });
  if(existingLink){
    res.json({
      hash: existingLink.hash
    })
    return;
  }
  const hash= random(10);
  await LinkModel.create({
    userId: req.userId!,
    hash: hash

  })
  res.json({
    hash
  })
}else{
  await LinkModel.deleteOne({
    userId: req.userId!
  });
  res.json({
    message:"removed Link"
  })
}
})

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    });

    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }
    // userId
    const content = await ContentModel.find({
        userId: link.userId
    })

    console.log(link);
    const user = await UserModel.findOne({
        _id: link.userId
    })

    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        })
        return;
    }

    res.json({
        username: user.username,
        content: content
    })

})

app.listen(3000,()=>{
    console.log("server is listening on port 3000");
});