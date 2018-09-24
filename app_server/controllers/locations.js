const request = require('request');

const apiOptions = {
  server: 'http://localhost:3000'
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = 'https://secure-cove-49944.herokuapp.com'
}

const _renderHomepage = (req, res, responseBody) => {
  let message = null;
  if (!(responseBody instanceof Array)) {
    message = 'API lookup error';
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = 'No places found nearby';
    }
  }
  res.render('locations-list', {
    title: 'Loc8r - Find places to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapLine: 'Find places to work with wifi near you!'
    },
    sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or pint? Let Loc8r help you find the place you\'er looking for.',
    locations: responseBody,
    message,
  });
};

const _renderDetailPage = (req, res, locDetail) => {
  res.render('location-info', {
    title: locDetail.name,
    pageHeader: {
      title: locDetail.name
    },
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like your.'
    },
    location: locDetail,
  });
}


const _renderReviewForm = (req, res, locDetai) => {
  res.render('location-review-form', {
    title: `Review ${locDetai.name} on Loc8r`,
    pageHeader: {
      title: `Review ${locDetai.name}`
    },
    error: req.query.err,
  });
};


const _getLocationInfo = (req, res, callback) => {
  const path = `/api/locations/${req.params.locationid}`;
  requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {}
  };
  request(requestOptions, (err, response, body) => {
    if (response.statusCode === 200) {
      let data = body;
      data.coords = {
        lng: body.coords[0],
        lat: body.coords[1]
      };
      callback(req, res, data);
    } else {
      _showError(req, res, response.statusCode);
    }
  });
}


const locationInfo = (req, res) => {
  _getLocationInfo(req, res, (req, res, responseData) => {
    _renderDetailPage(req, res, responseData);
  });
};

const addReview = (req, res) => {
  _getLocationInfo(req, res, (req, res, responseData) => {
    _renderReviewForm(req, res, responseData);
  });
};


const _formatDistance = (distance) => {

  if (isNaN(distance)) {
    console.log('The distance is not numeric.');
    return;
  } else if (!isNaN(distance) && distance < 0) {
    console.log('The distance has to be a positive number or 0.');
    return;
  } else if (!distance) {
    console.log('A distance must be supplied.');
    return;
  }

  let thisDistance = 0;
  let unit = ' m';
  if (distance > 1000) {
    thisDistance = parseFloat(distance / 1000).toFixed(1);
    unit = ' km';
  } else {
    thisDistance = Math.floor(distance);
  }
  return thisDistance + unit;
}


const _showError = (req, res, status) => {
  let title = '';
  let content = '';
  if (status === 404) {
    title = '404, page not found';
    content = 'Oh dear. Looks like we can\'t find this page. Sorry.';
  } else {
    title = `${status}, something went wrong`;
    content = 'Something went wrong somewhere. Sorry.';
  }
  res.status(status);
  res.render('generic-text', {
    title,
    content
  });
}

const homeList = (req, res) => {
  const path = '/api/locations';
  const requestOptions = {
    url: apiOptions.server + path,
    method: 'GET',
    json: {},
    qs: {
      lng: -1,
      lat: 51.5,
      maxDist: 20000,
      maxResults: 10
    }
  };
  request(requestOptions, (err, response, body) => {
    if (response.statusCode === 200 && body.length > 0) {
      body.forEach(loc => {
        loc.distance = _formatDistance(loc.distance);
      });
    }
    _renderHomepage(req, res, body);
  });
};

const doAddReview = (req, res) => {
  const locationid = req.params.locationid;
  const path = `/api/locations/${locationid}/reviews`;
  const postData = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review,
  };
  const requestOptions = {
    url: apiOptions.server + path,
    method: 'POST',
    json: postData,
  };
  if (!postData.author || !postData.rating || !postData.reviewText) {
    res.redirect(`/location/${locationid}/review/new?err=val`);
  } else {
    request(requestOptions, (err, response, body) => {
      if (response.statusCode === 201) {
        res.redirect(`/location/${locationid}`);
      } else if (response.statusCode === 400 && body.name && body.name === 'ValidationError') {
        res.redirect(`/location/${locationid}/review/new?err=val`);
      } else {
        _showError(req, res, response.statusCode);
      }
    });
  }
};

module.exports = {
  homeList,
  locationInfo,
  addReview,
  doAddReview,
};