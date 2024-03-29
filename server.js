import { ApolloServer, gql } from "apollo-server";
import { error } from "console";
import dotenv from "dotenv";
dotenv.config();
// package.json 하단에 "type":"module" 구문을 작성하지 않으면
// require를 사용해서 import 하게 됨

// nodemon을 사용하기 때문에 server.js를 저장할 때마다 nodemon이 서버가 재시작시킴

let tweets = [
  {
    id: "1",
    text: "first one",
    userId: "2",
  },
  {
    id: "2",
    text: "second one",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstName: "seungmin",
    lastName: "lee",
  },
];

// 유저가 사용하길 원하는 모든 것들은 type Query 안에 작성되어야 함
const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    allMovies: [Movie!]!
    movie(movieCd: String!): MovieDetail!
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
  type Movie {
    movieCd: String!
    movieNm: String!
    movieNmEn: String!
    prdtYear: String!
    openDt: String!
    typeNm: String!
    prdtStatNm: String!
    nationAlt: String!
    genreAlt: String!
    repNationNm: String!
    repGenreNm: String!
  }
  type GenreType {
    genreNm: String!
  }
  type MovieDetail {
    movieCd: String!
    movieNm: String!
    movieNmEn: String!
    movieNmOg: String
    showTm: String!
    prdtYear: String!
    openDt: String
    prdtStatNm: String!
    typeNm: String!
    nations: [String]
    genres: [GenreType!]!
    directors: [String!]
    actors: [String!]
    showTypes: [String]
    companys: [String!]
  }
`;
// directors: [String]

// operation 작성할 때 default 는 query
// mutation은 표기해줘야함

const resolvers = {
  Query: {
    allUsers() {
      return users;
    },
    allTweets() {
      return tweets;
    },
    // tweet(root, args) {
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allMovies() {
      const movieData = fetch(
        `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${process.env.API_KEY}`
      )
        .then((res) => res.json())
        .then((data) =>
          data.movieListResult.movieList.filter(
            (movie) => movie.genreAlt !== "성인물(에로)"
          )
        );

      return movieData;
    },
    movie(_, { movieCd }) {
      return fetch(
        `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${process.env.API_KEY}&movieCd=${movieCd}`
      )
        .then((res) => res.json())
        .then((data) => data.movieInfoResult.movieInfo);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      // root에 '_'를 기입하면 root를 무시하겠다는 의미
      const user = users.find((user) => user.id === userId);
      if (!user) {
        throw error("유저아이디가 존재하지 않습니다");
        return false;
      }
      const newTweet = {
        id: tweets.length + 1,
        text,
        author: user,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    // 콘솔 찍어 확인해보면 resolver 순서가 allUsers -> fullName 순임
    // allUsers를 들여다보고 fullName 확인 후 fullName resolver
    // fullName(root) {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
