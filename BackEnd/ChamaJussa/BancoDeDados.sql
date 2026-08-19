-- Script de Criação do Banco de Dados db_titanium
-- Projeto Chama Jussa

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'db_titanium')
BEGIN
    CREATE DATABASE db_titanium;
END
GO

USE db_titanium;
GO

-- 1. Tabela de Usuários
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tb_usuario]') AND type in (N'U'))
BEGIN
    CREATE TABLE tb_usuario (
        IdUsuario UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        Nome NVARCHAR(255) NOT NULL,
        Email NVARCHAR(255) UNIQUE NOT NULL,
        Senha NVARCHAR(255) NOT NULL, -- Tamanho adequado para Hash BCrypt
        Perfil NVARCHAR(50) NOT NULL DEFAULT 'Cliente', -- Suporte a Roles JWT
        DataCriacao DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
END
GO

-- 2. Tabela de Pedidos / Ordens de Serviço (OS)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[tb_pedido]') AND type in (N'U'))
BEGIN
    CREATE TABLE tb_pedido (
        IdPedido UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        Titulo NVARCHAR(150) NOT NULL,
        Descricao NVARCHAR(MAX) NOT NULL,
        Status NVARCHAR(50) NOT NULL DEFAULT 'Pendente', -- ex: Pendente, EmAndamento, Concluido, Cancelado
        DataCriacao DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        DataAtualizacao DATETIME2 NULL,
        IdUsuario UNIQUEIDENTIFIER NOT NULL,
        CONSTRAINT FK_tb_pedido_tb_usuario FOREIGN KEY (IdUsuario) REFERENCES tb_usuario(IdUsuario) ON DELETE CASCADE
    );
END
GO
