using System.Security.Claims;
using ChamaJussa.DTOs;
using ChamaJussa.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChamaJussa.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PedidosController : ControllerBase
{
    private readonly IPedidoService _pedidoService;

    public PedidosController(IPedidoService pedidoService)
    {
        _pedidoService = pedidoService;
    }

    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<PedidoResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ObterTodos()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        bool isAdminOrFunc = User.IsInRole("Administrador") || User.IsInRole("Funcionario");

        if (!isAdminOrFunc && Guid.TryParse(userIdStr, out var userId))
        {
            var pedidosCliente = await _pedidoService.ObterPorUsuarioAsync(userId);
            return Ok(pedidosCliente);
        }

        var pedidos = await _pedidoService.ObterTodosAsync();
        return Ok(pedidos);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(PedidoResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObterPorId(Guid id)
    {
        var pedido = await _pedidoService.ObterPorIdAsync(id);
        if (pedido == null)
        {
            return NotFound(new { mensagem = "Ordem de serviço não encontrada." });
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        bool isAdminOrFunc = User.IsInRole("Administrador") || User.IsInRole("Funcionario");

        if (!isAdminOrFunc && pedido.IdUsuario.ToString() != userId)
        {
            return Forbid();
        }

        return Ok(pedido);
    }

    [HttpGet("usuario/{idUsuario:guid}")]
    [ProducesResponseType(typeof(IEnumerable<PedidoResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> ObterPorUsuario(Guid idUsuario)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        bool isAdminOrFunc = User.IsInRole("Administrador") || User.IsInRole("Funcionario");

        if (!isAdminOrFunc && idUsuario.ToString() != userId)
        {
            return Forbid();
        }

        var pedidos = await _pedidoService.ObterPorUsuarioAsync(idUsuario);
        return Ok(pedidos);
    }

    [HttpPost]
    [ProducesResponseType(typeof(PedidoResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Criar([FromBody] CriarPedidoDto dto)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            bool isAdminOrFunc = User.IsInRole("Administrador") || User.IsInRole("Funcionario");

            // Se for Cliente, a autoria da OS e obrigatoriamente vinculada ao IdUsuario extraido do token JWT
            Guid usuarioIdFinal = dto.IdUsuario;
            if (!isAdminOrFunc && Guid.TryParse(userId, out var usuarioIdJwt))
            {
                usuarioIdFinal = usuarioIdJwt;
            }

            var dtoFinal = dto with { IdUsuario = usuarioIdFinal };

            var pedido = await _pedidoService.CriarAsync(dtoFinal);
            return CreatedAtAction(nameof(ObterPorId), new { id = pedido.IdPedido }, pedido);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Administrador,Funcionario")]
    [ProducesResponseType(typeof(PedidoResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Atualizar(Guid id, [FromBody] AtualizarPedidoDto dto)
    {
        var pedido = await _pedidoService.AtualizarAsync(id, dto);
        if (pedido == null)
        {
            return NotFound(new { mensagem = "Ordem de serviço não encontrada." });
        }

        return Ok(pedido);
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "Administrador,Funcionario")]
    [ProducesResponseType(typeof(PedidoResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AtualizarStatus(Guid id, [FromBody] AtualizarStatusPedidoDto dto)
    {
        var pedido = await _pedidoService.AtualizarStatusAsync(id, dto.Status);
        if (pedido == null)
        {
            return NotFound(new { mensagem = "Ordem de serviço não encontrada." });
        }

        return Ok(pedido);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Administrador,Funcionario")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Deletar(Guid id)
    {
        var deletado = await _pedidoService.DeletarAsync(id);
        if (!deletado)
        {
            return NotFound(new { mensagem = "Ordem de serviço não encontrada." });
        }

        return NoContent();
    }
}
