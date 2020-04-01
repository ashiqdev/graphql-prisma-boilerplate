```
yarn
dotenv -e .env docker-compose up-d
dotenv -e .env prisma deploy
dotenv -e .env prisma admin
dotenv -e .env yarn start
dotenv -e .env yarn seed:db
dotenv -e .env yarn test

```
