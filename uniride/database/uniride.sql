-- =============================================================
-- UniRide - Script do banco de dados (MySQL / MariaDB)
-- Como usar: abra o phpMyAdmin, clique em "Importar" e selecione
-- este arquivo. Ele cria o banco, as tabelas e os dados de teste.
-- =============================================================

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS uniride;
CREATE DATABASE uniride CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE uniride;

-- Usuários: alunos, professores e funcionários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    vinculo ENUM('ALUNO', 'PROFESSOR', 'FUNCIONARIO') NOT NULL,
    curso_setor VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Veículos dos motoristas
CREATE TABLE veiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    modelo VARCHAR(60) NOT NULL,
    cor VARCHAR(30) NOT NULL,
    placa VARCHAR(10) NOT NULL UNIQUE,
    consumo DECIMAL(4,1) NOT NULL,      -- consumo médio em km/l
    lugares INT NOT NULL,               -- lugares livres para passageiros
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Caronas oferecidas
CREATE TABLE caronas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    motorista_id INT NOT NULL,
    veiculo_id INT NOT NULL,
    origem VARCHAR(150) NOT NULL,
    destino VARCHAR(150) NOT NULL,
    data_hora DATETIME NOT NULL,
    distancia DECIMAL(5,1) NOT NULL,         -- em km
    preco_combustivel DECIMAL(5,2) NOT NULL, -- preço do litro
    vagas INT NOT NULL,
    observacoes VARCHAR(255),
    status ENUM('ABERTA', 'CONCLUIDA', 'CANCELADA') DEFAULT 'ABERTA',
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (motorista_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (veiculo_id) REFERENCES veiculos(id)
) ENGINE=InnoDB;

-- Pedidos de vaga feitos pelos passageiros
CREATE TABLE solicitacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carona_id INT NOT NULL,
    passageiro_id INT NOT NULL,
    ponto_embarque VARCHAR(150) NOT NULL,
    mensagem VARCHAR(255),
    status ENUM('PENDENTE', 'ACEITA', 'RECUSADA', 'CANCELADA') DEFAULT 'PENDENTE',
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (carona_id) REFERENCES caronas(id) ON DELETE CASCADE,
    FOREIGN KEY (passageiro_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Avaliações feitas depois da viagem
CREATE TABLE avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carona_id INT NOT NULL,
    avaliador_id INT NOT NULL,
    avaliado_id INT NOT NULL,
    nota INT NOT NULL,                  -- de 1 a 5 estrelas
    comentario VARCHAR(255),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (carona_id) REFERENCES caronas(id) ON DELETE CASCADE,
    FOREIGN KEY (avaliador_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (avaliado_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Denúncias enviadas para a segurança da universidade
CREATE TABLE denuncias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carona_id INT,
    denunciante_id INT NOT NULL,
    denunciado_id INT NOT NULL,
    motivo VARCHAR(60) NOT NULL,
    descricao TEXT NOT NULL,
    status ENUM('ABERTA', 'EM_ANALISE', 'RESOLVIDA') DEFAULT 'ABERTA',
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (carona_id) REFERENCES caronas(id) ON DELETE SET NULL,
    FOREIGN KEY (denunciante_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (denunciado_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================================
-- DADOS DE TESTE (senha de todos os usuários: 123456)
-- =============================================================
INSERT INTO usuarios (nome, email, senha, vinculo, curso_setor, telefone) VALUES
('Lucas Ferreira',   'lucas@senacsp.edu.br',  '$2y$10$aSDHxYfeAMmyRf9Pc7P.nuL6SJ7LXoZGgNeOYuulu152D8qXIfA4i', 'ALUNO',       'Análise e Desenvolvimento de Sistemas', '(11) 98888-1001'),
('Camila Souza',     'camila@senacsp.edu.br', '$2y$10$aSDHxYfeAMmyRf9Pc7P.nuL6SJ7LXoZGgNeOYuulu152D8qXIfA4i', 'ALUNO',       'Design Gráfico',                        '(11) 98888-1002'),
('Marcos Oliveira',  'marcos@senacsp.edu.br', '$2y$10$aSDHxYfeAMmyRf9Pc7P.nuL6SJ7LXoZGgNeOYuulu152D8qXIfA4i', 'FUNCIONARIO', 'Laboratórios de Informática',           '(11) 98888-1003'),
('Renata Lima',      'renata@senacsp.edu.br', '$2y$10$aSDHxYfeAMmyRf9Pc7P.nuL6SJ7LXoZGgNeOYuulu152D8qXIfA4i', 'PROFESSOR',   'Gestão e Negócios',                     '(11) 98888-1004'),
('João Pedro Alves', 'joao@senacsp.edu.br',   '$2y$10$aSDHxYfeAMmyRf9Pc7P.nuL6SJ7LXoZGgNeOYuulu152D8qXIfA4i', 'ALUNO',       'Engenharia de Computação',              '(11) 98888-1005');

INSERT INTO veiculos (usuario_id, modelo, cor, placa, consumo, lugares) VALUES
(1, 'Fiat Argo 1.0', 'Prata',  'FTA-2B34', 12.5, 3),
(4, 'Honda City',    'Preto',  'RNL-7C21', 11.0, 4),
(5, 'VW Gol 1.6',    'Branco', 'JPA-4D56', 10.5, 3);

-- As datas são calculadas a partir do dia em que o script é importado
INSERT INTO caronas (motorista_id, veiculo_id, origem, destino, data_hora, distancia, preco_combustivel, vagas, observacoes, status) VALUES
(1, 1, 'Jabaquara - Metrô Jabaquara', 'Senac Santo Amaro', TIMESTAMP(CURDATE() - INTERVAL 2 DAY, '18:10:00'), 12, 6.29, 3, 'Saio pontualmente.', 'CONCLUIDA'),
(1, 1, 'Jabaquara - Metrô Jabaquara', 'Senac Santo Amaro', TIMESTAMP(CURDATE() + INTERVAL 1 DAY, '18:10:00'), 12, 6.29, 3, 'Saio pontualmente. Embarque na saída da Rua Nelson Fernandes.', 'ABERTA'),
(4, 2, 'Moema - Av. Ibirapuera', 'Senac Santo Amaro', TIMESTAMP(CURDATE() + INTERVAL 1 DAY, '07:20:00'), 9, 6.29, 4, 'Ar-condicionado e música baixa.', 'ABERTA'),
(5, 3, 'Interlagos - Autódromo', 'Senac Santo Amaro', TIMESTAMP(CURDATE() + INTERVAL 2 DAY, '18:30:00'), 8, 6.19, 3, NULL, 'ABERTA'),
(4, 2, 'Senac Santo Amaro', 'Moema - Av. Ibirapuera', TIMESTAMP(CURDATE() + INTERVAL 1 DAY, '22:40:00'), 9, 6.29, 4, 'Volta após a aula do noturno.', 'ABERTA'),
(5, 3, 'Senac Santo Amaro', 'Interlagos - Autódromo', TIMESTAMP(CURDATE() + INTERVAL 2 DAY, '22:35:00'), 8, 6.19, 3, 'Posso deixar perto da estação Autódromo (CPTM).', 'ABERTA');

-- Camila e Marcos viajaram com o Lucas na carona 1 (já concluída)
INSERT INTO solicitacoes (carona_id, passageiro_id, ponto_embarque, mensagem, status) VALUES
(1, 2, 'Saída do Metrô Jabaquara', 'Oi! Tenho aula às 19h.', 'ACEITA'),
(1, 3, 'Saída do Metrô Jabaquara', NULL, 'ACEITA');

INSERT INTO avaliacoes (carona_id, avaliador_id, avaliado_id, nota, comentario) VALUES
(1, 3, 1, 5, 'Pontual e dirige com cuidado.'),
(1, 1, 3, 5, 'Passageiro tranquilo.');
