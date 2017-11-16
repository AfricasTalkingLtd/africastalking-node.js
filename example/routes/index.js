const os = require('os');
const express = require('express');
const router = express.Router();

const ifaces = os.networkInterfaces();
const ips = [];

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }
    ips.push(iface.address);
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Africa\'s Talking', server: ips.map(ip => `${ip}:35897`).join('\n') });
});

module.exports = router;
