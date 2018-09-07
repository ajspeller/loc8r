const about = (req, res) => {
  res.render('generic-text', {
    title: 'About Loc8r',
    content: 'Loc8r was created to help people find places to sit down and get a bit of work done.\n\nLorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa possimus, adipisci eos et excepturi nam, dolorem numquam, eius mollitia quia voluptatem accusantium quisquam fuga ad.\n\n123 abc test \n\nLorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam id dignissimos cumque.'
  });
}

module.exports = {
  about,
};