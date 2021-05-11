
exports.getLogin = (req,res ,next)=> {
    res.render("auth/index")
}


exports.getForget = (req,res ,next)=> {
    res.render("auth/forgot")
}
