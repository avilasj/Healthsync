var express = require('express');
var router = express.Router();


router.get('/', function(req,res,next){
    res.render('admin/login');
});

router.get('/admindashboard', function(req,res,next){
    verificaLogin(res);
    res.render('admin/admindashboard');
});



router.post('/login', async function(req,res,next){
    const email = req.body.email;
    const senha = req.body.senha;

    const admin = await global.banco.buscarAdmin({email,senha});

    if (admin.admcodigo)
    {
        global.admcodigo = admin.admcodigo;
        global.admemail = admin.admemail;
        global.admnome = admin.admnome;
        res.redirect('/admin/admindashboard');
    }
    else
    {
        res.redirect('/admin')
    }

});




function verificaLogin(res)
{
  if (!global.admemail || global.admemail == "")
    res.redirect('/admin');
}

module.exports = router;
