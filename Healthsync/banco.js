const mysql = require('mysql2/promise');

// Conecta ao banco de dados MySQL
async function conectarBD()
{
    if (global.conexao && global.conexao.state !== 'disconnected')
    {
        return global.conexao;
    }

    const conexao = await mysql.createConnection(
        {
            host     : 'localhost',
            port     : 3306,
            user     : 'root',
            password : '',
            database : 'healthsync'
        }
    );

    global.conexao = conexao;

    return global.conexao;
}

// Busca usuário por email e senha
async function buscarUsuario(usuario)
{

    const conexao = await conectarBD();

    const sql = "select * from usuarios where usuemail=? and ususenha=?;";

    const [usuarioEncontrado] = await conexao.query(sql,[usuario.email, usuario.senha]);

    if (usuarioEncontrado && usuarioEncontrado.length > 0)
    {
        return usuarioEncontrado[0];
    }
    else
    {
        return {};
    }
}

// Busca administrador por email e senha
async function buscarAdmin(usuario) 
{
    const conexao = await conectarBD();
    const sql = "select * from admin where admemail=? and admsenha=?;";
    const [adminEncontrado] = await conexao.query(sql, [usuario.email, usuario.senha]);

    if (adminEncontrado && adminEncontrado.length > 0)
    {
        return adminEncontrado[0];
    }
    else
    {
        return {};
    }
}

// Busca usuário apenas por email
async function buscarUsuarioPorEmail(email) {
    const conexao = await conectarBD();
    const sql = "SELECT * FROM usuarios WHERE usuemail = ?";
    const [usuario] = await conexao.query(sql, [email]);
    return usuario.length > 0 ? usuario[0] : null;
}

// Cria novo usuário no sistema
async function criarUsuario(usuario) {
    try {
        const conexao = await conectarBD();
        const sql = "INSERT INTO usuarios (usunome, ususobrenome, usuemail, ususenha) VALUES (?, ?, ?, ?)";
        const [resultado] = await conexao.query(sql, [
            usuario.usunome,
            usuario.ususobrenome,
            usuario.usuemail,
            usuario.ususenha
        ]);
        const usucodigo = resultado.insertId;
        if (usucodigo) {
            await criarDadosComplementares(usucodigo);
        }
        return usucodigo;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return null;
    }
}

// Cria dados complementares para novo usuário
async function criarDadosComplementares(usucodigo) {
    try {
        console.log('Iniciando criação de dados complementares para o usuário:', usucodigo);
        const conexao = await conectarBD();
        const sql = "INSERT INTO dados_complementares (usucodigo) VALUES (?)";
        const [resultado] = await conexao.query(sql, [usucodigo]);
        console.log('Resultado da criação de dados complementares:', resultado);
        return resultado.affectedRows > 0;
    } catch (error) {
        console.error('Erro ao criar dados complementares:', error);
        return false;
    }
}

// Busca dados complementares do usuário
async function buscarDadosComplementares(usucodigo) {
    try {
        console.log('Iniciando busca de dados complementares para o usuário:', usucodigo);
        const conexao = await conectarBD();
        const sql = "SELECT * FROM dados_complementares WHERE usucodigo = ?";
        const [dados] = await conexao.query(sql, [usucodigo]);
        console.log('Resultado da busca de dados complementares:', dados);
        return dados.length > 0 ? dados[0] : null;
    } catch (error) {
        console.error('Erro ao buscar dados complementares:', error);
        return null;
    }
}

// Atualiza dados complementares do usuário
async function atualizarDadosComplementares(dados) {
    try {
        console.log('Iniciando atualização de dados complementares:', dados);
        const conexao = await conectarBD();
        const sql = `UPDATE dados_complementares SET 
                        idade = ?, 
                        telefone = ?, 
                        cidade = ?, 
                        estado = ?, 
                        endereco = ? 
                     WHERE usucodigo = ?`;
        const [resultado] = await conexao.query(sql, [
            dados.idade,
            dados.telefone,
            dados.cidade,
            dados.estado,
            dados.endereco,
            dados.usucodigo
        ]);
        console.log('Resultado da atualização de dados complementares:', resultado);
        return resultado.affectedRows > 0;
    } catch (error) {
        console.error('Erro ao atualizar dados complementares:', error);
        return false;
    }
}

// Cria nova medição no sistema
async function criarMedicao(medicao) {
    try {
        const conexao = await conectarBD();
        const sql = `INSERT INTO medicoes (
            usucodigo, mednome, medidade, medaltura, medpeso, 
            medgordura, medmassa, medfrequencia, medpressao, medimc
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const [resultado] = await conexao.query(sql, [
            medicao.usucodigo,
            medicao.mednome,
            medicao.medidade,
            medicao.medaltura,
            medicao.medpeso,
            medicao.medgordura,
            medicao.medmassa,
            medicao.medfrequencia,
            medicao.medpressao,
            medicao.medimc
        ]);
        return resultado.insertId;
    } catch (error) {
        console.error('Erro ao criar medição:', error);
        return null;
    }
}

// Busca medições do usuário
async function buscarMedicoes(usucodigo) {
    try {
        const conexao = await conectarBD();
        const sql = "SELECT * FROM medicoes WHERE usucodigo = ? ORDER BY meddata DESC";
        const [medicoes] = await conexao.query(sql, [usucodigo]);
        return medicoes;
    } catch (error) {
        console.error('Erro ao buscar medições:', error);
        return [];
    }
}

// Atualiza medição existente
async function atualizarMedicao(medicao) {
    try {
        const conexao = await conectarBD();
        const sql = `UPDATE medicoes SET 
            mednome = ?, medidade = ?, medaltura = ?, medpeso = ?, 
            medgordura = ?, medmassa = ?, medfrequencia = ?, 
            medpressao = ?, medimc = ?
            WHERE medcodigo = ? AND usucodigo = ?`;
        
        const [resultado] = await conexao.query(sql, [
            medicao.mednome,
            medicao.medidade,
            medicao.medaltura,
            medicao.medpeso,
            medicao.medgordura,
            medicao.medmassa,
            medicao.medfrequencia,
            medicao.medpressao,
            medicao.medimc,
            medicao.medcodigo,
            medicao.usucodigo
        ]);
        return resultado.affectedRows > 0;
    } catch (error) {
        console.error('Erro ao atualizar medição:', error);
        return false;
    }
}

// Registra pressão arterial do usuário
async function registrarPressao(registro) {
    try {
        const conexao = await conectarBD();
        const sql = `INSERT INTO registros_pressao (
            usucodigo, pressao, frequencia, peso, estresse, sal, liquidos, data_registro
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;
        
        const [resultado] = await conexao.query(sql, [
            registro.usucodigo,
            registro.pressao,
            registro.frequencia,
            registro.peso,
            registro.estresse,
            registro.sal,
            registro.liquidos
        ]);
        return resultado.insertId;
    } catch (error) {
        console.error('Erro ao registrar pressão:', error);
        return null;
    }
}

// Registra glicemia do usuário
async function registrarGlicemia(registro) {
    try {
        const conexao = await conectarBD();
        const sql = `INSERT INTO registros_glicemia (
            usucodigo, glicemia, momento, alimentacao, data_registro
        ) VALUES (?, ?, ?, ?, NOW())`;
        
        const [resultado] = await conexao.query(sql, [
            registro.usucodigo,
            registro.glicemia,
            registro.momento,
            registro.alimentacao
        ]);
        return resultado.insertId;
    } catch (error) {
        console.error('Erro ao registrar glicemia:', error);
        return null;
    }
}

// Busca registros de pressão do usuário
async function buscarRegistrosPressao(usucodigo) {
    try {
        const conexao = await conectarBD();
        const sql = "SELECT * FROM registros_pressao WHERE usucodigo = ? ORDER BY data_registro DESC";
        const [registros] = await conexao.query(sql, [usucodigo]);
        return registros;
    } catch (error) {
        console.error('Erro ao buscar registros de pressão:', error);
        return [];
    }
}

// Busca registros de glicemia do usuário
async function buscarRegistrosGlicemia(usucodigo) {
    try {
        const conexao = await conectarBD();
        const sql = "SELECT * FROM registros_glicemia WHERE usucodigo = ? ORDER BY data_registro DESC";
        const [registros] = await conexao.query(sql, [usucodigo]);
        return registros;
    } catch (error) {
        console.error('Erro ao buscar registros de glicemia:', error);
        return [];
    }
}

// Registra medicamento no sistema
async function registrarMedicamento(medicamento) {
    try {
        console.log('Iniciando registro de medicamento:', medicamento);
        const conexao = await conectarBD();
        const sql = `INSERT INTO medicamentos (
            usucodigo, medicamento_nome, medicamento_dosagem, 
            medicamento_frequencia, medicamento_horario, medicamento_observacoes, 
            medicamento_data_registro
        ) VALUES (?, ?, ?, ?, ?, ?, NOW())`;
        
        console.log('SQL de inserção:', sql);
        console.log('Valores a serem inseridos:', [
            medicamento.usucodigo,
            medicamento.medicamento_nome,
            medicamento.medicamento_dosagem,
            medicamento.medicamento_frequencia,
            medicamento.medicamento_horario,
            medicamento.medicamento_observacoes
        ]);

        const [resultado] = await conexao.query(sql, [
            medicamento.usucodigo,
            medicamento.medicamento_nome,
            medicamento.medicamento_dosagem,
            medicamento.medicamento_frequencia,
            medicamento.medicamento_horario,
            medicamento.medicamento_observacoes
        ]);
        
        console.log('Medicamento registrado com sucesso. ID:', resultado.insertId);
        return resultado.insertId;
    } catch (error) {
        console.error('Erro detalhado ao registrar medicamento:', error);
        console.error('Mensagem do erro:', error.message);
        console.error('Código do erro:', error.code);
        return null;
    }
}

// Busca medicamentos do usuário
async function buscarMedicamentos(usucodigo) {
    try {
        console.log('Iniciando busca de medicamentos para o usuário:', usucodigo);
        const conexao = await conectarBD();
        const sql = "SELECT * FROM medicamentos WHERE usucodigo = ? ORDER BY medicamento_data_registro DESC";
        const [medicamentos] = await conexao.query(sql, [usucodigo]);
        console.log('Medicamentos encontrados:', medicamentos);
        return medicamentos;
    } catch (error) {
        console.error('Erro detalhado ao buscar medicamentos:', error);
        console.error('Mensagem do erro:', error.message);
        console.error('Código do erro:', error.code);
        return [];
    }
}

// Registra lembrete de medicamento
async function registrarLembrete(lembrete) {
    try {
        console.log('Iniciando registro de lembrete:', lembrete);
        const conexao = await conectarBD();
        const sql = `INSERT INTO lembretes (
            usucodigo, medicamento_codigo, lembrete_horario, 
            lembrete_frequencia, lembrete_observacoes, lembrete_data_registro
        ) VALUES (?, ?, ?, ?, ?, NOW())`;
        
        console.log('SQL de inserção de lembrete:', sql);
        console.log('Valores a serem inseridos:', [
            lembrete.usucodigo,
            lembrete.medicamento_codigo,
            lembrete.lembrete_horario,
            lembrete.lembrete_frequencia,
            lembrete.lembrete_observacoes
        ]);

        const [resultado] = await conexao.query(sql, [
            lembrete.usucodigo,
            lembrete.medicamento_codigo,
            lembrete.lembrete_horario,
            lembrete.lembrete_frequencia,
            lembrete.lembrete_observacoes
        ]);
        
        console.log('Lembrete registrado com sucesso. ID:', resultado.insertId);
        return resultado.insertId;
    } catch (error) {
        console.error('Erro detalhado ao registrar lembrete:', error);
        console.error('Mensagem do erro:', error.message);
        console.error('Código do erro:', error.code);
        return null;
    }
}

// Busca lembretes do usuário
async function buscarLembretes(usucodigo) {
    try {
        console.log('Iniciando busca de lembretes para o usuário:', usucodigo);
        const conexao = await conectarBD();
        const sql = `
            SELECT 
                l.lembrete_codigo,
                l.usucodigo,
                l.medicamento_codigo,
                m.medicamento_nome,
                l.lembrete_horario,
                l.lembrete_frequencia,
                l.lembrete_observacoes,
                l.lembrete_data_registro
            FROM lembretes l
            JOIN medicamentos m ON l.medicamento_codigo = m.medicamento_codigo
            WHERE l.usucodigo = ? 
            ORDER BY l.lembrete_horario ASC
        `;
        
        console.log('SQL de busca de lembretes:', sql);
        console.log('Valor de usucodigo na busca de lembretes:', usucodigo);

        const [lembretes] = await conexao.query(sql, [usucodigo]);
        
        console.log('Resultado da busca de lembretes:', lembretes);
        return lembretes;
    } catch (error) {
        console.error('Erro detalhado ao buscar lembretes:', error);
        console.error('Mensagem do erro:', error.message);
        console.error('Código do erro:', error.code);
        return [];
    }
}

// Exclui medicamento do sistema
async function excluirMedicamento(medicamentoCodigo) {
    try {
        console.log('Iniciando exclusão de medicamento com código:', medicamentoCodigo);
        const conexao = await conectarBD();
        const sql = `DELETE FROM medicamentos WHERE medicamento_codigo = ?`;
        const [resultado] = await conexao.query(sql, [medicamentoCodigo]);
        console.log('Resultado da exclusão de medicamento:', resultado);
        return resultado.affectedRows > 0;
    } catch (error) {
        console.error('Erro detalhado ao excluir medicamento:', error);
        return false;
    }
}

// Exclui lembrete do sistema
async function excluirLembrete(lembreteCodigo) {
    try {
        console.log('Iniciando exclusão de lembrete com código:', lembreteCodigo);
        const conexao = await conectarBD();
        const sql = `DELETE FROM lembretes WHERE lembrete_codigo = ?`;
        const [resultado] = await conexao.query(sql, [lembreteCodigo]);
        console.log('Resultado da exclusão de lembrete:', resultado);
        return resultado.affectedRows > 0;
    } catch (error) {
        console.error('Erro detalhado ao excluir lembrete:', error);
        return false;
    }
}

// Busca usuário por código
async function buscarUsuarioPorCodigo(usucodigo) {
    try {
        console.log('Iniciando busca de usuário por código:', usucodigo);
        const conexao = await conectarBD();
        const sql = "SELECT usucodigo, usunome, ususobrenome, usuemail FROM usuarios WHERE usucodigo = ?";
        const [usuario] = await conexao.query(sql, [usucodigo]);
        console.log('Resultado da busca de usuário por código:', usuario);
        return usuario.length > 0 ? usuario[0] : null;
    } catch (error) {
        console.error('Erro ao buscar usuário por código:', error);
        return null;
    }
}

// Atualiza dados do usuário
async function atualizarUsuario(usuario) {
    try {
        console.log('Iniciando atualização do usuário:', usuario);
        const conexao = await conectarBD();
        const sql = "UPDATE usuarios SET usunome = ?, usuemail = ?, ususenha = ? WHERE usucodigo = ?";
        const [resultado] = await conexao.query(sql, [
            usuario.usunome,
            usuario.usuemail,
            usuario.ususenha,
            usuario.usucodigo
        ]);
        console.log('Resultado da atualização do usuário:', resultado);
        return resultado.affectedRows > 0;
    } catch (error) {
        console.error('Erro detalhado ao atualizar usuário:', error);
        return false;
    }
}

// Salva feedback do usuário
async function salvarFeedback(feedback) {
    try {
        console.log('Iniciando salvamento do feedback:', feedback);
        const conexao = await conectarBD();
        
        const [tabelas] = await conexao.query("SHOW TABLES LIKE 'feedback'");
        if (tabelas.length === 0) {
            console.error('Tabela feedback não existe!');
            await criarTabelaFeedback();
        }

        const sql = `INSERT INTO feedback (
            usucodigo, rating, comentario, data_feedback
        ) VALUES (?, ?, ?, NOW())`;
        
        console.log('SQL:', sql);
        console.log('Valores:', [
            feedback.usucodigo,
            feedback.rating,
            feedback.comentario
        ]);

        const [resultado] = await conexao.query(sql, [
            feedback.usucodigo,
            feedback.rating,
            feedback.comentario
        ]);
        
        console.log('Feedback salvo com sucesso. ID:', resultado.insertId);
        return resultado.insertId;
    } catch (error) {
        console.error('Erro ao salvar feedback:', error);
        console.error('Mensagem do erro:', error.message);
        console.error('Código do erro:', error.code);
        return null;
    }
}

// Cria tabela de feedback se não existir
async function criarTabelaFeedback() {
    try {
        console.log('Iniciando criação da tabela feedback...');
        const conexao = await conectarBD();
        
        const [tabelas] = await conexao.query("SHOW TABLES LIKE 'feedback'");
        console.log('Verificação de tabelas existentes:', tabelas);
        
        if (tabelas.length === 0) {
            console.log('Tabela feedback não encontrada. Criando...');
            const sql = `
                CREATE TABLE IF NOT EXISTS feedback (
                    feedback_codigo INT AUTO_INCREMENT PRIMARY KEY,
                    usucodigo INT NOT NULL,
                    rating INT NOT NULL,
                    comentario TEXT NOT NULL,
                    data_feedback DATETIME NOT NULL,
                    FOREIGN KEY (usucodigo) REFERENCES usuarios(usucodigo)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            `;
            await conexao.query(sql);
            console.log('Tabela feedback criada com sucesso!');
        } else {
            console.log('Tabela feedback já existe.');
        }
    } catch (error) {
        console.error('Erro ao criar tabela feedback:', error);
        console.error('Mensagem do erro:', error.message);
        console.error('Código do erro:', error.code);
    }
}

// Busca todos os usuários
async function buscarUsuarios() {
    const conexao = await conectarBD();
    const sql = "SELECT * FROM usuarios";
    const [usuarios] = await conexao.query(sql);
    return usuarios;
}

// Exclui usuário e seus dados complementares
async function excluirUsuario(usucodigo) {
    const conexao = await conectarBD();
    await conexao.query("DELETE FROM dados_complementares WHERE usucodigo = ?", [usucodigo]);
    await conexao.query("DELETE FROM usuarios WHERE usucodigo = ?", [usucodigo]);
}

// Reseta senha do usuário
async function resetarSenhaUsuario(usucodigo, novaSenha) {
    const conexao = await conectarBD();
    const sql = "UPDATE usuarios SET ususenha = ? WHERE usucodigo = ?";
    await conexao.query(sql, [novaSenha, usucodigo]);
}

// Busca usuários com filtro de busca
async function buscarUsuariosFiltrado(termo) {
    const conexao = await conectarBD();
    if (!termo || termo.trim() === "") {
        const sql = "SELECT * FROM usuarios";
        const [usuarios] = await conexao.query(sql);
        return usuarios;
    } else {
        const sql = `SELECT * FROM usuarios WHERE usunome LIKE ? OR usuemail LIKE ? OR ususenha LIKE ?`;
        const like = `%${termo}%`;
        const [usuarios] = await conexao.query(sql, [like, like, like]);
        return usuarios;
    }
}

async function consultarUsuariosLembretesMedicamentos() {
    try {
        const conexao = await conectarBD();
        const sql = `
            SELECT 
                u.usunome AS NomeUsuario,
                m.medicamento_nome AS NomeMedicamento,
                l.lembrete_horario AS HorarioLembrete,
                l.lembrete_frequencia AS FrequenciaLembrete
            FROM 
                usuarios u
            INNER JOIN lembretes l ON u.usucodigo = l.usucodigo
            INNER JOIN medicamentos m ON l.medicamento_codigo = m.medicamento_codigo
            ORDER BY 
                u.usunome, l.lembrete_horario;
        `;
        const [rows] = await conexao.query(sql);
        return rows;
    } catch (error) {
        console.error('Erro ao consultar usuários com lembretes de medicamentos:', error);
        return [];
    }
}

async function consultarUsuariosGlicemia() {
    try {
        const conexao = await conectarBD();
        const sql = `
            SELECT 
                u.usunome AS NomeUsuario,
                dc.idade AS Idade,
                rg.glicemia AS ValorGlicemia,
                rg.momento AS Momento,
                rg.data_registro AS DataRegistro
            FROM 
                usuarios u
            INNER JOIN dados_complementares dc ON u.usucodigo = dc.usucodigo
            INNER JOIN registro_glicemia rg ON u.usucodigo = rg.usucodigo
            ORDER BY 
                u.usunome, rg.data_registro DESC;
        `;
        const [rows] = await conexao.query(sql);
        return rows;
    } catch (error) {
        console.error('Erro ao consultar registros de glicemia dos usuários:', error);
        return [];
    }
}

async function consultarUsuariosMedicamentosPressao() {
    try {
        const conexao = await conectarBD();
        const sql = `
            SELECT 
                u.usunome AS NomeUsuario,
                m.medicamento_nome AS NomeMedicamento,
                rp.pressao AS ValorPressao,
                rp.frequencia AS Frequencia,
                rp.data_registro AS DataRegistro
            FROM 
                usuarios u
            INNER JOIN medicamentos m ON u.usucodigo = m.usucodigo
            INNER JOIN registro_pressao rp ON u.usucodigo = rp.usucodigo
            ORDER BY 
                u.usunome, rp.data_registro DESC;
        `;
        const [rows] = await conexao.query(sql);
        return rows;
    } catch (error) {
        console.error('Erro ao consultar usuários, medicamentos e pressão:', error);
        return [];
    }
}

// Função para buscar usuários com medicamentos ativos
async function buscarUsuariosMedicamentos() {
    try {
        const conexao = await conectarBD();
        const sql = `
            SELECT 
                u.usunome,
                u.ususobrenome,
                u.usuemail,
                m.medicamento_nome,
                m.medicamento_dosagem,
                m.medicamento_frequencia
            FROM 
                usuarios u
            INNER JOIN medicamentos m ON u.usucodigo = m.usucodigo
            ORDER BY 
                u.usunome
        `;
        const [resultado] = await conexao.query(sql);
        return resultado;
    } catch (error) {
        console.error('Erro ao buscar usuários com medicamentos:', error);
        return [];
    }
}

// Função para buscar usuários com registros de pressão
async function buscarUsuariosPressao() {
    try {
        const conexao = await conectarBD();
        const sql = `
            SELECT 
                u.usunome,
                u.ususobrenome,
                u.usuemail,
                rp.pressao,
                rp.data_registro
            FROM 
                usuarios u
            INNER JOIN registro_pressao rp ON u.usucodigo = rp.usucodigo
            ORDER BY 
                rp.data_registro DESC
        `;
        const [resultado] = await conexao.query(sql);
        return resultado;
    } catch (error) {
        console.error('Erro ao buscar usuários com pressão:', error);
        return [];
    }
}

async function buscarAnaliseIMC(usucodigo) {
    try {
        const conexao = await conectarBD();
        const sql = `
            SELECT 
                medcodigo,
                medpeso,
                medaltura,
                medimc,
                meddata,
                CASE 
                    WHEN medimc < 18.5 THEN 'Abaixo do peso'
                    WHEN medimc < 25 THEN 'Peso normal'
                    WHEN medimc < 30 THEN 'Sobrepeso'
                    WHEN medimc < 35 THEN 'Obesidade Grau I'
                    WHEN medimc < 40 THEN 'Obesidade Grau II'
                    ELSE 'Obesidade Grau III'
                END AS classificacao_imc,
                CASE 
                    WHEN medimc < 18.5 THEN 'Baixo peso pode indicar desnutrição'
                    WHEN medimc < 25 THEN 'Peso saudável - mantenha!'
                    WHEN medimc < 30 THEN 'Sobrepeso - considere mudanças na dieta'
                    WHEN medimc < 35 THEN 'Obesidade Grau I - procure orientação médica'
                    WHEN medimc < 40 THEN 'Obesidade Grau II - atenção redobrada'
                    ELSE 'Obesidade Grau III - procure ajuda médica urgente'
                END AS recomendacao,
                (SELECT medimc FROM medicoes 
                 WHERE usucodigo = m.usucodigo 
                 AND meddata < m.meddata 
                 ORDER BY meddata DESC LIMIT 1) AS imc_anterior,
                ROUND(medimc - (SELECT medimc FROM medicoes 
                               WHERE usucodigo = m.usucodigo 
                               AND meddata < m.meddata 
                               ORDER BY meddata DESC LIMIT 1), 2) AS variacao_imc
            FROM medicoes m
            WHERE usucodigo = ?
            ORDER BY meddata DESC
        `;
        const [resultado] = await conexao.query(sql, [usucodigo]);
        return resultado;
    } catch (error) {
        console.error('Erro ao buscar análise de IMC:', error);
        return [];
    }
}

async function atualizarContatoUsuario(usucodigo, telefone, endereco) {
    const sql = "CALL AtualizarContatoUsuario(?, ?, ?)";
    return new Promise((resolve, reject) => {
        conexao.query(sql, [usucodigo, telefone, endereco], (erro, resultados) => {
            if (erro) {
                reject(erro);
            } else {
                resolve(resultados);
            }
        });
    });
}

(async () => {
    try {
        await criarTabelaFeedback();
    } catch (error) {
        console.error('Erro ao inicializar tabela feedback:', error);
    }
})();

module.exports = {
    buscarUsuario, 
    buscarAdmin, 
    buscarUsuarioPorEmail, 
    criarUsuario,
    criarDadosComplementares,
    buscarDadosComplementares,
    atualizarDadosComplementares,
    criarMedicao,
    buscarMedicoes,
    atualizarMedicao,
    registrarPressao,
    registrarGlicemia,
    buscarRegistrosPressao,
    buscarRegistrosGlicemia,
    registrarMedicamento,
    buscarMedicamentos,
    registrarLembrete,
    buscarLembretes,
    excluirMedicamento,
    excluirLembrete,
    buscarUsuarioPorCodigo,
    atualizarUsuario,
    salvarFeedback,
    buscarUsuarios,
    buscarUsuariosFiltrado,
    excluirUsuario,
    resetarSenhaUsuario,
    consultarUsuariosLembretesMedicamentos,
    consultarUsuariosGlicemia,
    consultarUsuariosMedicamentosPressao,
    buscarUsuariosMedicamentos,
    buscarUsuariosPressao,
    buscarAnaliseIMC,
    atualizarContatoUsuario
}