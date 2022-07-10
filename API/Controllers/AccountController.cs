using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  public class AccountController : BaseApiController
  {
    private readonly DataContext _context;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;

    public AccountController(DataContext context, ITokenService tokenService, IMapper mapper)
    {
      _context = context;
      _tokenService = tokenService;
      _mapper = mapper;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDto)
    {
      if (await UserExists(registerDto.UserName)) return BadRequest("UserName is taken");

      var user = _mapper.Map<AppUser>(registerDto);

      using var hmac = new HMACSHA512();

      user.UserName = user.UserName.ToLower();
      user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
      user.PasswordSalt = hmac.Key;

      _context.Users.Add(user);
      await _context.SaveChangesAsync();

      return new UserDTO
      {
        UserName = user.UserName,
        Token = _tokenService.CreateToken(user),
        KnownAs = user.KnownAs,
        Gender = user.Gender
      };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDto)
    {
      var user = await _context.Users
        .Include(p => p.Photos)
        .SingleOrDefaultAsync(x => x.UserName == loginDto.userName.ToLower());

      if (user == null) return Unauthorized("Invalid userName");

      using var hmac = new HMACSHA512(user.PasswordSalt);

      var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.password));

      for (int i = 0; i < computedHash.Length; i++)
      {
        if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
      }

      return new UserDTO
      {
        UserName = user.UserName,
        Token = _tokenService.CreateToken(user),
        PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
        KnownAs = user.KnownAs,
        Gender = user.Gender
      };
    }

    private async Task<bool> UserExists(string userName)
    {
      return await _context.Users.AnyAsync(x => x.UserName == userName.ToLower());
    }
  }
}