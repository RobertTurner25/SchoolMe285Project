﻿using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/AssignmentGrade")]

public class AssignmentGradeController : ControllerBase
{
    private readonly DataContext _dataContext;
    public AssignmentGradeController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();
        var data = _dataContext
            .Set<AssignmentGrade>()
            .Select(AssignmentGrade => new AssignmentGradeGetDto
            {
                Id = AssignmentGrade.Id,
                Grade = AssignmentGrade.Grade,
                

            })
            .ToList();

        response.Data = data;

        return Ok(response);
    }

    [HttpPost]
    public IActionResult Create([FromBody] AssignmentGradeCreateDto createDto)
    {
        var response = new Response();

        var AssignmentGradeToCreate = new AssignmentGrade
        {
            
            Grade = createDto.Grade,
            
        };

        _dataContext.Set<AssignmentGrade>().Add(AssignmentGradeToCreate);
        _dataContext.SaveChanges();

        var AssignmentGradeToReturn = new AssignmentGradeGetDto
        {
           Id = AssignmentGradeToCreate.Id,
           Grade = createDto.Grade,
           
        };

        response.Data = AssignmentGradeToReturn;

        return Created("", response);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();
        var data = _dataContext
            .Set<AssignmentGrade>()
            .Select(assignmentGrade => new AssignmentGradeGetDto
            {
                Id = assignmentGrade.Id, 
              
                Grade = assignmentGrade.Grade,
              

            })
            .FirstOrDefault(group => group.Id == id);

        response.Data = data;

        return Ok(response);
    }

    [HttpPut("{id}")]
    public IActionResult Update([FromBody] AssignmentGradeUpdateDto updateDto, int id)
    {
        var response = new Response();

        var AssignmentGradeToUpdate = _dataContext.Set<AssignmentGrade>()
            .FirstOrDefault(assignmentGrade => assignmentGrade.Id == id);

        if (AssignmentGradeToUpdate == null)
        {
            response.AddError("id", "Assignment not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        
        AssignmentGradeToUpdate.Grade = updateDto.Grade;
        

        _dataContext.SaveChanges();

        var AssignmentGradeToReturn = new AssignmentGradeGetDto
        {
            Id = AssignmentGradeToUpdate.Id,
           
            Grade = AssignmentGradeToUpdate.Grade,
            
        };

        response.Data = AssignmentGradeToReturn;
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var AssignmentGradeToDelete = _dataContext.Set<AssignmentGrade>()
            .FirstOrDefault(assignmentGrade => assignmentGrade.Id == id);

        if (AssignmentGradeToDelete == null)
        {
            response.AddError("id", "Assignment not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        _dataContext.Set<AssignmentGrade>().Remove(AssignmentGradeToDelete);
        _dataContext.SaveChanges();
        response.Data = true;

        return Ok(response);

    }


}