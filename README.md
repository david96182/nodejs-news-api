# Nodejs News Feed Api

This a personalized Hacker News Feed that fetch nodejs news. It uses nestjs framework in the backend. 

## Description

The backend takes the info from this url http://hn.algolia.com/api/v1/search_by_date?query=nodejs every hour, using `@nestjs/schedule`, and stores the feed in a mongodb database. The server side defines an API REST using nestjs features.If you run the app for the first time and you want to asure that info was taken from the hacker news site, you can go to the [source](./backend/src/blog/blog.service.ts), and write `* * * * *` in the `Cron` decorator.

## How to use

1. Clone this repo
2. Make sure you have installed docker and docker-compose
3. Set your ENV variables in the .env
4. Run `sudo docker-compose up --build` 



