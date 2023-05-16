const {Thought, User} = require('../models');
const { populate } = require('../models/User');


const userControllers = {
    getUsers(req, res) {
        User.find()
        .populate({ path: 'thoughts', select: '-__v'})
        .populate({ path: 'friends', select: '-__v'})
            .then(dbUserData => res.json(dbUserData))
            .catch((err) => res.status(500).json(err));
    },
    getSingleUser({params}, res) {
        User.findOne({_id: params.id})
            .populate({ path: 'thoughts', select: '-__v', populate: {path: 'reactions'}})
            .populate({ path: 'friends', select: '-__v'})
            .select('-__v')
            .then(dbUserData => dbUserData ? res.json(dbUserData) : res.status(404).json({ message: 'No user found with that ID' }))
            .catch((err) => res.status(500).json(err));
    },
    createUser({body}, res) {
        User.create({username: body.username, email: body.email})
          .then(dbUserData => res.json(dbUserData))
          .catch((err) => res.status(500).json(err));
    },
    deleteUser({params}, res) {
        User.findOneAndDelete({_id: params.id })  
          .then(dbUserData => {
            if (!dbUserData) {
              return res.status(404).json({ message: 'No user with that ID'})
            }
            Thought.deleteMany({ username: dbUserData.username}).then(deletedData => deletedData ? res.json ({ message: 'User Deleted!'}) : res.status(404).json({ message: 'No user found with that ID'}))
        })
          .catch(err => res.status(500).json(err))
    },
    updateUser({params, body}, res) {
        User.findOneAndUpdate(
            {_id: params.id },body ,
            { runValidators: true, new: true})
        .then(dbUserData => dbUserData ? res.json(dbUserData) : res.status(404).json({ message: 'No user found with that ID' }))
        .catch((err) => res.status(500).json(err));
    },
    addFriend({params, body}, res) {
        console.log('Friend Added!');
        User.findOneAndUpdate(
            { _id: params.userId }, 
            { $push: { friends: params.friendId }},
            { runValidators: true, new: true })
          .then(dbUserData => res.json(dbUserData))
          .catch((err) => res.status(500).json(err));
    },
    removeFriend({params}, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: { friendId: params.friendId}}},
            )
        .then(dbUserData => res.json(dbUserData)( "Friend Removed!"(params.friendId, 'User')))
        .catch((err) => res.status(500).json(err));
    },

};

module.exports = userControllers;
