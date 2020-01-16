const gql = require("graphql-tag");

const fragment = gql`
  fragment Comment on Comment {
    id
    text
    author {
      id
      name
    }
    post {
      title
    }
    createdAt
    updatedAt
  }
`;

module.exports = fragment;