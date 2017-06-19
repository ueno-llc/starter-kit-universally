import ngrok from 'ngrok';

ngrok.connect(process.env.PORT || 3000, (err, url) => {
  if (err) {
    console.log('ngrok error', err);
    return;
  }

  console.log('Remote development started on ', url);

  process.env.CLIENT_DEV_PROXY = 1;
  process.env.PUBLIC_URL = url;

  require('../development');
});
