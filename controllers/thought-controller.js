const {Thought, User} = require('../models');


const thoughtControllers = {
    getThoughts(req, res) {
        Thought.find()
        .populate('reactions')
            .select('-__v')
            .then((dbThoughtData) => res.json(dbThoughtData))
            .catch((err) => { console.log (err); res.status(500).json(err)});
    },
    getSingleThought({params}, res) {
        Thought.findOne({_id: params.id})
            .populate({path: 'reactions', select: '-__v'})
            .select('-__v')
            .then((dbThoughtData => dbThoughtData ? res.json(dbThoughtData) : res.status(404).json({ message: 'No thought with that ID found' })))
            .catch((err) => res.status(500).json(err));
    },
    createThought({body}, res) {
        Thought.create({ thoughtText: body.thoughtText, username: body.username })
          .then(({_id}) => User.findOneAndUpdate({_id: body.id}, { $push: { thoughts: _id}}, { new:true}))
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch((err) => res.status(500).json(err));
    },
    deleteThought({params}, res) {
        Thought.findOneAndDelete({_id: params.id })  
          .then(dbThoughtData => dbThoughtData ? res.json(`Thought has been successfully deleted with ID: ${dbThoughtData._id}`) : res.status(404).json({ message: 'No thought with that ID found' }))
          .catch((err) => 
            res.status(500).json(err)
          );
    },
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate( {_id: params.id }, body, { new: true, runValidators: true})
          .then((dbThoughtData => dbThoughtData ? res.json(dbThoughtData) : res.status(404).json({ message: 'No thought with that ID found!'})))
        .catch((err) => res.status(500).json(err));
    },
    addReaction({params, body}, res) {
        console.log('Adding Reaction...');
        console.log(body);
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: {reactionBody: body.reactionBody, username: body.username} }},
            { runValidators: true, new: true })
          .then(dbThoughtData => dbThoughtData ? res.json(dbThoughtData) : res.status(404).json({ message: 'No thought with that ID found!'(params.id)}))
          .catch((err) => res.status(500).json(err));
    },
    removeReaction({params}, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { _id: params.reactionId}}},
            { new: true })
            .then((dbThoughtData) => {
              if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought with that ID found!' });
              }
              res.json({ message: 'Reaction removed!', updatedThought: dbThoughtData });
            })
           .catch((err) => res.status(500).json(err));
    },

};

module.exports = thoughtControllers;
