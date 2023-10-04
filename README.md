source: https://technotrampoline.com/articles/deploying-a-typescript-express-application-to-fly/

To run the application locally:
npx ts-node ./src/application.ts

To build and run the container locally:
docker build . -t hello-world
docker run -dp 8080:8080 hello-world

To deploy to server:
fly deploy