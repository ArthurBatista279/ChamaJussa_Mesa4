using ChamaJussa.Models;

namespace ChamaJussa.Services;

public interface ITokenService
{
    string GerarToken(TbUsuario usuario);
}
