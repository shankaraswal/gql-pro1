
const express= require('express');
const graphqlHTTP = require('express-graphql');


const app=express();
const {GraphQLSchema, GraphQLObjectType, GraphQLList,GraphQLString,GraphQLInt, graphql } = require('graphql');

const users = [
    { 
        id : 1,
        name : "Shan",
        age : 38,
        gender:'M'
    },
    { 
        id : 2,
        name : "Anku",
        age : 33,
        gender:'F'
    }, 
    { 
        id : 3,
        name : "Kuku",
        age : 6,
        gender:'M'
    },
    { 
        id : 4,
        name : "Nikku",
        age : 0,
        gender:'M'
    }    
];



const UserType= new GraphQLObjectType({
    name:'Users',
    description:'....',
    fields:{
        id:{
            type:GraphQLInt
        },
        name:{
            type:GraphQLString
        },
        age:{
            type:GraphQLInt
        },
        gender:{
            type:GraphQLString
        }

    }

});

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description:'...',
        fields: ()=>({
            users:{
                type: new GraphQLList(UserType),
                resolve:(parent, args)=>{
                    return users;
                }
            },
            user:{
                type: UserType,
                args: {
                        id:{
                            type:GraphQLInt
                        }
                    },
                resolve:(parent, {id})=>{
                    const user = users.filter(user=>user.id == id)
                    return user[0];
                }
            }
        })
    })

});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.get('/', (req, res)=>{
    const query = `query{users{id, name, age}}`;
    graphql(schema, "{users {name,age}}", query)
    .then(response =>res.send(response))
    .catch(err=>res.send(err))
})

app.get('/user/:id', (req, res)=>{
    const query = `query{user(id:${req.params.id}){id, name, gender}}`;
    graphql(schema, query)
    .then(response =>res.send(response))
    .catch(err=>res.send(err))
})

app.listen(4000, ()=>{
    console.log('server started')
})