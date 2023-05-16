const router = require('express').Router();

const {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend,
} = require('../../controllers/user-controller');

router
.route('/')
.get(getUsers)
.post(createUser)

router
.route('/:id')
.delete(deleteUser)
.put(updateUser)
.get(getSingleUser)

router.route('/:userId/friends/:friendId')
.delete(removeFriend)
.post(addFriend);

module.exports = router;