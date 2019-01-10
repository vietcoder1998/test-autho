
module.exports = {
    query1: "SELECT * FROM user",
    query2: "INSERT INTO user( username, password) VALUES (? , ?)",
    authentization: "INSERT INTO user(username, password, token) VALUES ( ? , ? , ?)",
    verifytoken: "SELECT token FROM user WHERE username= ? AND password = ?"
}
