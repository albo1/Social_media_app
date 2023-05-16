const router = require('express').Router();

const {
    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction
} = require('../../controllers/thought-controller');

router
.route('/')
.post(createThought)
.get(getThoughts)

router
.route('/:id')
.delete(deleteThought)
.put(updateThought)
.get(getSingleThought)


router
.route('/:thoughtId/reactions')
.post(addReaction)

router
.route('/:thoughtId/reactions/:reactionId')
.delete(removeReaction);


module.exports = router;