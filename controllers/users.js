
exports.getLogin = (req,res ,next)=> {
    res.render("auth/index" ,{error:""})
}


exports.getForget = (req,res ,next)=> {
    res.render("auth/forgot")
}
