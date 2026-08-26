using ChamaJussa.Data;
using ChamaJussa.DTOs;
using ChamaJussa.Models;
using ChamaJussa.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace ChamaJussa.Tests.Services;

public class UsuarioServiceTests
{
    private DbTitaniumContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<DbTitaniumContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new DbTitaniumContext(options);
    }

    [Fact]
    public async Task CriarAsync_ComDadosValidos_DeveCriarUsuarioEHashDeSenha()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var mockTokenService = new Mock<ITokenService>();
        var service = new UsuarioService(context, mockTokenService.Object);

        var dto = new CriarUsuarioDto("João Silva", "joao@email.com", "Senha123!", "Administrador");

        // Act
        var result = await service.CriarAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("João Silva", result.Nome);
        Assert.Equal("joao@email.com", result.Email);
        Assert.Equal("Administrador", result.Perfil);

        var dbUser = await context.TbUsuarios.FirstOrDefaultAsync(u => u.IdUsuario == result.IdUsuario);
        Assert.NotNull(dbUser);
        Assert.NotEqual("Senha123!", dbUser.Senha);
        Assert.True(BCrypt.Net.BCrypt.Verify("Senha123!", dbUser.Senha));
    }

    [Fact]
    public async Task CriarAsync_ComEmailDuplicado_DeveLancaraExcecao()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var mockTokenService = new Mock<ITokenService>();
        var service = new UsuarioService(context, mockTokenService.Object);

        var dto1 = new CriarUsuarioDto("Usuario 1", "duplicado@email.com", "Senha123!", "Cliente");
        await service.CriarAsync(dto1);

        var dto2 = new CriarUsuarioDto("Usuario 2", "DUPLICADO@email.com", "OutraSenha123!", "Cliente");

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => service.CriarAsync(dto2));
        Assert.Equal("Este e-mail já está cadastrado.", ex.Message);
    }

    [Fact]
    public async Task AutenticarAsync_ComCredenciaisValidas_DeveRetornarTokenEResposta()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var mockTokenService = new Mock<ITokenService>();
        mockTokenService.Setup(t => t.GerarToken(It.IsAny<TbUsuario>())).Returns("mocked-jwt-token");

        var service = new UsuarioService(context, mockTokenService.Object);

        var senha = "MinhaSenhaFort3!";
        var dtoCriar = new CriarUsuarioDto("Maria", "maria@email.com", senha, "Cliente");
        await service.CriarAsync(dtoCriar);

        var loginDto = new LoginDto("maria@email.com", senha);

        // Act
        var result = await service.AutenticarAsync(loginDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("mocked-jwt-token", result.Token);
        Assert.Equal("maria@email.com", result.Usuario.Email);
    }

    [Fact]
    public async Task AutenticarAsync_ComSenhaIncorreta_DeveRetornarNull()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var mockTokenService = new Mock<ITokenService>();
        var service = new UsuarioService(context, mockTokenService.Object);

        var dtoCriar = new CriarUsuarioDto("Maria", "maria@email.com", "SenhaCorreta123!", "Cliente");
        await service.CriarAsync(dtoCriar);

        var loginDto = new LoginDto("maria@email.com", "SenhaErrada999!");

        // Act
        var result = await service.AutenticarAsync(loginDto);

        // Assert
        Assert.Null(result);
    }

    [Theory]
    [InlineData("ADM", "Administrador")]
    [InlineData("Técnico", "Funcionario")]
    [InlineData("Outro", "Cliente")]
    public async Task CriarAsync_DeveNormalizarPerfilCorretamente(string perfilEntrada, string perfilEsperado)
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var mockTokenService = new Mock<ITokenService>();
        var service = new UsuarioService(context, mockTokenService.Object);

        var dto = new CriarUsuarioDto("Teste Perfil", $"teste_{Guid.NewGuid()}@email.com", "Senha123!", perfilEntrada);

        // Act
        var result = await service.CriarAsync(dto);

        // Assert
        Assert.Equal(perfilEsperado, result.Perfil);
    }

    [Fact]
    public async Task ObterPorIdAsync_QuandoUsuarioExiste_DeveRetornarUsuario()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var mockTokenService = new Mock<ITokenService>();
        var service = new UsuarioService(context, mockTokenService.Object);

        var criado = await service.CriarAsync(new CriarUsuarioDto("Lucas", "lucas@email.com", "Senha123!", "Cliente"));

        // Act
        var resultado = await service.ObterPorIdAsync(criado.IdUsuario);

        // Assert
        Assert.NotNull(resultado);
        Assert.Equal(criado.IdUsuario, resultado.IdUsuario);
        Assert.Equal("Lucas", resultado.Nome);
    }

    [Fact]
    public async Task DeletarAsync_QuandoUsuarioExiste_DeveRemoverERetornarTrue()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var mockTokenService = new Mock<ITokenService>();
        var service = new UsuarioService(context, mockTokenService.Object);

        var criado = await service.CriarAsync(new CriarUsuarioDto("Pedro", "pedro@email.com", "Senha123!", "Cliente"));

        // Act
        var deletado = await service.DeletarAsync(criado.IdUsuario);

        // Assert
        Assert.True(deletado);
        var busca = await service.ObterPorIdAsync(criado.IdUsuario);
        Assert.Null(busca);
    }
}
