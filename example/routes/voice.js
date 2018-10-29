const express = require('express');
const router = express.Router();

const baseUrl = 'https://jodom.ngrok.io/';
const songUrl = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/4/49/National_Anthem_of_Kenya.ogg/National_Anthem_of_Kenya.ogg.mp3';
let session   = 'menu';


// voice route
router.post('/', (req, res) => {

    const {
        isActive,
        callerNumber,
        dtmfDigits,
        recordingUrl
    } = req.body;

    let responseActions = '';

    // Prep state
    let state = isActive === '1' ? session : '';


    switch (state) {
        case 'menu':
            session  = 'process';
            responseActions = `<Say>Hello bot ${callerNumber ? callerNumber : 'There'}</Say>
            <GetDigits timeout="1" finishOnKey="#">
                <Say>Press 1 to listen to some song. Press 2 to tell me your name. Press 3 to talk to a human. Press 4 to hangup and quit</Say>
            </GetDigits>`;
            break;
        case 'process':
            switch(dtmfDigits) {
                case '1':
                    session  = 'menu';
                    responseActions = `<Play url="${songUrl}"/>
                    <Redirect>${baseUrl}voice</Redirect>`;
                    break;
                case '2':
                    session  = 'name';
                    responseActions = `<Record finishOnKey="#" maxLength="30" trimSilence="true" playBeep="true">
                        <Say>Please say your full name after the beep</Say>
                    </Record>`;
                    break;
                case '3':
                    session  = undefined;
                    responseActions = `<Say>We are getting our resident human on the line for you, please wait while enjoying this nice tune. You have 30 seconds to enjoy a conversation with them</Say>
                    <Dial phoneNumbers="+254724821003" maxDuration="30" record="true" sequential="true"/>`;
                    break;
                case '4':
                    session  = undefined;
                    responseActions = `<Say>Bye Bye, Long Live Our Machine Overlords!</Say><Reject/>`;
                    break;
                default:
                    session  = 'menu';
                    responseActions = `<Say> Invalid choice, try again and you will be exterminated!</Say>
                    <Redirect>${baseUrl}voice</Redirect>`;
            }
            break;
        case 'name':
            session  = 'menu';
            responseActions = `<Say>Your human name is</Say>
            <Play url="${recordingUrl}"/>
            <Say>Now forget it. Your new name is bot ${callerNumber} </Say>
            <Redirect>${baseUrl}voice</Redirect>`;
            break;
        default:
            responseActions = `<Say>Well, this is unexpected! Bye Bye, Long Live Our Machine Overlords</Say><Reject/>`;
    }

    let response = `<?xml version="1.0" encoding="UTF-8"?><Response>${responseActions}</Response>`;

    res.send(response);
});

module.exports = router;
