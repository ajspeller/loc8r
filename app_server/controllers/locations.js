const homeList = (req, res) => {
  res.render('locations-list', {
    title: 'Loc8r - Find places to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapLine: 'Find places to work with wifi near you!'
    },
    sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or pint? Let Loc8r help you find the place you\'er looking for.',
    locations: [{
        name: 'Starcups',
        address: '125 High Street, Reading, RG6 1PS',
        rating: 3,
        facilities: ['Hot drinks', 'Food', 'Premium Wifi'],
        distance: '100m'
      },
      {
        name: 'Cafe Hero',
        address: '125 High Street, Reading, RG6 1PS',
        rating: 4,
        facilities: ['Hot drinks', 'Food', 'Premium Wifi'],
        distance: '200m'
      },
      {
        name: 'Burger Queen',
        address: '125 High Street, Reading, RG6 1PS',
        rating: 2,
        facilities: ['Food', 'Premium Wifi'],
        distance: '250m'
      }
    ]
  });
}

const locationInfo = (req, res) => {
  res.render('location-info', {
    title: 'Starcups',
    pageHeader: {
      title: 'Starcups'
    },
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like your.'
    },
    location: {
      name: 'Starcups',
      address: '125 High Street, Reading, RG6 1PS',
      rating: 3,
      facilities: ['Hot drinks', 'Food', 'Premium Wifi'],
      coords: {
        lat: 36.830360,
        lng: -76.122750
      },
      openingTimes: [{
        days: 'Monday - Friday',
        opening: '7:00am',
        closing: '7:00pm',
        closed: false,
      }, {
        days: 'Saturday',
        opening: '8:00am',
        closing: '5:00pm',
        closed: false,
      }, {
        days: 'Sunday',
        closed: true,
      }],
      reviews: [{
        author: 'AJ',
        rating: 1,
        timeStamp: '16 May 2018',
        reviewText: 'What a great place. I can\'t say enough good things about it.'
      }, {
        author: 'Cole B',
        rating: 3,
        timeStamp: '26 May 2018',
        reviewText: 'It was okay. Coffee wasn\'t great, but the wifi was fast.'
      }]
    }
  });
}

const addReview = (req, res) => {
  res.render('location-review-form', {
    title: 'Review Starcups on Loc8r',
    pageHeader: {
      title: 'Review Starcups'
    }
  });
}

module.exports = {
  homeList,
  locationInfo,
  addReview,
};