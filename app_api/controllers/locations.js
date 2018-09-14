// access to the database connection
const mongoose = require('mongoose');
// access to the location model to allow access to the location collection
const Loc = mongoose.model('Location');


const locationsListByDistance = (req, res) => {
  const lng = parseFloat(req.query.lng); // convert to numbers
  const lat = parseFloat(req.query.lat); // convert to numbers

  const maxResults = parseInt(req.query.maxResults);
  const maxDist = parseInt(req.query.maxDist);

  const point = {
    type: 'Point',
    coordinates: [lng, lat],
  };

  const geoOptions = {
    spherical: true,
    num: maxResults, // retrieve no more than 10 of the closest results
    maxDistance: maxDist // units are meters
  };

  if (!lng || !lat || !maxResults || !maxDist) {
    return res.status(404).json({
      "message": "lng, lat, maxResults & maxDist query parameters are required"
    });
  }

  Loc.geoNear(point, geoOptions, (err, results, stats) => {
    const locations = [];
    if (err) {
      return res.status(404).json(err);
    }
    results.forEach((doc) => {
      locations.push({
        distance: (doc.dis),
        name: doc.obj.name,
        address: doc.obj.address,
        rating: doc.obj.rating,
        facilities: doc.obj.facilities,
        _id: doc.obj._id,
      });
    });
    res.status(200).json(locations);
  });
};


const locationsCreate = (req, res) => {

  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(','),
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1
    }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2
    }]
  }, (err, location) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(201).json(location);
    }
  });
};


const locationsReadOne = (req, res) => {
  if (req.params && req.params.locationid) {
    Loc.findById(req.params.locationid)
      .exec((err, location) => {
        if (!location) {
          return res.status(404).json({
            "message": "locationid not found"
          });
        } else if (err) {
          return res.status(404).json(err);
        }
        res.status(200).json(location);
      });
  } else {
    res.status(404).json({
      "message": "No locationid in request"
    });
  }
};


const locationsUpdateOne = (req, res) => {

  if (!req.params.locationid) {
    return res.status(404).json({
      "message": "Not found, locationid is required"
    });
  }

  Loc.findById(req.params.locationid).select('-reviews -rating').exec((err, location) => {
    if (!location) {
      return res.status(404).json({
        'message': 'locationid not found'
      });
    } else if (err) {
      return res.status(400).json(err);
    }
    location.name = req.body.name;
    location.address = req.body.address;
    location.facilities = req.body.facilities.split(',');
    location.coords = [
      parseFloat(req.body.lng),
      parseFloat(req.body.lat),
    ];
    location.openingTimes = [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1,
    }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2,
    }, ];
    location.save((err, location) => {
      if (err) {
        return res.status(404).json(err);
      }
      return res.status(200).json(location);
    });
  });
};


const locationsDeleteOne = (req, res) => {
  console.log('locationsDeleteOne');

  const locationid = req.params.locationid;
  console.log('locatonid');
  console.log(locationid);
  if (locationid) {
    Loc.findByIdAndRemove(locationid).exec((err, location) => {
      if (err) {
        console.log('error found');
        return res.status(404).json(err);
      }
      console.log('no remove error happened');
      return res.status(204).json(null);
    });
  } else {
    console.log('didnt have a locationid in the params');
    return res.status(404).json({
      "message": "No locationid"
    });
  }
};

module.exports = {
  locationsListByDistance,
  locationsCreate,
  locationsReadOne,
  locationsUpdateOne,
  locationsDeleteOne,
}