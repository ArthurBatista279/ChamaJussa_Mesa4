using ChamaJussa.DTOs;
using ChamaJussa.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChamaJussa.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    public UsuariosController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<UsuarioResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ObterTodos()
    {
        var usuarios = await _usuarioService.ObterTodosAsync();
        return Ok(usuarios);
    }

    [HttpGet("perfis")]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status200OK)]
    public IActionResult ObterPerfisDisponiveis()
    {
        var perfis = _usuarioService.ObterPerfisDisponiveis();
        return Ok(perfis);
    }

    [HttpGet("{id:guid}")]
    [Authorize]
    [ProducesResponseType(typeof(UsuarioResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObterPorId(Guid id)
    {
        var usuario = await _usuarioService.ObterPorIdAsync(id);
        if (usuario == null)
        {
            return NotFound(new { mensagem = "Usuário não encontrado." });
        }

        return Ok(usuario);
    }

    [HttpPost]
    [ProducesResponseType(typeof(UsuarioResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Criar([FromBody] CriarUsuarioDto dto)
    {
        try
        {
            var usuario = await _usuarioService.CriarAsync(dto);
            return CreatedAtAction(nameof(ObterPorId), new { id = usuario.IdUsuario }, usuario);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    [ProducesResponseType(typeof(UsuarioResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Atualizar(Guid id, [FromBody] AtualizarUsuarioDto dto)
    {
        try
        {
            var usuario = await _usuarioService.AtualizarAsync(id, dto);
            if (usuario == null)
            {
                return NotFound(new { mensagem = "Usuário não encontrado." });
            }

            return Ok(usuario);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    [HttpPatch("{id:guid}/perfil")]
    [Authorize]
    [ProducesResponseType(typeof(UsuarioResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AtualizarPerfil(Guid id, [FromBody] AtualizarPerfilDto dto)
    {
        var usuario = await _usuarioService.AtualizarPerfilAsync(id, dto.Perfil);
        if (usuario == null)
        {
            return NotFound(new { mensagem = "Usuário não encontrado." });
        }

        return Ok(usuario);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Deletar(Guid id)
    {
        var deletado = await _usuarioService.DeletarAsync(id);
        if (!deletado)
        {
            return NotFound(new { mensagem = "Usuário não encontrado." });
        }

        return NoContent();
    }
}
