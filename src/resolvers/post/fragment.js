const gql = require("graphql-tag");

const fragment = gql`
  fragment Post on Post {
    id
    title
    body
    published
    author {
      id
      name
      email
    }
    comments {
      id
      text
      author {
        id
        name
      }
    }
    createdAt
    updatedAt
  }
`;

module.exports = fragment;
