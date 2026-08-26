using System.Security.Claims;
using ChamaJussa.Controllers;
using ChamaJussa.DTOs;
using ChamaJussa.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace ChamaJussa.Tests.Controllers;

public class UsuariosControllerTests
{
    private ControllerContext CreateControllerContextWithClaims(string userId, string role)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId),
            new Claim(ClaimTypes.Role, role)
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        return new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };
    }

    [Fact]
    public async Task ObterTodos_DeveRetornarOkComListaDeUsuarios()
    {
        // Arrange
        var mockService = new Mock<IUsuarioService>();
        var lista = new List<UsuarioResponseDto>
        {
            new(Guid.NewGuid(), "User 1", "u1@email.com", "Cliente", DateTime.UtcNow),
            new(Guid.NewGuid(), "User 2", "u2@email.com", "Administrador", DateTime.UtcNow)
        };
        mockService.Setup(s => s.ObterTodosAsync()).ReturnsAsync(lista);

        var controller = new UsuariosController(mockService.Object);

        // Act
        var result = await controller.ObterTodos();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var usuarios = Assert.IsAssignableFrom<IEnumerable<UsuarioResponseDto>>(okResult.Value);
        Assert.Equal(2, usuarios.Count());
    }

    [Fact]
    public async Task ObterPorId_QuandoMesmoUsuario_DeveRetornarOk()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var mockService = new Mock<IUsuarioService>();
        var dto = new UsuarioResponseDto(userId, "Meu Nome", "meu@email.com", "Cliente", DateTime.UtcNow);
        mockService.Setup(s => s.ObterPorIdAsync(userId)).ReturnsAsync(dto);

        var controller = new UsuariosController(mockService.Object)
        {
            ControllerContext = CreateControllerContextWithClaims(userId.ToString(), "Cliente")
        };

        // Act
        var result = await controller.ObterPorId(userId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(dto, okResult.Value);
    }

    [Fact]
    public async Task ObterPorId_QuandoOutroUsuarioENaoAdmin_DeveRetornarForbid()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var outroUserId = Guid.NewGuid();
        var mockService = new Mock<IUsuarioService>();

        var controller = new UsuariosController(mockService.Object)
        {
            ControllerContext = CreateControllerContextWithClaims(userId.ToString(), "Cliente")
        };

        // Act
        var result = await controller.ObterPorId(outroUserId);

        // Assert
        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task Criar_QuandoNaoAdmin_DeveForcarPerfilCliente()
    {
        // Arrange
        var mockService = new Mock<IUsuarioService>();
        CriarUsuarioDto? dtoRecebido = null;

        mockService
            .Setup(s => s.CriarAsync(It.IsAny<CriarUsuarioDto>()))
            .Callback<CriarUsuarioDto>(d => dtoRecebido = d)
            .ReturnsAsync((CriarUsuarioDto d) => new UsuarioResponseDto(Guid.NewGuid(), d.Nome, d.Email, d.Perfil ?? "Cliente", DateTime.UtcNow));

        var controller = new UsuariosController(mockService.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext() // Usuário anônimo / não admin
            }
        };

        var dtoTentarAdmin = new CriarUsuarioDto("Hacker", "hacker@email.com", "Senha123!", "Administrador");

        // Act
        var result = await controller.Criar(dtoTentarAdmin);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.NotNull(dtoRecebido);
        Assert.Equal("Cliente", dtoRecebido.Perfil); // Garante que foi forçado para Cliente
    }

    [Fact]
    public async Task Deletar_QuandoExiste_DeveRetornarNoContent()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var mockService = new Mock<IUsuarioService>();
        mockService.Setup(s => s.DeletarAsync(userId)).ReturnsAsync(true);

        var controller = new UsuariosController(mockService.Object);

        // Act
        var result = await controller.Deletar(userId);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Deletar_QuandoNaoExiste_DeveRetornarNotFound()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var mockService = new Mock<IUsuarioService>();
        mockService.Setup(s => s.DeletarAsync(userId)).ReturnsAsync(false);

        var controller = new UsuariosController(mockService.Object);

        // Act
        var result = await controller.Deletar(userId);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }
}
