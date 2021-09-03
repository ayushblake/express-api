const express = require('express')
const router = express.Router()
const db = require('../database.js')

//works just like app.use()
// router.use(getSubscriberById) (This will be a middleware and will run before each endpoints actual functionality)

//Get All
router.get('/', async (req, res) => {
    try {
        // const subscribers = await db.promise().query('SELECT * FROM SUBSCRIBERS')
        // res.status(200).json(subscribers)
        //use res.send() if sending non-json content in response 
        //use res.sendStatus(500) in order to just send the status code in response
        //use res.download(filePath) in order to send a downloadable file as response
        res.render('main', { text: "Jack" }) //use this to send and html page(a view) in response //to send a view back in response we require a view engine like ejs(looks similar to html),pug. We can also send data from this js file to the html/ejs file we send in response
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
    // const nameQueryParameter = req.query.name (use this to access query parameters (Eg: - ?name=Ayush))
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

//This(router.param()) is a middleware which runs for all endpoints having a param 'Id' in our case //This middleware runs before the actual implementation hence we are required to call next() in order to function the endpoint correctly
router.param('Id', (req, res, next, id) => {
    console.log(id)
    next()
})

//We can write in this way if the endpoint/params etc. is same for all these endpoints(Just a compact way to write - by chaining the different request types)
router.route('/:Id')
    .get((req, res) => {
        res.json(res.fetchedSubscriber)
    })
    .put(async (req, res) => {

        const { name, subscribedStatus } = req.body
        try {
            await db.promise().query(`UPDATE SUBSCRIBER SET NAME ='${name}' AND SUBSCRIBEDSTATUS ='${subscribedStatus}' WHERE ID ='${req.params.Id}'`)
            res.status(200).json({ message: "Updated Subscriber" })
        }
        catch (err) {
            res.status(400).json({ message: err.message })
        }
    })
    .delete(async (req, res) => {
        try {
            await db.promise().query(`DELETE FROM SUBSCRIBER WHERE ID ='${req.params.Id}'`)
            res.status(200).json({ message: "Deleted Successfully" })
        }
        catch (err) {
            res.status(500).json({ message: err.message })
        }
    })


module.exports = router