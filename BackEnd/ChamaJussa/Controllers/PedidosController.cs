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
    [ProducesResponseType(typeof(IEnumerable<PedidoResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ObterTodos()
    {
        var pedidos = await _pedidoService.ObterTodosAsync();
        return Ok(pedidos);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(PedidoResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObterPorId(Guid id)
    {
        var pedido = await _pedidoService.ObterPorIdAsync(id);
        if (pedido == null)
        {
            return NotFound(new { mensagem = "Ordem de serviço não encontrada." });
        }

        return Ok(pedido);
    }

    [HttpGet("usuario/{idUsuario:guid}")]
    [ProducesResponseType(typeof(IEnumerable<PedidoResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ObterPorUsuario(Guid idUsuario)
    {
        var pedidos = await _pedidoService.ObterPorUsuarioAsync(idUsuario);
        return Ok(pedidos);
    }

    [HttpPost]
    [ProducesResponseType(typeof(PedidoResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Criar([FromBody] CriarPedidoDto dto)
    {
        try
        {
            var pedido = await _pedidoService.CriarAsync(dto);
            return CreatedAtAction(nameof(ObterPorId), new { id = pedido.IdPedido }, pedido);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(PedidoResponseDto), StatusCodes.Status200OK)]
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
    [ProducesResponseType(typeof(PedidoResponseDto), StatusCodes.Status200OK)]
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
    [ProducesResponseType(StatusCodes.Status204NoContent)]
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
