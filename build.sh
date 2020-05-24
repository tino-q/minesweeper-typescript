zip -r build.zip \
  Dockerfile \
  package.json \
  src \
  .ebextensions/https-instance.config \
  .ebextensions/https-instance-single.config \
  .ebextensions/create-dynamodb-table.config \
  Dockerrun.aws.json \
  tsconfig.build.json \
  tsconfig.json