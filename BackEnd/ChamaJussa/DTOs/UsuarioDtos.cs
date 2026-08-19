using System;
using System.ComponentModel.DataAnnotations;

namespace ChamaJussa.DTOs;

public record CriarUsuarioDto(
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [StringLength(255, ErrorMessage = "O nome não pode ter mais que 255 caracteres.")]
    string Nome,

    [Required(ErrorMessage = "O e-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "E-mail em formato inválido.")]
    string Email,

    [Required(ErrorMessage = "A senha é obrigatória.")]
    [MinLength(6, ErrorMessage = "A senha deve ter no mínimo 6 caracteres.")]
    string Senha,

    /// <summary>
    /// Perfil do usuário. Opções: 'Administrador', 'Funcionario', 'Cliente'. Padrão: 'Cliente'.
    /// </summary>
    string? Perfil = "Cliente"
);

public record AtualizarUsuarioDto(
    [Required(ErrorMessage = "O nome é obrigatório.")]
    string Nome,

    [Required(ErrorMessage = "O e-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "E-mail em formato inválido.")]
    string Email,

    /// <summary>
    /// Perfil do usuário. Opções: 'Administrador', 'Funcionario', 'Cliente'.
    /// </summary>
    string? Perfil
);

public record AtualizarPerfilDto(
    [Required(ErrorMessage = "O perfil é obrigatório.")]
    /// <summary>
    /// Valores válidos: 'Administrador', 'Funcionario', 'Cliente'.
    /// </summary>
    string Perfil
);

public record UsuarioResponseDto(
    Guid IdUsuario,
    string Nome,
    string Email,
    string Perfil,
    DateTime DataCriacao
);

public record LoginDto(
    [Required(ErrorMessage = "O e-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "E-mail inválido.")]
    string Email,

    [Required(ErrorMessage = "A senha é obrigatória.")]
    string Senha
);

public record TokenResponseDto(
    string Token,
    UsuarioResponseDto Usuario
);
