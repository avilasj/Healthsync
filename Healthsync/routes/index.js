var express = require('express');
var router = express.Router();




router.post('/login', async function(req, res, next){
  const email = req.body.email;
  const senha = req.body.senha;

  const usuario = await global.banco.buscarUsuario({email,senha});
   
  if (usuario.usucodigo)
  {
   global.usucodigo = usuario.usucodigo;
   global.usuemail = usuario.usuemail;
   global.usunome = usuario.usunome;
   res.redirect('/dashboard');
  }
  else
  {

  res.redirect('/');
  }
});

router.post('/registrar_medicamento', async function(req, res, next) {
    try {
        verificaLogin(res);
        
        console.log('Dados recebidos do formulário:', req.body);
        console.log('Usuário atual:', global.usucodigo);
        
        const medicamento = {
            usucodigo: global.usucodigo,
            medicamento_nome: req.body.medicamento_nome,
            medicamento_dosagem: req.body.medicamento_dosagem,
            medicamento_frequencia: req.body.medicamento_frequencia,
            medicamento_horario: req.body.medicamento_horario,
            medicamento_observacoes: req.body.medicamento_observacoes
        };

        console.log('Objeto medicamento formatado:', medicamento);

        const resultado = await global.banco.registrarMedicamento(medicamento);
        
        console.log('Resultado do registro:', resultado);
        
        if (resultado) {
            res.redirect('/meus_medicamentos');
        } else {
            res.status(500).send('Erro ao registrar medicamento');
        }
    } catch (error) {
        console.error('Erro detalhado ao registrar medicamento:', error);
        res.status(500).send('Erro interno do servidor');
    }
});


router.get('/dados_pessoais', async function (req,res,next){
  try {
    verificaLogin(res);
    console.log('Acessando rota /dados_pessoais para o usuário:', global.usucodigo);
    const usuario = await global.banco.buscarUsuarioPorCodigo(global.usucodigo);
    let dadosComplementares = await global.banco.buscarDadosComplementares(global.usucodigo);
    
    if (!dadosComplementares) {
        console.log('Dados complementares não encontrados para o usuário, criando registro inicial.');
        await global.banco.criarDadosComplementares(global.usucodigo);
        dadosComplementares = await global.banco.buscarDadosComplementares(global.usucodigo);
    }

    console.log('Dados do usuário encontrados para dados pessoais:', usuario);
    console.log('Dados complementares (após verificação) encontrados:', dadosComplementares);
    
    if (usuario) {
      res.render('dados_pessoais/dados_pessoais', {
        usuNome: global.usunome,
        usuario: usuario,
        dadosComplementares: dadosComplementares
      });
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  } catch (error) {
    console.error('Erro ao carregar página de dados pessoais:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

router.post('/dados_pessoais', async function(req, res, next) {
  try {
    verificaLogin(res);
    console.log('Recebendo dados para atualizar usuário:', req.body);
    const usuarioAtualizado = {
      usucodigo: global.usucodigo,
      usunome: req.body.usunome,
      ususobrenome: req.body.ususobrenome,
      usuemail: req.body.usuemail,
    };

    const dadosComplementaresAtualizados = {
        usucodigo: global.usucodigo,
        idade: req.body.idade,
        telefone: req.body.telefone,
        cidade: req.body.cidade,
        estado: req.body.estado,
        endereco: req.body.endereco
    };

   
    const sucessoUsuario = await global.banco.atualizarUsuario(usuarioAtualizado);

    const sucessoComplementares = await global.banco.atualizarDadosComplementares(dadosComplementaresAtualizados);

    if (sucessoUsuario || sucessoComplementares) { 
      global.usunome = usuarioAtualizado.usunome; 
      console.log('Dados do usuário (principal e complementares) atualizados com sucesso.');
      res.redirect('/dados_pessoais?success=true');
    } else {
      console.error('Falha ao atualizar dados do usuário ou complementares.');
      res.redirect('/dados_pessoais?error=true');
    }
  } catch (error) {
    console.error('Erro detalhado ao atualizar dados do usuário:', error);
    res.status(500).send('Erro interno do servidor');
  }
});


router.get('/dashboard', async function(req, res, next) {
    try {
        verificaLogin(res);
        
        const registrosPressao = await global.banco.buscarRegistrosPressao(global.usucodigo);
        const registrosGlicemia = await global.banco.buscarRegistrosGlicemia(global.usucodigo);
        
        const lembretes = await global.banco.buscarLembretes(global.usucodigo);
        
        res.render('dashboard/dashboard', {
            usuNome: global.usunome,
            registrosPressao: registrosPressao,
            registrosGlicemia: registrosGlicemia,
            lembretes: lembretes 
        });
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        res.status(500).send('Erro ao carregar dashboard');
    }
});


router.get('/educacao_saude', function (req,res,next){
  res.render('educacao_saude/educacao_saude', {usuNome: global.usunome})
});

router.get('/feedback', function (req,res,next){
  res.render('educacao_saude/feedback', {usuNome: global.usunome})
});


router.get('/adicionar_lembretes', async function (req, res, next){
  try {
    verificaLogin(res);
   
    const medicamentos = await global.banco.buscarMedicamentos(global.usucodigo);
    res.render('lembrete_medicamentos/adicionar_lembretes', {
      usuNome: global.usunome,
      medicamentos: medicamentos 
    });
  } catch (error) {
    console.error('Erro ao carregar página de adicionar lembretes:', error);
    res.status(500).send('Erro interno do servidor');
  }
}); 

router.get('/meus_lembretes', async function(req, res, next) {
    try {
        verificaLogin(res);
        const lembretes = await global.banco.buscarLembretes(global.usucodigo);
        res.render('lembrete_medicamentos/meus_lembretes', {
            usuNome: global.usunome,
            lembretes: lembretes
        });
    } catch (error) {
        console.error('Erro ao buscar lembretes:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

router.get('/meus_medicamentos', async function(req, res, next) {
    try {
        verificaLogin(res);
        console.log('Acessando rota /meus_medicamentos');
        const medicamentos = await global.banco.buscarMedicamentos(global.usucodigo);
        console.log('Medicamentos retornados do banco para a rota:', medicamentos);
        res.render('lembrete_medicamentos/meus_medicamentos', {
            usuNome: global.usunome,
            medicamentos: medicamentos
        });
    } catch (error) {
        console.error('Erro detalhado ao buscar medicamentos na rota:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

router.get('/registrar_medicamento', function (req,res,next){
  res.render('lembrete_medicamentos/registrar_medicamento', {usuNome: global.usunome})
});


router.get('/agradecimento_cadastro', function(req,res,next){
  res.render('login/agradecimento_cadastro')
});

router.get('/cadastro', function(req,res,next){
  res.render('login/cadastro')
});

router.post('/cadastro', async function(req, res, next) {
  try {
    const { usunome, ususobrenome, usuemail, ususenha } = req.body;


    if (!usunome || !ususobrenome || !usuemail || !ususenha) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

  
    const usuarioExistente = await global.banco.buscarUsuarioPorEmail(usuemail);
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Este email já está cadastrado' });
    }

  
    const novoUsuario = await global.banco.criarUsuario({
      usunome,
      ususobrenome,
      usuemail,
      ususenha
    });

    if (novoUsuario) {
      res.redirect('/agradecimento_cadastro');
    } else {
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.get('/', function(req, res, next) {
  res.render('login/index', {usuNome: global.usunome});
});


router.get('/atualizar_medicoes', async function (req,res,next){
  try {
    verificaLogin(res);
    const medicoes = await global.banco.buscarMedicoes(global.usucodigo);
    const ultimaMedicao = medicoes.length > 0 ? medicoes[0] : null;
    res.render('minhas_medicoes/atualizar_medicoes', {
      usuNome: global.usunome,
      medicao: ultimaMedicao
    });
  } catch (error) {
    console.error('Erro ao buscar medições:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

router.post('/atualizar_medicoes', async function(req, res, next) {
  try {
    verificaLogin(res);
    
    const medicao = {
      usucodigo: global.usucodigo,
      medcodigo: req.body.medcodigo,
      mednome: req.body.mednome,
      medidade: req.body.medidade,
      medaltura: req.body.medaltura,
      medpeso: req.body.medpeso,
      medgordura: req.body.medgordura,
      medmassa: req.body.medmassa,
      medfrequencia: req.body.medfrequencia,
      medpressao: req.body.medpressao,
      medimc: req.body.medimc
    };

    const resultado = await global.banco.atualizarMedicao(medicao);
    
    if (resultado) {
      res.redirect('/minhas_medicoes');
    } else {
      res.status(500).send('Erro ao atualizar medições');
    }
  } catch (error) {
    console.error('Erro ao atualizar medições:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

router.get('/cadastrar_medicoes', function (req,res,next){
  res.render('minhas_medicoes/cadastrar_medicoes', {usuNome: global.usunome})
}); 

router.post('/cadastrar_medicoes', async function(req, res, next) {
  try {
    verificaLogin(res);
    
    const medicao = {
      usucodigo: global.usucodigo,
      mednome: req.body.mednome,
      medidade: req.body.medidade,
      medaltura: req.body.medaltura,
      medpeso: req.body.medpeso,
      medgordura: req.body.medgordura,
      medmassa: req.body.medmassa,
      medfrequencia: req.body.medfrequencia,
      medpressao: req.body.medpressao,
      medimc: req.body.medimc
    };

    const resultado = await global.banco.criarMedicao(medicao);
    
    if (resultado) {
      res.redirect('/minhas_medicoes');
    } else {
      res.status(500).send('Erro ao cadastrar medições');
    }
  } catch (error) {
    console.error('Erro ao cadastrar medições:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

router.get('/minhas_medicoes', async function (req,res,next){
  try {
    verificaLogin(res);
    const medicoes = await global.banco.buscarMedicoes(global.usucodigo);
    res.render('minhas_medicoes/minhas_medicoes', {
      usuNome: global.usunome,
      medicoes: medicoes
    });
  } catch (error) {
    console.error('Erro ao buscar medições:', error);
    res.status(500).send('Erro interno do servidor');
  }
});


router.get('/historico_registros', async function(req, res, next) {
    try {
        verificaLogin(res);
        
        const registrosPressao = await global.banco.buscarRegistrosPressao(global.usucodigo);
        const registrosGlicemia = await global.banco.buscarRegistrosGlicemia(global.usucodigo);
        
        res.render('registro_diario/historico_registros', {
            usuNome: global.usunome,
            registrosPressao: registrosPressao,
            registrosGlicemia: registrosGlicemia
        });
    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        res.status(500).send('Erro ao carregar histórico');
    }
});

router.get('/registro_glicemia', function(req,res,next){
  res.render('registro_diario/registro_glicemia', {usuNome: global.usunome})
});
router.get('/registro_pressao', function (req,res,next){
  res.render('registro_diario/registro_pressao', {usuNome: global.usunome})
});

         

router.get('/editar_medicoes', function (req,res,next){
  res.render('editar_medicoes', {usuNome: global.usunome})
});

router.get('/excluir_medicoes', function (req,res,next){
  res.render('excluir_medicoes', {usuNome: global.usunome})
});


function verificaLogin(res)
{
  if (!global.usuemail || global.usuemail == "")
    res.redirect('/');
}

router.post('/registro_pressao', async function(req, res, next) {
    try {
        verificaLogin(res);
        
        console.log('Dados recebidos do formulário:', req.body);
        
        const registro = {
            usucodigo: global.usucodigo,
            pressao: req.body.pressao,
            frequencia: req.body.frequencia,
            peso: req.body.peso,
            estresse: req.body.estresse,
            sal: req.body.sal,
            liquidos: req.body.liquidos
        };

        console.log('Registro formatado:', registro);

        const resultado = await global.banco.registrarPressao(registro);
        
        if (resultado) {
            console.log('Registro salvo com sucesso. ID:', resultado);
            res.redirect('/historico_registros');
        } else {
            console.error('Falha ao salvar registro');
            res.status(500).send('Erro ao registrar pressão. Por favor, tente novamente.');
        }
    } catch (error) {
        console.error('Erro na rota de registro de pressão:', error);
        res.status(500).send('Erro interno do servidor. Por favor, tente novamente.');
    }
});

router.post('/registro_glicemia', async function(req, res, next) {
    try {
        verificaLogin(res);
        
        const registro = {
            usucodigo: global.usucodigo,
            glicemia: req.body.glicemia,
            momento: req.body.momento,
            alimentacao: req.body.alimentacao
        };

        const resultado = await global.banco.registrarGlicemia(registro);
        
        if (resultado) {
            res.redirect('/historico_registros');
        } else {
            res.status(500).send('Erro ao registrar glicemia');
        }
    } catch (error) {
        console.error('Erro ao registrar glicemia:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

router.post('/adicionar_lembretes', async function(req, res, next) {
    try {
        verificaLogin(res);
        
        console.log('Acessando rota POST /adicionar_lembretes');
        console.log('Dados recebidos do formulário (req.body):', req.body);
        console.log('Usuário atual (global.usucodigo):', global.usucodigo);
        
        const lembrete = {
            usucodigo: global.usucodigo,
            medicamento_codigo: req.body.lembrete_medicamento,
            lembrete_horario: req.body.lembrete_horario,
            lembrete_frequencia: req.body.lembrete_frequencia,
            lembrete_observacoes: req.body.lembrete_observacoes
        };

        console.log('Objeto lembrete formatado:', lembrete);

        const resultado = await global.banco.registrarLembrete(lembrete);
        
        console.log('Resultado do registro no banco:', resultado);
        
        if (resultado) {
            console.log('Lembrete registrado com sucesso! ID:', resultado);
            res.redirect('/meus_lembretes');
        } else {
            console.error('Falha ao registrar lembrete no banco.');
            res.status(500).send('Erro ao registrar lembrete');
        }
    } catch (error) {
        console.error('Erro detalhado na rota POST /adicionar_lembretes:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

router.post('/excluir_medicamento', async function(req, res, next) {
    try {
        verificaLogin(res);
        const medicamentoCodigo = req.body.medicamento_codigo;
        console.log('Recebida requisição para excluir medicamento com código:', medicamentoCodigo);
        const sucesso = await global.banco.excluirMedicamento(medicamentoCodigo);
        if (sucesso) {
            console.log('Medicamento excluído com sucesso.');
            res.redirect('/meus_medicamentos');
        } else {
            console.error('Falha ao excluir medicamento.');
            res.status(500).send('Erro ao excluir medicamento');
        }
    } catch (error) {
        console.error('Erro detalhado na rota de exclusão de medicamento:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

router.post('/excluir_lembrete', async function(req, res, next) {
    try {
        verificaLogin(res);
        const lembreteCodigo = req.body.lembrete_codigo;
        console.log('Recebida requisição para excluir lembrete com código:', lembreteCodigo);
        const sucesso = await global.banco.excluirLembrete(lembreteCodigo);
        if (sucesso) {
            console.log('Lembrete excluído com sucesso.');
            res.redirect('/meus_lembretes');
        } else {
            console.error('Falha ao excluir lembrete.');
            res.status(500).send('Erro ao excluir lembrete');
        }
    } catch (error) {
        console.error('Erro detalhado na rota de exclusão de lembrete:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

router.post('/feedback', async function(req, res, next) {
    try {
        verificaLogin(res);
        
        const feedback = {
            usucodigo: global.usucodigo,
            rating: req.body.rating,
            comentario: req.body.comentario
        };

        const resultado = await global.banco.salvarFeedback(feedback);
        
        if (resultado) {
            res.redirect('/educacao_saude?success=true');
        } else {
            res.redirect('/feedback?error=true');
        }
    } catch (error) {
        console.error('Erro ao salvar feedback:', error);
        res.redirect('/feedback?error=true');
    }
});

module.exports = router;
