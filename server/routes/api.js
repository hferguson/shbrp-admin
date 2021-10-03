/**
 * This file defines our REST API 
 */
const express = require("express");
const router =  express.Router();
const BylawReports = require('../models/reports');
require('dotenv').config();

router.get('/reports', (req, res, next) => {
    BylawReports.find({})
    .then((data) => res.json(data) )        // send data back as a JSON array
    .catch(next);           // todo, figure out what next is
});

router.post('/reports/:id', (req, res, next)=> {
    const id = req.params.id;
    const body = req.body;
    console.log(`Report if ${id} being updated with this data`);
    console.log(body);
    BylawReports.updateOne({_id: id}, 
                            {$set: body},
                            {upsert:true})
    .then(data=> res.json(data))
    .catch(error => console.log(error));
});

router.delete('/reports/:id', (req, res, next) => {
    BylawReports.findOneAndDelete({ _id: req.params.id })
    .then((data) => {
            console.log(`deleted item with IF ${req.params.id}`);
            return res.json(data);
    })
    .catch(error => {error: error});
});

module.exports = router;