const express = require('express')
const router = express.Router()
const db = require('../database.js')

//Get All
router.get('/', async (req, res) => {
    try {
        const subscribers = await db.promise().query('SELECT * FROM SUBSCRIBERS')
        res.status(200).json(subscribers) //use res.send() if sending non-json content in response
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Get by Id
router.get('/:Id', getSubscriberById, (req, res) => {
    res.json(res.fetchedSubscriber)
})

//Create new record
router.post('/', async (req, res) => {
    const { name, subscribedStatus } = req.body
    try {
        await db.promise().query(`INSERT INTO SUBSCRIBER VALUES('${name}','${subscribedStatus}')`)
        res.status(201).json({ message: "Created Subsciber" }) //201 status means - successfully created record
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//Updating an entire record
router.put('/:Id', getSubscriberById, async (req, res) => {

    const { name, subscribedStatus } = req.body
    try {
        await db.promise().query(`UPDATE SUBSCRIBER SET NAME ='${name}' AND SUBSCRIBEDSTATUS ='${subscribedStatus}' WHERE ID ='${req.params.Id}'`)
        res.status(200).json({ message: "Updated Subscriber" })
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//Updating specific fields in a record
router.patch('/:Id', getSubscriberById, async (req, res) => {
    try {
        if (req.body.name !== null) {
            res.fetchedSubscriber.name = req.body.name
            await db.promise().query(`UPDATE SUBSCRIBER SET NAME ='${res.fetchedSubscriber.name}'`)
            res.status(200).json({ message: "Upadeted Successfully" })
        }
        else if (req.body.subscribedStatus !== null) {
            res.fetchedSubscriber.subscribedStatus = req.body.subscribedStatus
            await db.promise().query(`UPDATE SUBSCRIBER SET SUBSCRIBEDSTATUS ='${res.fetchedSubscriber.subscribedStatus}'`)
            res.status(200).json({ message: "Upadeted Successfully" })
        }
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//Deleting a record
router.delete('/:Id', getSubscriberById, async (req, res) => {
    try {
        await db.promise().query(`DELETE FROM SUBSCRIBER WHERE ID ='${req.params.Id}'`)
        res.status(200).json({ message: "Deleted Successfully" })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})


//Middleware (We put it here because this is a common functionality which is used in multiple endpoints)
async function getSubscriberById(req, res, next) {
    let requestedSubscriber
    try {
        requestedSubscriber = await db.promise().query(`SELECT * FROM SUBSCRIBER WHERE ID ='${req.params.Id}'`)
        if (requestedSubscriber === null) {
            return res.status(404).json({ message: "Record Not Found" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.fetchedSubscriber = requestedSubscriber
    next()
}


module.exports = router