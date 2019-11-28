import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {

  if(!req.body.email || !req.body.password) {
    return res.status(400).send({message: 'Email and password required'});
  }

  try {
    const user = await User.create(req.body)
    const token = newToken(user)
    res.send({token})
  } catch(err) {
    console.error(err);
    res.status(400).end();
  }
}

export const signin = async (req, res) => {
  if(!req.body.email || !req.body.password) {
    return res.status(400).send({message: 'Email and password required'});
  }

  
  const user = await User.findOne({email: req.body.email}).exec();
  if(!user) {
    return res.status(401).end();
  }

  try {
    const match = user.checkPassword(req.body.password)
    if(!match) {
      return res.status(401).send({ message: "Incorrect Password" });
    }

    const token = newToken(user);
    return res.status(200).send({token})
  } catch(e) {
    console.error(e);
    return res.status(401).send({ message: "Incorrect Password" })
  }
}

export const protect = async (req, res, next) => {
  let token = req.headers.authorization.split('Bearer ')[1];

  if(!token) {
    res.status(401).send({message: "Token Missing"});
  } 

  try {
    const payload = await verifyToken(token);
    const user = await User.findById(payload.id)
            .select("-password") // removes the password from the payload
            .lean() // converts mongoose document to JSON format
            .exec() // converts it into a proper promise.

    req.user = user
    next();
  } catch(e) {
    console.error(e);
    return res.status(401).send({message: 'User not found'});
  }
}
