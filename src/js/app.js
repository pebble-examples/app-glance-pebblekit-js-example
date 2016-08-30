Pebble.addEventListener('ready', function(e) {
  Pebble.sendAppMessage({'APP_READY': true});
});

Pebble.addEventListener('appmessage', function(dict) {
  if (dict.payload['LOCK_UUID'] && dict.payload['ACCESS_TOKEN']) {
    console.log('toggle');
    toggleLockitronState(dict.payload['LOCK_UUID'], dict.payload['ACCESS_TOKEN']);
  }
});

function toggleLockitronState(lock_uuid, access_token) {
  var url = 'https://api.lockitron.com/v2/locks/' + lock_uuid +
              '?access_token=' + access_token;
  var json = {'state': 'toggle'};

  xhrWrapper(url, 'put', json, function(req) {
    if (req.status == 200) {
      var json = JSON.parse(req.response);
      var message = json.state == 'lock' ? "Locked" : "Unlocked";
      updateAppGlance(message);
    }
  });

};

function updateAppGlance(sliceString) {
  console.log('updateAppGlance(' + sliceString + ')');

  // Expire the slice in 10 minutes
  var dateExpires = new Date();
  dateExpires.setMinutes(dateExpires.getMinutes() + 10);

  // Construct the app glance slice object
  var appGlanceSlices = [{
     "layout": {
         "icon": "system://images/HOTEL_RESERVATION",
         "subtitleTemplateString": sliceString
     },
     "expirationTime": dateExpires
  },
  {
     "layout": {
         "icon": "system://images/GENERIC_QUESTION",
         "subtitleTemplateString": "Expired"
     }
  }];

  // Trigger a reload of the slices in the app glance
  Pebble.appGlanceReload(appGlanceSlices, appGlanceSuccess, appGlanceFailure);
}


function appGlanceSuccess(appGlanceSlices, appGlanceReloadResult) {
  console.log('Pebble.appGlanceReload SUCCESS! (' + appGlanceReloadResult.success + ')');
  Pebble.sendAppMessage({'LOCK_STATE': true});
};

function appGlanceFailure(appGlanceSlices, appGlanceReloadResult) {
  console.log('Pebble.appGlanceReload FAILURE!');
  Pebble.sendAppMessage({'LOCK_STATE': false});
};


function xhrWrapper(url, type, data, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callback(xhr);
  };
  xhr.open(type, url);
  if(data) {
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  } else {
    xhr.send();
  }
};