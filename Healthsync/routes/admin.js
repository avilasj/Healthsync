var express = require('express');
var router = express.Router();

//GET
router.get('/', function(req,res,next){
    res.render('admin/login');
});

router.get('/admindashboard', async function(req,res,next){
    verificaLogin(res);
    const usuarios = await global.banco.buscarUsuarios();
    const totalCadastrados = usuarios.length;
    const totalInativos = usuarios.filter(u => u.status === 'inativo').length;
    res.render('admin/admindashboard', {
        totalCadastrados,
        totalInativos
    });
});

router.get('/usuarios', async function(req, res, next) {
    verificaLogin(res);
    const termo = req.query.busca || '';
    const usuarios = await global.banco.buscarUsuariosFiltrado(termo);
    res.render('admin/usuarios', { usuarios, termoBusca: termo });
});

router.get('/usuarios/:usucodigo/editar', async function(req, res, next) {
    verificaLogin(res);
    const usuario = await global.banco.buscarUsuarioPorCodigo(req.params.usucodigo);
    if (!usuario) return res.redirect('/admin/usuarios');
    res.render('admin/editar_usuario', { usuario });
});

//POST
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

router.post('/usuarios/:usucodigo/excluir', async function(req, res, next) {
    const usucodigo = req.params.usucodigo;
    console.log('Rota de exclusão chamada para usucodigo:', usucodigo);
    await global.banco.excluirUsuario(usucodigo);
    res.json({ ok: true });
});

router.post('/usuarios/:usucodigo/resetar-senha', async function(req, res, next) {
    const usucodigo = req.params.usucodigo;
    const novaSenha = '123456';
    await global.banco.resetarSenhaUsuario(usucodigo, novaSenha);
    res.redirect('/admin/usuarios');
});

router.post('/usuarios/:usucodigo/editar', async function(req, res, next) {
    verificaLogin(res);
    let usuario;
    if (req.is('application/json')) {
        usuario = {
            usucodigo: req.params.usucodigo,
            usunome: req.body.usunome,
            usuemail: req.body.usuemail,
            ususenha: req.body.ususenha
        };
    } else {
        usuario = {
            usucodigo: req.params.usucodigo,
            usunome: req.body.usunome,
            usuemail: req.body.usuemail,
            ususenha: req.body.ususenha
        };
    }
    await global.banco.atualizarUsuario(usuario);
    if (req.is('application/json')) {
        res.json({ ok: true });
    } else {
        res.redirect('/admin/usuarios');
    }
});

function verificaLogin(res)
{
  if (!global.admemail || global.admemail == "")
    res.redirect('/admin');
}

module.exports = router;
