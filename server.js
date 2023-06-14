import { ApolloServer, gql } from "apollo-server";
// package.json 하단에 "type":"module" 구문을 작성하지 않으면
// require를 사용해서 import 하게 됨

// nodemon을 사용하기 때문에 server.js를 저장할 때마다 nodemon이 서버가 재시작시킴

const tweets = [
  {
    id: "1",
    text: "first one",
  },
  {
    id: "2",
    text: "second one",
  },
];

// 유저가 사용하길 원하는 모든 것들은 type Query 안에 작성되어야 함
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;
// operation 작성할 때 default 는 query
// mutation은 표기해줘야함

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    // tweet(root, args) {
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
