const mongoose = require('mongoose');
const Loc = mongoose.model('Location');


const _doSetAverageRating = (location) => {
  if (location.reviews && location.reviews.length) {
    const reviewCount = location.reviews.length;
    const ratingTotal = location.reviews.reduce((total, review) => {
      return total + review.rating;
    }, 0);
    let ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    location.rating = ratingAverage;
    location.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Average rating updated to ', ratingAverage);
      }
    });
  }
};

const _updateAverageRating = (locationid) => {
  Loc.findById(locationid).select('rating reviews').exec((err, location) => {
    if (!err) {
      _doSetAverageRating(location);
    }
  });
};

const _doAddReview = (req, res, location) => {
  if (!location) {
    return res.status(404).json({
      "message": "locationid not found"
    });
  }
  location.reviews.push({
    author: req.body.author,
    rating: +req.body.rating,
    reviewText: req.body.reviewText
  });
  location.save((err, location) => {
    if (err) {
      return res.status(400).json(err);
    }
    _updateAverageRating(location._id);
    const thisReview = location.reviews[location.reviews.length - 1];
    return res.status(201).json(thisReview);
  });
};


const reviewsCreate = (req, res) => {

  const locationid = req.params.locationid;
  if (locationid) {
    Loc.findById(locationid).select('reviews').exec((err, location) => {
      if (err) {
        return res.status(400).json(err);
      }
      _doAddReview(req, res, location);
    });
  } else {
    res
      .status(404)
      .json({
        "message": "Not found, locationid"
      });
  }
};


const reviewsReadOne = (req, res) => {
  if (req.params && req.params.locationid && req.params.reviewid) {
    Loc.findById(req.params.locationid)
      .select('name reviews')
      .exec((err, location) => {
        if (!location) {
          return res.status(404).json({
            "message": "locationid not found"
          });
        } else if (err) {
          return res.status(404).json(err);
        }
        if (location.reviews && location.reviews.length) {
          const review = location.reviews.id(req.params.reviewid);
          if (!review) {
            res.status(404).json({
              "message": "reviewid not found"
            });
          } else {
            response = {
              location: {
                name: location.name,
                id: req.params.locationid,
              },
              review: review
            };
            res.status(200).json(response);
          }
        } else {
          res
            .status(404)
            .json({
              "message": "No reviews found"
            });
        }
      });
  } else {
    res.status(404).json({
      "message": "Not found, locationid and reviewid are both required"
    });
  }
};


const reviewsUpdateOne = (req, res) => {
  if (!req.params.locationid || !req.params.reviewid) {
    return res.status(404).json({
      'message': 'Not found, locationid and reviewid are both required'
    })
  }

  Loc.findById(req.params.locationid).select('reviews').exec((err, location) => {
    if (!location) {
      return res.status(404).json({
        'message': 'locationid not found'
      });
    } else if (err) {
      return res.status(400).json(err);
    }
    //console.log('_doAddReview');
    console.log(location);
    console.log({
      author: req.body.author,
      rating: +req.body.rating,
      reviewText: req.body.reviewText
    });
    if (location.reviews && location.reviews.length > 0) {
      const thisReview = location.reviews.id(req.params.reviewid);
      if (!thisReview) {
        return res.status(404).json({
          'message': 'reviewid not found'
        });
      } else {
        thisReview.author = req.body.author;
        thisReview.rating = +req.body.rating;
        thisReview.reviewText = req.body.reviewText;
        location.save((err, location) => {
          if (err) {
            return res.status(404).json(err);
          } else {
            _updateAverageRating(location._id);
            return res.status(200).json(thisReview);
          }
        });
      }
    } else {
      return res.status(404).json({
        'message': 'No review to update'
      });
    }
  });
};


const reviewsDeleteOne = (req, res) => {

  if (!req.params.locationid || !req.params.reviewid) {
    return res.status(404).json({
      'message': 'Not found, locationid and reviewid are both required'
    });
  }

  Loc.findById(req.params.locationid).select('reviews').exec((err, location) => {
    if (!location) {
      return res.status(404).json({
        'message': 'locationid not found'
      });
    } else if (err) {
      return res.status(400).json(err);
    }
    if (location.reviews && location.reviews.length > 0) {
      if (!location.reviews.id(req.params.reviewid)) {
        return res.status(404).json({
          'message': 'reviewid not found'
        });
      } else {
        location.reviews.id(req.params.reviewid).remove();
        location.save((err) => {
          if (err) {
            return res.status(404).json(err);
          } else {
            _updateAverageRating(location._id);
            return res.status(204).json(null);
          }
        });
      }
    } else {
      return res.status(404).json({
        'message': 'No review to delete'
      });
    }
  });
};

module.exports = {
  reviewsCreate,
  reviewsReadOne,
  reviewsUpdateOne,
  reviewsDeleteOne,
}