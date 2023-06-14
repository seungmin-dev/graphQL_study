import { ApolloServer, gql } from "apollo-server";
// package.json 하단에 "type":"module" 구문을 작성하지 않으면
// require를 사용해서 import 하게 됨

// nodemon을 사용하기 때문에 server.js를 저장할 때마다 nodemon이 서버가 재시작시킴

// 유저가 사용하길 원하는 모든 것들은 type Query 안에 작성되어야 함
const typeDefs = gql`
  type Query {
    text: String
    hello: String
  }
`;

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
