const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Replace these with your actual VAPID keys
const publicKey = 'BCFEO_Ci-ehCPlaH_Gp-R3d5ra0TcwpVnbzvzTwktJaLEM6bh5b4VauI-4QEaSD-OD64WrhLcGXei2ggE9wEF_M';
const privateKey = 'lpqgd663Rq1xbFd_H28aO5DTLfaPpXirOXcSbD0NECA';

webpush.setVapidDetails(
  'mailto:info@bulmacan.com',
  publicKey,
  privateKey
);

// Load or initialize subscriptions
const SUBS_FILE = 'subscriptions.json';
let subscriptions = [];

if (fs.existsSync(SUBS_FILE)) {
  subscriptions = JSON.parse(fs.readFileSync(SUBS_FILE));
}

// Save new subscription
app.post('/save-subscription', (req, res) => {
  const sub = req.body;
  subscriptions.push(sub);
  fs.writeFileSync(SUBS_FILE, JSON.stringify(subscriptions, null, 2));
  res.status(201).json({ message: 'Subscription saved' });
});

// Send a test push
app.get('/send-push', (req, res) => {
  const payload = JSON.stringify({
    title: 'Yeni bulmaca seni bekliyor!',
    body: 'Bugünkü ipucu seni şaşırtabilir.',
    icon: '/brain_red.png',
    url: '/puzzle/today'
  });

  subscriptions.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => {
      console.error('Push error:', err);
    });
  });

  res.send('Push sent!');
});

app.listen(3000, () => console.log('Push server running on http://localhost:3000'));