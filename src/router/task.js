const express = require("express")
const Task = require('../models/task')
const User = require("../models/user")
const router = new express.Router()
const auth = require('../middleware/auth')

router.get('/tasks',auth, async (req, res) => {
    
    const match = {}  
    const sort ={}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    
    try {

       await req.user.populate({
           path:'tasks',
           match,
           options:{
               limit: parseInt(req.query.limit),
               skip: parseInt(req.query.skip),
               sort
           }
       }).execPopulate()
     
        res.send(req.user.tasks)
    }
    catch (e) {
        res.send(e).status(500)
    }
})

router.get('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id
    try {
        
        const task = await Task.findOne({_id, owner: req.user._id})
        console.log('task')
        if (!task) {
            return res.status(404).send("Error")
        }
        res.send(task)
    } catch (e) {
        res.send(e).status(500)
    }
})

router.post('/tasks', auth,async (req, res) => {
  //  const task = new Task(req.body)
  const task = new Task({
      ...req.body,
    owner : req.user._id
    
    })
    try {
        await task.save()
        res.status(201).send(task)
    }
    catch (e) {
        console.log(e)
        res.send(e)
    }
})

router.patch('/tasks/:id',auth, async (req, res) => {
    const allowedUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)

    const isValidUpdate = updates.every((update) => {
        console.log(update)
        return allowedUpdates.includes(update)
    })

    
    try {

        const task = await Task.findOne({_id: req.params.id, owner:req.user._id})
        if (!isValidUpdate) {
            return res.status(400).send()
        }
                updates.forEach((update)=> task[update] = req.body[update])

        await task.save()
        if (!task) {
            return res.status(404).send("not found")
        }
        console.log(task)
        res.send(task)
    } catch (e) {
        res.status(500).send(error)
    }

})



router.delete('/tasks/:id',auth,async (req,res)=>{
    try{
    const task = await Task.findOneAndDelete({_id: req.params.id, owner:req.user._id})
    if(!task){
        res.status(404).send()
    }
    res.send(task)
}catch(e){
    res.status(500).send(e)
}

})

module.exports=router