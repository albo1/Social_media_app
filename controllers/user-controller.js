const {Thought, User} = require('../models');


const thoughtControllers = {
    getThoughts(req, res) {
        Thought.find()
        .populate('reactions')
            .select('-__v')
            .then((dbThoughtData) => res.json(dbThoughtData))
            .catch((err) => { console.log (err); res.status(500).json(err)});
    },


    
}
