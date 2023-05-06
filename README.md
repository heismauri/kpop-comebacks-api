# KPop Comebacks API

The path `/api` displays the latest updates with a timestamp to convert on the users' local time. It also has the main site (`/`) which already converts them into the desired output.

# API Output example
```json
[
  {
    "date": 1665997200000,
    "title": "LE SSERAFIM - ANTIFRAGILE"
  },
  {
    "date": 1672650000000,
    "title": "NewJeans - OMG"
  },
  {
    "date": 1678424400000,
    "title": "TWICE - READY TO BE"
  },
  {
    "date": 1679302800000,
    "title": "NMIXX - expérgo"
  }
]
```

## Information
This API is used on [kpop-comebacks-widget](https://github.com/heismauri/kpop-comebacks-widget), an iOS Scriptable widget made to keep track of the upcoming comebacks.

## Acknowledgements

* [KPop Subreddit](https://www.reddit.com/r/kpop/wiki/upcoming-comebacks/2022/october/)
