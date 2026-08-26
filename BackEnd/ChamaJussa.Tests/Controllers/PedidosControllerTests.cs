using System.Security.Claims;
using ChamaJussa.Controllers;
using ChamaJussa.DTOs;
using ChamaJussa.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace ChamaJussa.Tests.Controllers;

public class PedidosControllerTests
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
    public async Task ObterTodos_QuandoAdmin_DeveRetornarTodosOsPedidos()
    {
        // Arrange
        var mockService = new Mock<IPedidoService>();
        var pedidos = new List<PedidoResponseDto>
        {
            new(Guid.NewGuid(), "OS 1", "Desc", "Pendente", DateTime.UtcNow, null, Guid.NewGuid(), "Cliente 1"),
            new(Guid.NewGuid(), "OS 2", "Desc", "Concluido", DateTime.UtcNow, null, Guid.NewGuid(), "Cliente 2")
        };
        mockService.Setup(s => s.ObterTodosAsync()).ReturnsAsync(pedidos);

        var controller = new PedidosController(mockService.Object)
        {
            ControllerContext = CreateControllerContextWithClaims(Guid.NewGuid().ToString(), "Administrador")
        };

        // Act
        var result = await controller.ObterTodos();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var resultPedidos = Assert.IsAssignableFrom<IEnumerable<PedidoResponseDto>>(okResult.Value);
        Assert.Equal(2, resultPedidos.Count());
    }

    [Fact]
    public async Task ObterTodos_QuandoCliente_DeveFiltrarPorIdUsuarioJwt()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var mockService = new Mock<IPedidoService>();
        var pedidosCliente = new List<PedidoResponseDto>
        {
            new(Guid.NewGuid(), "OS Cliente", "Desc", "Pendente", DateTime.UtcNow, null, userId, "Cliente Teste")
        };
        mockService.Setup(s => s.ObterPorUsuarioAsync(userId)).ReturnsAsync(pedidosCliente);

        var controller = new PedidosController(mockService.Object)
        {
            ControllerContext = CreateControllerContextWithClaims(userId.ToString(), "Cliente")
        };

        // Act
        var result = await controller.ObterTodos();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var resultPedidos = Assert.IsAssignableFrom<IEnumerable<PedidoResponseDto>>(okResult.Value);
        Assert.Single(resultPedidos);
        mockService.Verify(s => s.ObterPorUsuarioAsync(userId), Times.Once);
    }

    [Fact]
    public async Task Criar_QuandoCliente_DeveVincularUsuarioIdDoJwt()
    {
        // Arrange
        var userIdJwt = Guid.NewGuid();
        var outroUserId = Guid.NewGuid();
        var mockService = new Mock<IPedidoService>();

        CriarPedidoDto? dtoRecebido = null;
        mockService
            .Setup(s => s.CriarAsync(It.IsAny<CriarPedidoDto>()))
            .Callback<CriarPedidoDto>(d => dtoRecebido = d)
            .ReturnsAsync((CriarPedidoDto d) => new PedidoResponseDto(Guid.NewGuid(), d.Titulo, d.Descricao, "Pendente", DateTime.UtcNow, null, d.IdUsuario, "Cliente Teste"));

        var controller = new PedidosController(mockService.Object)
        {
            ControllerContext = CreateControllerContextWithClaims(userIdJwt.ToString(), "Cliente")
        };

        var dtoEnviado = new CriarPedidoDto("Manutenção", "Descrição", outroUserId);

        // Act
        var result = await controller.Criar(dtoEnviado);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.NotNull(dtoRecebido);
        Assert.Equal(userIdJwt, dtoRecebido.IdUsuario); // Forçado para o ID do token JWT do cliente
    }

    [Fact]
    public async Task AtualizarStatus_QuandoEncontrado_DeveRetornarOk()
    {
        // Arrange
        var pedidoId = Guid.NewGuid();
        var mockService = new Mock<IPedidoService>();
        var responseDto = new PedidoResponseDto(pedidoId, "OS", "Desc", "Concluido", DateTime.UtcNow, DateTime.UtcNow, Guid.NewGuid(), "Cliente");

        mockService.Setup(s => s.AtualizarStatusAsync(pedidoId, "Concluido")).ReturnsAsync(responseDto);

        var controller = new PedidosController(mockService.Object);

        // Act
        var result = await controller.AtualizarStatus(pedidoId, new AtualizarStatusPedidoDto("Concluido"));

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(responseDto, okResult.Value);
    }
}
