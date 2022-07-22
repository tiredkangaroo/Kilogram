const Home = ({user}) => {
    if (user.isAnonymous){
        return <h1>Hello, Anonymous!</h1>
    }
    else{
        return <h1>Hello, {user.email}!</h1>
    }
}
export default Home;