const router = require('express').Router()
const {getUsers,deleteUser}=require('../models/admin')
const {userRegister, userAuth, checkRole} = require('../utils/Auth')
router.get("/users", async (req, res) => {
    let users;
    try {
        users = await getUsers();

    } catch (err) {
        console.log(err)

        return res.status(500).json({ success: false, msg: `fialed to fetch users ${err}` })

    }
    res.status(200).json({ success: true, msg: users })


})



// the first Registeration  is done by the admin 

router.post("/register",userAuth,checkRole(["admin"]), async (req, res) => {
    await userRegister(req.body, req.body.role, res);
});


router.delete("/user/:id", async (req, res) => {
    try {
        const userId = req.params.id

        const response = await deleteUser( userId)
        if (!response)
            return res.status(501).json({ success: false, msg: `fialed to delete user no matches` })


        return res.status(200).json({ success: true, msg: "users deleted successfully" })


    }
    catch (err) {
        return res.status(500).json({ success: false, msg: `fialed to delete user ${err}` })

    }
})
module.exports = router;
