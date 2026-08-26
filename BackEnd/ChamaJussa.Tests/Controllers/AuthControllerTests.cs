using ChamaJussa.Controllers;
using ChamaJussa.DTOs;
using ChamaJussa.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace ChamaJussa.Tests.Controllers;

public class AuthControllerTests
{
    [Fact]
    public async Task Login_ComCredenciaisValidas_DeveRetornarOkComToken()
    {
        // Arrange
        var mockUsuarioService = new Mock<IUsuarioService>();
        var userDto = new UsuarioResponseDto(Guid.NewGuid(), "Carlos", "carlos@email.com", "Cliente", DateTime.UtcNow);
        var tokenRes = new TokenResponseDto("jwt-token-valido", userDto);

        mockUsuarioService
            .Setup(s => s.AutenticarAsync(It.IsAny<LoginDto>()))
            .ReturnsAsync(tokenRes);

        var controller = new AuthController(mockUsuarioService.Object);
        var loginDto = new LoginDto("carlos@email.com", "Senha123!");

        // Act
        var result = await controller.Login(loginDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var responseValue = Assert.IsType<TokenResponseDto>(okResult.Value);
        Assert.Equal("jwt-token-valido", responseValue.Token);
    }

    [Fact]
    public async Task Login_ComCredenciaisInvalidas_DeveRetornarUnauthorized()
    {
        // Arrange
        var mockUsuarioService = new Mock<IUsuarioService>();
        mockUsuarioService
            .Setup(s => s.AutenticarAsync(It.IsAny<LoginDto>()))
            .ReturnsAsync((TokenResponseDto?)null);

        var controller = new AuthController(mockUsuarioService.Object);
        var loginDto = new LoginDto("invalido@email.com", "SenhaErrada");

        // Act
        var result = await controller.Login(loginDto);

        // Assert
        Assert.IsType<UnauthorizedObjectResult>(result);
    }
}
