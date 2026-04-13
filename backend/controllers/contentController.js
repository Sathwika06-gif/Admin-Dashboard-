const Content = require('../models/content');

exports.create = async (req,res)=>{
  const data = new Content(req.body);
  await data.save();
  res.json(data);
};

exports.getAll = async (req,res)=>{
  const data = await Content.find();
  res.json(data);
};