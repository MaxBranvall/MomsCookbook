using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interfaces;
using api.Models;
using api.Contexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Serilog;

namespace api.Services
{
    public class RecipeService : IRecipeService
    {

        private RecipeContext _context;
        private readonly ILogger<RecipeService> _logger;

        public RecipeService(RecipeContext recipeContext, ILogger<RecipeService> logger)
        {
            _logger = logger;
            _context = recipeContext;
        }

        public List<FullRecipe> GetAllRecipes()
        {

            List<FullRecipe> fullRecipeList = new List<FullRecipe>();
            List<Recipe> originalRecipeList = this._context.recipe.ToList();

            foreach(Recipe r in originalRecipeList)
            {
                fullRecipeList.Add(InitializeRecipe(r));
            }

            return fullRecipeList;
        }

        public List<FullRecipe> GetAllRecipesByCategory(string category)
        {
            List<FullRecipe> fullRecipeList = new List<FullRecipe>();

            List<Recipe> originalRecipeList = _context.recipe.Where(x => x.Category == category).ToList();

            foreach(Recipe r in originalRecipeList)
            {
                fullRecipeList.Add(InitializeRecipe(r));
            }

            return fullRecipeList;
        }

        public FullRecipe GetSingleRecipe(int id)
        {

            Recipe r = new Recipe();
            var x = new FullRecipe();

            try
            {
                r = _context.recipe.Where(y => y.ID == id).ToList()[0];
            }
            catch (Exception ex)
            {
                _logger.LogError($"No recipe with provided index ({id}) found.");
            }
            finally
            {
                x = InitializeRecipe(r);
            }

            return x;
        }

        public FullRecipe InitializeRecipe(Recipe originalRecipe)
        {
            FullRecipe recipe = new FullRecipe()
            {
                RecipeID = originalRecipe.ID,
                Name = originalRecipe.Name,
                ImagePath = originalRecipe.ImagePath,
                Description = originalRecipe.Description,
                Category = originalRecipe.Category,
                PrepTime = originalRecipe.PrepTime,
                CookTime = originalRecipe.CookTime,
                Created = originalRecipe.Created,
                LastModified = originalRecipe.LastModified
            };

            String[] prepTimeSplit = recipe.PrepTime.Split(":");
            String[] cookTimeSplit = recipe.CookTime.Split(":");

            recipe.PrepTimeH = int.Parse(prepTimeSplit[0]);
            recipe.PrepTimeM = int.Parse(prepTimeSplit[1]);
            recipe.CookTimeH = int.Parse(cookTimeSplit[0]);
            recipe.CookTimeM = int.Parse(cookTimeSplit[1]);

            recipe.Ingredients = GetIngredients(recipe.RecipeID);
            recipe.Steps = GetSteps(recipe.RecipeID);
            recipe.SubSteps = GetSubSteps(recipe.RecipeID);
            recipe.Tips = GetTips(recipe.RecipeID);
            recipe.SubTips = GetSubTips(recipe.RecipeID);

            return recipe;
        }

        public List<Ingredient> GetIngredients(int RecipeID)
        {
            List<Ingredient> ingredients = _context.ingredients.Where(x => x.RecipeID == RecipeID).ToList();
            return ingredients;
        }

        public List<Steps> GetSteps(int RecipeID)
        {
            List<Steps> steps = _context.steps.Where(x => x.RecipeID == RecipeID).ToList();
            return steps;
        }

        public List<SubSteps> GetSubSteps(int RecipeID)
        {
            List<SubSteps> subSteps = _context.substeps.Where(x => x.RecipeID == RecipeID).ToList();
            return subSteps;
        }

        public List<Tips> GetTips(int RecipeID)
        {
            List<Tips> tips = _context.tips.Where(x => x.RecipeID == RecipeID).ToList();
            return tips;
        }

        public List<SubTips> GetSubTips(int RecipeID)
        {
            List<SubTips> subTips = _context.subtips.Where(x => x.RecipeID == RecipeID).ToList();
            return subTips;
        }

        public async Task<StatusCodeResult> AddDownloadURL(Recipe r)
        {
            _context.recipe.Attach(r);
            _context.Entry(r).Property(x => x.ImagePath).IsModified = true;
            await _context.SaveChangesAsync();

            return new StatusCodeResult(200);
        }

        public FullRecipe PostRecipe(FullRecipe recipe)
        {

            Recipe r = new Recipe();

            try
            {
                r = new Recipe()
                {
                    Name = recipe.Name,
                    ImagePath = null,
                    Description = recipe.Description,
                    Category = recipe.Category,
                    PrepTime = recipe.PrepTime,
                    CookTime = recipe.CookTime,
                    Created = recipe.Created,
                    LastModified = recipe.LastModified
                };

                this._context.recipe.Add(r);
                this._context.SaveChanges();

                AddIngredients(recipe.Ingredients, r.ID);
                AddSteps(recipe.Steps, r.ID);
                AddSubSteps(recipe.SubSteps, r.ID);
                AddTips(recipe.Tips, r.ID);
                AddSubTips(recipe.SubTips, r.ID);

                this._context.SaveChanges();
            } catch (Exception ex)
            {
                _logger.LogInformation("Error: " + ex);
            }

            return GetSingleRecipe(r.ID);

            async void AddIngredients(List<Ingredient> ingredientList, int recipeID)
            {
                foreach (Ingredient i in ingredientList)
                {
                    Ingredient y = new Ingredient()
                    {
                        RecipeID = recipeID,
                        LocalIngredientID = i.LocalIngredientID,
                        Contents = i.Contents,
                        Quantity = i.Quantity,
                        Unit = i.Unit
                    };

                    await _context.ingredients.AddAsync(y);

                }
            }

            async void AddSteps(List<Steps> stepList, int recipeID)
            {
                foreach (Steps s in stepList)
                {
                    Steps step = new Steps()
                    {
                        RecipeID = recipeID,
                        LocalStepID = s.LocalStepID,
                        Contents = s.Contents
                    };

                    await _context.steps.AddAsync(step);

                }
            }

            async void AddSubSteps(List<SubSteps> subStepList, int recipeID)
            {

                foreach (SubSteps step in subStepList)
                {

                    SubSteps s = new SubSteps()
                    {
                        RecipeID = recipeID,
                        LocalStepID = step.LocalStepID,
                        Contents = step.Contents,
                        SubStepID = step.SubStepID
                    };

                    await _context.substeps.AddAsync(s);
                }

            }

            async void AddTips(List<Tips> tipList, int recipeID)
            {
                foreach (Tips tip in tipList)
                {
                    Tips t = new Tips()
                    {
                        RecipeID = recipeID,
                        LocalTipID = tip.LocalTipID,
                        Contents = tip.Contents,
                    };

                    await _context.tips.AddAsync(t);
                }
            }

            async void AddSubTips(List<SubTips> subTipList, int recipeID)
            {
                foreach (SubTips tip in subTipList)
                {
                    SubTips t = new SubTips()
                    {
                        RecipeID = recipeID,
                        LocalTipID = tip.LocalTipID,
                        Contents = tip.Contents,
                        SubTipID = (int)tip.SubTipID
                    };

                    await _context.subtips.AddAsync(t);
                }
            }

        }

    }
}
