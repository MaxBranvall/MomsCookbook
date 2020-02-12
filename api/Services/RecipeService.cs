using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interfaces;
using api.Models;
using api.Contexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
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

        public ActionResult<FullRecipe> GetSingleRecipe(int id)
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

            x = InitializeRecipe(r);

            return x;
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
                r = this.SetRecipe(recipe);

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

            return GetSingleRecipe(r.ID).Value;
        }

        public FullRecipe UpdateRecipe(FullRecipe recipe)
        {
            Recipe smallRecipe = new Recipe();

            try
            {
                smallRecipe = this.SetRecipe(recipe);
                smallRecipe.ID = recipe.RecipeID;

                //_context.recipe.Add(this.SetRecipe(recipe));

                _context.recipe.Update(smallRecipe);

                this.UpdateSteps(recipe.Steps, recipe.RecipeID);
                this.UpdateSubSteps(recipe.SubSteps, recipe.RecipeID);
                this.UpdateTips(recipe.Tips, recipe.RecipeID);
                this.UpdateSubTips(recipe.SubTips, recipe.RecipeID);
                this.UpdateIngredients(recipe.Ingredients, recipe.RecipeID);

                _context.SaveChanges();
            } catch (Exception ex)
            {
                _logger.LogInformation("ERROR: " + ex);
            }

            return recipe;
        }

        private Recipe SetRecipe(FullRecipe recipe)
        {
            Recipe r = new Recipe();

            try
            {
                r = new Recipe()
                {
                    Name = recipe.Name,
                    ImagePath = recipe.ImagePath,
                    Description = recipe.Description,
                    Category = recipe.Category,
                    PrepTime = recipe.PrepTime,
                    CookTime = recipe.CookTime,
                    Created = recipe.Created,
                    LastModified = recipe.LastModified
                };
            }
            catch (Exception ex)
            {
                _logger.LogInformation("Error: " + ex);
            }

            return r;

        }

        private FullRecipe InitializeRecipe(Recipe originalRecipe)
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

            try
            {
                String[] prepTimeSplit = recipe.PrepTime.Split(":");
                String[] cookTimeSplit = recipe.CookTime.Split(":");

                recipe.PrepTimeH = float.Parse(prepTimeSplit[0]);
                recipe.PrepTimeM = float.Parse(prepTimeSplit[1]);
                recipe.CookTimeH = float.Parse(cookTimeSplit[0]);
                recipe.CookTimeM = float.Parse(cookTimeSplit[1]);
            } catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
            }

            recipe.Ingredients = GetIngredients(recipe.RecipeID);
            recipe.Steps = GetSteps(recipe.RecipeID);
            recipe.SubSteps = GetSubSteps(recipe.RecipeID);
            recipe.Tips = GetTips(recipe.RecipeID);
            recipe.SubTips = GetSubTips(recipe.RecipeID);

            return recipe;
        }

        private void AddIngredients(List<Ingredient> ingredientList, int recipeID)
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

                _context.ingredients.Add(y);
            }
        }

        private void AddSteps(List<Steps> stepList, int recipeID)
        {
            foreach (Steps s in stepList)
            {
                Steps step = new Steps()
                {
                    RecipeID = recipeID,
                    LocalStepID = s.LocalStepID,
                    Contents = s.Contents
                };

                _context.steps.Add(step);
            }
        }

        private void AddSubSteps(List<SubSteps> subStepList, int recipeID)
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

                 _context.substeps.Add(s);
            }

        }

        private void AddTips(List<Tips> tipList, int recipeID)
        {
            foreach (Tips tip in tipList)
            {
                Tips t = new Tips()
                {
                    RecipeID = recipeID,
                    LocalTipID = tip.LocalTipID,
                    Contents = tip.Contents,
                };

                _context.tips.Add(t);
            }
        }

        private void AddSubTips(List<SubTips> subTipList, int recipeID)
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

                _context.subtips.Add(t);
            }
        }

        private List<Ingredient> GetIngredients(int RecipeID)
        {
            List<Ingredient> ingredients = _context.ingredients.Where(x => x.RecipeID == RecipeID).OrderBy(ingredient => ingredient.LocalIngredientID).ToList();
            return ingredients;
        }

        private List<Steps> GetSteps(int RecipeID)
        {
            List<Steps> steps = _context.steps.Where(x => x.RecipeID == RecipeID).OrderBy(step => step.LocalStepID).ToList();
            return steps;
        }

        private List<SubSteps> GetSubSteps(int RecipeID)
        {
            List<SubSteps> subSteps = _context.substeps.Where(x => x.RecipeID == RecipeID).OrderBy(substep => substep.SubStepID).ToList();
            return subSteps;
        }

        private List<Tips> GetTips(int RecipeID)
        {
            List<Tips> tips = _context.tips.Where(x => x.RecipeID == RecipeID).OrderBy(tip => tip.LocalTipID).ToList();
            return tips;
        }

        private List<SubTips> GetSubTips(int RecipeID)
        {
            List<SubTips> subTips = _context.subtips.Where(x => x.RecipeID == RecipeID).OrderBy(subtip => subtip.SubTipID).ToList();
            return subTips;
        }

        private void DeleteAllIngredients(int recipeID)
        {
            _context.RemoveRange(this.GetIngredients(recipeID));
        }

        private void DeleteAllSteps(int recipeID)
        {
            _context.RemoveRange(this.GetSteps(recipeID));
        }

        private void DeleteAllSubSteps(int recipeID)
        {
            _context.RemoveRange(this.GetSubSteps(recipeID));
        }

        private void DeleteAllTips(int recipeID)
        {
            _context.RemoveRange(this.GetTips(recipeID));
        }

        private void DeleteAllSubTips(int recipeID)
        {
            _context.RemoveRange(this.GetSubTips(recipeID));
        }

        private void UpdateIngredients(List<Ingredient> ingredientList, int recipeID)
        {
            this.DeleteAllIngredients(recipeID);
            _context.SaveChanges();
            this.AddIngredients(ingredientList, recipeID);
        }

        private void UpdateSteps(List<Steps> stepList, int recipeID)
        {
            this.DeleteAllSteps(recipeID);
            _context.SaveChanges();
            this.AddSteps(stepList, recipeID);
        }

        private void UpdateSubSteps(List<SubSteps> subStepList, int recipeID)
        {
            this.DeleteAllSubSteps(recipeID);
            _context.SaveChanges();
            this.AddSubSteps(subStepList, recipeID);
        }

        private void UpdateTips(List<Tips> tipList, int recipeID)
        {
            this.DeleteAllTips(recipeID);
            _context.SaveChanges();
            this.AddTips(tipList, recipeID);
        }

        private void UpdateSubTips(List<SubTips> subTipList, int recipeID)
        {
            this.DeleteAllSubTips(recipeID);
            _context.SaveChanges();
            this.AddSubTips(subTipList, recipeID);
        }

    }
}
