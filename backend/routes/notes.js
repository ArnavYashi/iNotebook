const express = require("express")
const router = express.Router();
const fetchuser = require("../middleware/fetchUser");
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');


//Route 1: Get All the Notes using: GET "/api/notes/fetchallnotes", login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})


//Route 2: Add a new  Notes using: POST "/api/notes/addnote". login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {

        const { title, description, tag } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savednote = await note.save()


        res.json(savednote)
         
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})


//Route 3: Update an existing  Notes using: PUT "/api/notes/updatenote". login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const {title,description,tag}= req.body;
    try {
        
        const newnote = {};
        if(title){newnote.title = title};
        if(description){newnote.description = description};
        if(tag){newnote.tag = tag};
        
        //find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}
        
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Not Allowed");
        }
        
        note = await Notes.findByIdAndUpdate(req.params.id,{$set: newnote}, {new:true})
        res.json({note});
    }catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    } 
})

//Route 4: Delete an existing  Notes using: DELETE "/api/notes/deletenote". login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        
        //find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}
        
        //Allow deletion only if user owns this note
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Not Allowed");
        }
        
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({"Success": "note has been deleted",note:note});
    } 
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
    }
})


module.exports = router

