using System;
using System.ComponentModel.DataAnnotations;

namespace ChamaJussa.DTOs;

public record CriarPedidoDto(
    [Required(ErrorMessage = "O título é obrigatório.")]
    [StringLength(150, ErrorMessage = "O título deve ter no máximo 150 caracteres.")]
    string Titulo,

    [Required(ErrorMessage = "A descrição é obrigatória.")]
    string Descricao,

    [Required(ErrorMessage = "O IdUsuario é obrigatório.")]
    Guid IdUsuario
);

public record AtualizarPedidoDto(
    [Required(ErrorMessage = "O título é obrigatório.")]
    string Titulo,

    [Required(ErrorMessage = "A descrição é obrigatória.")]
    string Descricao,

    [Required(ErrorMessage = "O status é obrigatório.")]
    string Status
);

public record AtualizarStatusPedidoDto(
    [Required(ErrorMessage = "O status é obrigatório.")]
    string Status
);

public record PedidoResponseDto(
    Guid IdPedido,
    string Titulo,
    string Descricao,
    string Status,
    DateTime DataCriacao,
    DateTime? DataAtualizacao,
    Guid IdUsuario,
    string? NomeUsuario
);
