const gql = require('graphql-tag');

const fragment = gql`
  fragment User on User {
    id
    name
    email
    posts {
      id
      title
      body
      published
    }
    comments {
      id
      text
      post {
        id
        title
        body
      }
      author {
        name
      }
    }
    createdAt
    updatedAt
  }
`;

module.exports = fragment;
