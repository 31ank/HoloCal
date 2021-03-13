# HoloCal
HoloCal is a fanmade website for displaying all [Hololive](https://hololive.tv) streams.

Currently all entrys are manually insereted into a mariaDB, but a web-scraper is in development.

You can check the website out at [holocal.tv](https://holocal.tv)
Project is still WIP

The API is publicly available - Read [here](https://github.com/31ank/HoloCal/wiki/HoloCal-API) the documentation

## Planned features:
* Link stream

[ToDo List](https://github.com/31ank/HoloCal/projects/1)

## WebScraper python dependencies
The scraper was created with Python 3.8.3
* Beautifulsoup4 for parsing HTML ```pip install beautifulsoup4```
* MySQL connector to connect to db ```pip install mysql-connector-python```
* pytz to convert timezones ```pip install pytz```
