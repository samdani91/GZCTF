using System.Net.Mime;
using GZCTF.Models.Request.Edit;
using GZCTF.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;

namespace GZCTF.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DebugController(
    IGameRepository gameRepository,
    IGameChallengeRepository challengeRepository,
    IHostEnvironment env) : ControllerBase
{
    [HttpPost("Games/{id:int}/Challenges")]
    public async Task<IActionResult> CreateChallengeDebug([FromRoute] int id, [FromBody] ChallengeInfoModel model)
    {
        if (!env.IsDevelopment())
            return Forbid();

        var game = await gameRepository.GetGameById(id, CancellationToken.None);
        if (game is null)
            return NotFound();

        var res = await challengeRepository.CreateChallenge(game,
            new GameChallenge { Title = model.Title, Type = model.Type, Category = model.Category }, CancellationToken.None);

        return Ok(res);
    }
}
