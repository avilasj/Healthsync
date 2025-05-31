const mysql = require('mysql2/promise');


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

async function buscarUsuarioPorEmail(email) {
    const conexao = await conectarBD();
    const sql = "SELECT * FROM usuarios WHERE usuemail = ?";
    const [usuario] = await conexao.query(sql, [email]);
    return usuario.length > 0 ? usuario[0] : null;
}

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

async function registrarPressao(registro) {
    try {
        console.log('Iniciando registro de pressão:', registro);
        const conexao = await conectarBD();
        
        const [tabelas] = await conexao.query("SHOW TABLES LIKE 'registro_pressao'");
        if (tabelas.length === 0) {
            console.error('Tabela registro_pressao não existe!');
            return null;
        }

        const sql = `INSERT INTO registro_pressao (
            usucodigo, pressao, frequencia, peso, estresse, 
            sal, liquidos, data_registro
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;
        
        console.log('SQL:', sql);
        console.log('Valores:', [
            registro.usucodigo,
            registro.pressao,
            registro.frequencia,
            registro.peso,
            registro.estresse,
            registro.sal,
            registro.liquidos
        ]);

        const [resultado] = await conexao.query(sql, [
            registro.usucodigo,
            registro.pressao,
            registro.frequencia,
            registro.peso,
            registro.estresse,
            registro.sal,
            registro.liquidos
        ]);

        console.log('Resultado da inserção:', resultado);
        return resultado.insertId;
    } catch (error) {
        console.error('Erro detalhado ao registrar pressão:', error);
        console.error('Mensagem do erro:', error.message);
        console.error('Código do erro:', error.code);
        return null;
    }
}

async function registrarGlicemia(registro) {
    try {
        const conexao = await conectarBD();
        const sql = `INSERT INTO registro_glicemia (
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

async function buscarRegistrosPressao(usucodigo) {
    try {
        const conexao = await conectarBD();
        const sql = `SELECT * FROM registro_pressao 
                    WHERE usucodigo = ? 
                    ORDER BY data_registro DESC`;
        const [registros] = await conexao.query(sql, [usucodigo]);
        return registros;
    } catch (error) {
        console.error('Erro ao buscar registros de pressão:', error);
        return [];
    }
}

async function buscarRegistrosGlicemia(usucodigo) {
    try {
        const conexao = await conectarBD();
        const sql = `SELECT * FROM registro_glicemia 
                    WHERE usucodigo = ? 
                    ORDER BY data_registro DESC`;
        const [registros] = await conexao.query(sql, [usucodigo]);
        return registros;
    } catch (error) {
        console.error('Erro ao buscar registros de glicemia:', error);
        return [];
    }
}

async function registrarMedicamento(medicamento) {
    try {
        console.log('Iniciando registro de medicamento:', medicamento);
        const conexao = await conectarBD();
        
        const [tabelas] = await conexao.query("SHOW TABLES LIKE 'medicamentos'");
        if (tabelas.length === 0) {
            console.error('Tabela medicamentos não existe!');
            return null;
        }

        const sql = `
            INSERT INTO medicamentos (
                usucodigo, medicamento_nome, medicamento_dosagem, 
                medicamento_frequencia, medicamento_horario, medicamento_observacoes
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        console.log('SQL:', sql);
        console.log('Valores:', [
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

        console.log('Resultado da inserção:', resultado);
        return resultado.insertId;
    } catch (error) {
        console.error('Erro detalhado ao registrar medicamento:', error);
        console.error('Mensagem do erro:', error.message);
        console.error('Código do erro:', error.code);
        return null;
    }
}

async function buscarMedicamentos(usucodigo) {
    try {
        console.log('Iniciando busca de medicamentos para o usuário:', usucodigo);
        const conexao = await conectarBD();
        
        const [tabelas] = await conexao.query("SHOW TABLES LIKE 'medicamentos'");
        if (tabelas.length === 0) {
            console.error('Tabela medicamentos não existe!');
            return [];
        }

        const sql = `
            SELECT * FROM medicamentos 
            WHERE usucodigo = ? 
            ORDER BY medicamento_horario ASC
        `;
        
        console.log('SQL de busca de medicamentos:', sql);
        console.log('Valor de usucodigo na busca:', usucodigo);

        const [medicamentos] = await conexao.query(sql, [usucodigo]);
        
        console.log('Resultado da busca de medicamentos:', medicamentos);
        return medicamentos;
    } catch (error) {
        console.error('Erro detalhado ao buscar medicamentos:', error);
        console.error('Mensagem do erro:', error.message);
        console.error('Código do erro:', error.code);
        return [];
    }
}

async function registrarLembrete(lembrete) {
    try {
        console.log('Iniciando registro de lembrete:', lembrete);
        const conexao = await conectarBD();
        
        const [tabelas] = await conexao.query("SHOW TABLES LIKE 'lembretes'");
        if (tabelas.length === 0) {
            console.error('Tabela lembretes não existe!');
            return null;
        }

        const sql = `
            INSERT INTO lembretes (
                usucodigo, medicamento_codigo, lembrete_horario, 
                lembrete_frequencia, lembrete_observacoes
            ) VALUES (?, ?, ?, ?, ?)
        `;
        
        console.log('SQL de registro de lembrete:', sql);
        console.log('Valores para registro de lembrete:', [
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

        console.log('Resultado da inserção de lembrete:', resultado);
        return resultado.insertId;
    } catch (error) {
        console.error('Erro detalhado ao registrar lembrete:', error);
        console.error('Mensagem do erro:', error.message);
        console.error('Código do erro:', error.code);
        return null;
    }
}

async function buscarLembretes(usucodigo) {
    try {
        console.log('Iniciando busca de lembretes para o usuário:', usucodigo);
        const conexao = await conectarBD();
        
        const sql = `
            SELECT 
                l.lembrete_codigo,
                l.usucodigo,
                l.medicamento_codigo, -- Selecionando o codigo do medicamento
                m.medicamento_nome,   -- Selecionando o nome do medicamento da tabela medicamentos
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

async function atualizarUsuario(usuario) {
    try {
        console.log('Iniciando atualização do usuário:', usuario);
        const conexao = await conectarBD();
        const sql = "UPDATE usuarios SET usunome = ?, ususobrenome = ?, usuemail = ? WHERE usucodigo = ?";
        const [resultado] = await conexao.query(sql, [
            usuario.usunome,
            usuario.ususobrenome,
            usuario.usuemail,
            usuario.usucodigo
        ]);
        console.log('Resultado da atualização do usuário:', resultado);
        return resultado.affectedRows > 0;
    } catch (error) {
        console.error('Erro detalhado ao atualizar usuário:', error);
        return false;
    }
}

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
    salvarFeedback
}