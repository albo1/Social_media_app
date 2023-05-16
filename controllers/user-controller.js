const {Thought, User} = require('../models');
const { populate } = require('../models/User');


const userControllers = {
    getUsers(req, res) {
        Thought.find()
        .populate('reactions')
            .select('-__v')
            .then((dbThoughtData) => res.json(dbThoughtData))
            .catch((err) => { console.log (err); res.status(500).json(err)});
    },
    getSingleUser({params}, res) {
        Thought.findOne({_id: params.id})
            .populate({path: 'reactions', select: '-__v'})
            .select('-__v')
            .then((dbThoughtData => dbThoughtData ? res.json(dbThoughtData) : res.status(404).json({ message: 'No thought with that ID found' })))
            .catch((err) => res.status(500).json(err));
    },
    createUser({body}, res) {
        Thought.create({ thoughtText: body.thoughtText, username: body.username })
          .then(({_id}) => User.findOneAndUpdate({_id: body.id}, { $push: { thoughts: _id}}, { new:true}))
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch((err) => res.status(500).json(err));
    },
    deleteUser({params}, res) {
        Thought.findOneAndDelete({_id: params.id })  
          .then(dbThoughtData => dbThoughtData ? res.json( 'Thought has been successfully deleted'(dbThoughtData._id)) : res.status(404).json({ message: 'No thought with that ID found'(params.id)}))
          .catch((err) => 
            res.status(500).json(err)
          );
    },
    updateUser({params, body}, res) {
        Thought.findOneAndUpdate( {_id: params.id }, body, { new: true, runValidators: true})
          .then((dbThoughtData => dbThoughtData ? res.json(dbThoughtData) : res.status(404).json({ message: 'No thought with that ID found!'})))
        .catch((err) => res.status(500).json(err));
    },
    addFriend({params, body}, res) {
        console.log('Adding Reaction...');
        console.log(req.body);
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: {reactionBody: body.reactionBody, username: body.username} }},
            { runValidators: true, new: true })
          .then(dbThoughtData => dbThoughtData ? res.json(dbThoughtData) : res.status(404).json({ message: 'No thought with that ID found!'(params.id)}))
          .catch((err) => res.status(500).json(err));
    },
    removeFriend({params}, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { _id: params.reactionId}}},
            { new: true })
           .then(dbThoughtData => dbThoughtData ? res.json("Reaction Removed!"(params.thoughtId)) : res.status(404).json({ message: 'No thought with that ID found!'}))
           .catch((err) => res.status(500).json(err));
    },

};

module.exports = thoughtControllers;
