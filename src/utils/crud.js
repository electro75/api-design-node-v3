export const getOne = model => async (req, res) => {
  const id = req.params.id;
  const userId = req.user_id;

  const data = await model.findOne({_id: id, createdBy: userId}).exec();
  if(!data) {
    res.status(404).end()
  }

  res.status(200).json({data})
}

export const getMany = model => async (req, res) => {
  let userId = req.user_id;

  const data = await model.find({createdBy: userId}).exec();
  if(!data) {
    res.status(404).end();
  }

  res.status(200).send({data});
}

export const createOne = model => async (req, res) => {
  const data = req.body;

  try{
    const bool = await model.create(data, {new: true}).exec();
    res.send({message: 'added'});
  } catch(err) {
    res.send(401).end();
  }
  
  
}

export const updateOne = model => async (req, res) => {
 const id = req.params.id; 
 const userId = req.user_id;

 const data = await model.updateOne({ _id: id, createdBy: user_id }, req.body, {new: true})

 if(!data) {
   res.status(404).end();
 } else {
   res.status(201).json({data});
 }
}

export const removeOne = model => async (req, res) => {
  const data = await model.delete({_id: req.params.id})

  res.status(200).json({data});
}

export const crudControllers = model => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model)
})
