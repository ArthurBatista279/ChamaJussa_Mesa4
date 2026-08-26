using ChamaJussa.Data;
using ChamaJussa.DTOs;
using ChamaJussa.Models;
using ChamaJussa.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace ChamaJussa.Tests.Services;

public class PedidoServiceTests
{
    private DbTitaniumContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<DbTitaniumContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new DbTitaniumContext(options);
    }

    private async Task<TbUsuario> SeedUsuarioAsync(DbTitaniumContext context, string nome = "Cliente Teste")
    {
        var usuario = new TbUsuario
        {
            IdUsuario = Guid.NewGuid(),
            Nome = nome,
            Email = $"usuario_{Guid.NewGuid()}@teste.com",
            Senha = "hashedpassword",
            Perfil = "Cliente",
            DataCriacao = DateTime.UtcNow
        };
        context.TbUsuarios.Add(usuario);
        await context.SaveChangesAsync();
        return usuario;
    }

    [Fact]
    public async Task CriarAsync_ComUsuarioValido_DeveCriarPedido()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var usuario = await SeedUsuarioAsync(context, "Ana Paula");
        var service = new PedidoService(context);

        var dto = new CriarPedidoDto("Manutenção de Notebook", "Limpeza e troca de pasta térmica", usuario.IdUsuario);

        // Act
        var result = await service.CriarAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Manutenção de Notebook", result.Titulo);
        Assert.Equal("Limpeza e troca de pasta térmica", result.Descricao);
        Assert.Equal("Pendente", result.Status);
        Assert.Equal(usuario.IdUsuario, result.IdUsuario);
        Assert.Equal("Ana Paula", result.NomeUsuario);
    }

    [Fact]
    public async Task CriarAsync_ComUsuarioInexistente_DeveLancarExcecao()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var service = new PedidoService(context);

        var dto = new CriarPedidoDto("Título", "Descrição", Guid.NewGuid());

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => service.CriarAsync(dto));
        Assert.Equal("Usuário informado não existe.", ex.Message);
    }

    [Fact]
    public async Task AtualizarStatusAsync_QuandoPedidoExiste_DeveAtualizarStatus()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var usuario = await SeedUsuarioAsync(context);
        var service = new PedidoService(context);

        var pedidoCriado = await service.CriarAsync(new CriarPedidoDto("Troca de Tela", "Troca da tela quebrada", usuario.IdUsuario));

        // Act
        var resultado = await service.AtualizarStatusAsync(pedidoCriado.IdPedido, "Em Andamento");

        // Assert
        Assert.NotNull(resultado);
        Assert.Equal("Em Andamento", resultado.Status);
        Assert.NotNull(resultado.DataAtualizacao);
    }

    [Fact]
    public async Task ObterPorUsuarioAsync_DeveRetornarSomentePedidosDoUsuario()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var u1 = await SeedUsuarioAsync(context, "User 1");
        var u2 = await SeedUsuarioAsync(context, "User 2");
        var service = new PedidoService(context);

        await service.CriarAsync(new CriarPedidoDto("Pedido U1 - 1", "Desc", u1.IdUsuario));
        await service.CriarAsync(new CriarPedidoDto("Pedido U1 - 2", "Desc", u1.IdUsuario));
        await service.CriarAsync(new CriarPedidoDto("Pedido U2 - 1", "Desc", u2.IdUsuario));

        // Act
        var pedidosU1 = await service.ObterPorUsuarioAsync(u1.IdUsuario);
        var pedidosU2 = await service.ObterPorUsuarioAsync(u2.IdUsuario);

        // Assert
        Assert.Equal(2, pedidosU1.Count());
        Assert.Single(pedidosU2);
    }

    [Fact]
    public async Task DeletarAsync_QuandoPedidoExiste_DeveRemoverERetornarTrue()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var usuario = await SeedUsuarioAsync(context);
        var service = new PedidoService(context);

        var pedidoCriado = await service.CriarAsync(new CriarPedidoDto("Pedido Para Excluir", "Desc", usuario.IdUsuario));

        // Act
        var deletado = await service.DeletarAsync(pedidoCriado.IdPedido);

        // Assert
        Assert.True(deletado);
        var busca = await service.ObterPorIdAsync(pedidoCriado.IdPedido);
        Assert.Null(busca);
    }
}
