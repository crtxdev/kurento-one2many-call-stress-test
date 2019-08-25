# kurento-one2many-call-stress-test
A puppeteer script to stress test a kurento one2many call demo app and evaluate RTC Peer connection stats

# How to use

## Install
Run ```npm install```

## Environment variables
Create a .env file or rename .env.example to .env
Edit variables according to your needs and resources.

APP_URL is a full URL to your application.
```
APP_URL=https://example.com/path/to/your/app
```

DURATION is how long the tab is going to be open for (specified in seconds).
```
DURATION=10
```

PAGES is how many tabs are going to be created.
```
PAGES=10
```

HEADLESS is whether puppeteer should run in headless mode
```
HEADLESS=true
```

## Run test

To run the test, run the start script:
```
npm start
```

## Results

Results for each test will be saved in ```test``` directory and will include stats for ```RTCPeerConnection``` as well as a screenshot that will be taken after the test
