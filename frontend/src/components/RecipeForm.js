import React, { useState, useEffect, useRef } from 'react';
import { Textfield, Textarea, Select } from './Input';
import { Button } from './Button';
import * as FaIcons from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { getTrimmedValue } from './ValidatorUtil';

import './styles/Form.css';
import './styles/RecipeForm.css';
import './styles/LoadImages.css';

export var data = {"info": {"user": window.sessionStorage.getItem("username"),"type": "ingredients", "steps": [], "ingredients": [], "images": []}, 
"imgs": {"type": "images", "user": window.sessionStorage.getItem("username")}}; //This is jus the standard

function processImages(imgData, data) {
    return new Promise((res, rej)=>{
        var reader = new FileReader();
        reader.readAsDataURL(imgData[0]);

        reader.addEventListener("load", (e)=>{
            var dtSt = reader.result.search(/base64,/g); //after this the data will start
            data["imgs"][imgData[0].name] = reader.result.slice(dtSt + 7); //Store the slide data
            res("This");
        });
    }).then(res=>{}).catch(err=>{});
}

async function ensureTesting(img, data, test) {

  var proccessed = await processImages(img, data); //This will really not do anything, it will just hold the variable

  test();
}

export const RecipeForm = props => {
  // state variables (equivalent of this.state in a class-based component)
  const [values, setValues] = useState({}); 
  const [errors, setErrors] = useState({});
  const [ingredients, setIngredients] = useState([{ index: 0, qty: '', units: '', name: ''}]); 
  const [steps, setSteps] = useState([{ index: 0, text: ''}]);
  const [images, setImages] = useState([{ index: 0, image: ''}]);
  const [visualImages, setVisImages] = useState([]);

  const TIME_UNITS = [
    { value: 'Seconds', label: 'Seconds'},
    { value: 'Minutes', label: 'Minutes'},
    { value: 'Hours', label: 'Hours'},
    { value: 'Days', label: 'Days'},
  ];

  const isFormValid = () => { // used to disable button until form is complete
    const ingredientsValid = Object.values(ingredients).every(({ qty, units, name }) => qty !== '' && units !== '' && name !== ''); 

    const stepsValid = Object.values(steps).every(({ text }) => text && text !== '');
    const noErrors = Object.entries(errors).length === 0;
    
    const requiredFieldEntries = Object.entries(values).filter(([ key ]) => key !== 'calories');
    const requiredFields = Object.fromEntries(requiredFieldEntries);
    const requiredFieldsValid = Object.values(requiredFields).every(field => field !== '');

    var imgBlock = document.getElementById("imgDis")
    const loadedImage = (images.length == imgBlock.childNodes.length);

    return ingredientsValid && stepsValid && noErrors && requiredFieldsValid && loadedImage;
  }

  const onChange = event => {
    const { value, name } = event.target;
    const val = value;

    //Add it to data
    if(val.length > 0) 
      data["info"][name] = value;

    setValues({...values, [name]: val });
  }

  const onValidate = () => {
    if (props.onValidate) 
    {
      props.onValidate(isFormValid());
    }
  }

  //This will account for a button in the RecipePopUp plugin signaling that the recipe should be cleared
  useEffect(()=>{
    if(props.reset == 1) {
      setValues({}); 
      setIngredients([{ index: 0, qty: '', units: '', name: ''}])
      setSteps([{ index: 0, text: ''}]);
      setImages([{ index: 0, image: ''}]);
      var input = document.getElementsByClassName("imageInput");
      input[0].value = "";
      var imageDis = document.getElementById("imgDis");
      imageDis.removeChild(imageDis.childNodes[0]);
      data = {"info": {"user": window.sessionStorage.getItem("username"),"type": "ingredients", "steps": [], "ingredients": [], "images": []}, 
      "imgs": {"type": "images", "user": window.sessionStorage.getItem("username")}};
    }
  }, [props.reset]) //Will only fire when the .reset prop is changed

  const eventHandlers = { // handling special inputs displayed as lists
    addImage: () => {
      if (images.length >= 3) {
        alert("You can only have a maximum of three images on your recipe.");
        return;
      }
      return setImages([...images, {index: images.length, image : ''}]);
    },
    loadImage: ind =>{
      console.log(window.sessionStorage.getItem("username"))
      var loadInput = document.getElementsByClassName("imageInput");
      if(loadInput[ind].files.length !== 0) {

        //var obj = {index: ind, images: loadInput[ind].files[0], name: loadInput[ind].files[0].name};

        var imgDis = document.getElementById("imgDis")

        //Reset image here
        if(imgDis.childNodes.length >= 1) {
          if(ind < imgDis.childNodes.length && data["info"]["images"][ind] != loadInput[ind].files[0].name) {
            //Reset images
            imgDis.childNodes[ind].src = URL.createObjectURL(loadInput[ind].files[0])
            var name = data["info"]["images"][ind]
            delete data["imgs"][name];
            data["info"]["images"][ind] = loadInput[ind].files[0].name;
          } else {
            //Just add an image
            data["info"]["images"].push(loadInput[ind].files[0].name);
            var img = document.createElement("IMG")
            img.src = URL.createObjectURL(loadInput[ind].files[0]);
            imgDis.append(img)
          }
        } else {
          //Well if it's empty, we always want it entering something
          data["info"]["images"].push(loadInput[ind].files[0].name);
          var img = document.createElement("IMG")
          img.src = URL.createObjectURL(loadInput[ind].files[0]);
          imgDis.append(img)
        }

        images[ind].image = loadInput[ind].files[0].name;

        console.log(data)

        ensureTesting(loadInput[ind].files, data, onValidate);
      }
      
    },
    addIngredient: () => {
      return setIngredients([...ingredients, { index: ingredients.length, qty: '', units: '', name: ''}]);
    },
    addStep: () => {
      return setSteps([...steps, { index: steps.length, text: ''}]);
    },
    deleteImage: index => {
      const currentImages = [...images];
      const currentVisImages = [...visualImages];
      const filteredImages = currentImages.filter(image => image.index !== index);
      const filteredVisImages = currentVisImages.filter(img => img.index !== index);
      setVisImages([...filteredVisImages])
      return setImages([...filteredImages])
    },
    deleteIngredient: index => {
      if (ingredients.length === 1) {
        alert("You must have at least one ingredient in your recipe."); 
        return;
      }
      const currentIngredients = [...ingredients];
      const filteredIngredients = currentIngredients.filter(ingredient => ingredient.index !== index);
      filteredIngredients.forEach(ingredient => ingredient.index = filteredIngredients.indexOf(ingredient));

      const currentErrors = {...errors};
      const errorsEntries = Object.entries(currentErrors).filter(([key]) => { 
        return key !== `ingredientQuantity_${index}` && key !== `ingredientUnits_${index}` && key !== `ingredientName_${index}`
      });
 
      setErrors({...Object.fromEntries(errorsEntries)});
      return setIngredients([...filteredIngredients]);
    },
    deleteStep: index => {
      if (steps.length === 1) {
        alert("You must have at least one step in your recipe."); 
        return;
      }

      const currentSteps = [...steps];
      const filteredSteps = currentSteps.filter(step => step.index !== index);
      filteredSteps.forEach(step => step.index = filteredSteps.indexOf(step));
      
      const currentErrors = {...errors};
      const errorsEntries = Object.entries(currentErrors).filter(([key]) => { 
        return key !== `step_${index}`;
      });

      setErrors({...Object.fromEntries(errorsEntries)});
      return setSteps([...filteredSteps]);
    },
    editIngredient: (event, index) => {
      const { value, name } = event.target;

      if(data["info"]["ingredients"][index] == null) {
        data["info"]["ingredients"][index] = {};
      }

      if (ingredients[index]) {
        //const currentIngredients = [...ingredients]; //This should just be an array of ingredients
        const currentIngredients = ingredients;
        switch(name) {
          case `ingredientQuantity_${index}`:
            currentIngredients[index] = {...currentIngredients[index], qty: value};
            data["info"]["ingredients"][index]["qty"] = value;
            break;
          case `ingredientUnits_${index}`:
            currentIngredients[index] = {...currentIngredients[index], units: value};
            data["info"]["ingredients"][index]["units"] = value;
            break;
          case `ingredientName_${index}`:
            currentIngredients[index] = {...currentIngredients[index], name: value};
            data["info"]["ingredients"][index]["name"] = value;
            break;
          default:
            break;

        }
        return setIngredients([...currentIngredients]);
      }
    },
    editStep: (event, index) => {
      const { value } = event.target;

      if (steps[index]) {
        const currentSteps = steps;
        data["info"]["steps"][index] = value; //This is just an attempt
        currentSteps[index] = {...currentSteps[index], text: value};
        return setSteps([...currentSteps]);
      }
    }
  }

  const validators = {
    required: (event) => {
      const { name, value: val } = getTrimmedValue(event); 

      if (val) {
        if (errors[name]) {
          const currentErrors = {...errors};
          delete currentErrors[name];
          setErrors({...currentErrors});
        }
      }

      else {
        setErrors({...errors, [name]: 'Required'});
      }

      setValues({...values, [name]: val});
      return onValidate();
    },
    positiveInt: (event) => {
      const { name, value: val } = getTrimmedValue(event); 

      if (parseInt(val) >= 0) {
        if (errors[name]) {
          const currentErrors = {...errors};
          delete currentErrors[name];
          setErrors({...currentErrors});
        }
      }

      else {
        setErrors({...errors, [name]: 'Integer must be positive (0-9999)'});
      }
  
      setValues({...values, [name]: val});
      return onValidate();
    }
  }

  const renderTitle = () => {
    return (<div className="flex-row">
      <div className="flex-column" id="title">
        <Textfield
        placeholder="Title"
        name="title"
        type="text"
        required
        label="Title"
        value={values.title}
        onChange={(e) => onChange(e)}
        onBlur={(e) => validators.required(e)}
        error={errors.title}/>
      </div>
    </div>)
  }

  const renderPrepAndCookTime = () => {
    return(
      <div className="flex-row recipe-time">
        <div className="flex-column" id="prep-time">
          <div id="prep-time-amt-container">
            <Textfield 
            type="number" 
            inputMode="numeric"
            name="prepTimeAmount"
            value={values.prepTimeAmount} 
            label="Prep Time" 
            onChange={(e) => onChange(e)}
            onBlur={(e) => { validators.required(e); if (values.prepTimeAmount) validators.positiveInt(e)}}
            error={errors.prepTimeAmount}
            required/>
          </div>
          <div id="prep-time-unit-container">
            <Select
            type="text" 
            name="prepTimeUnits"
            value={values.prepTimeUnits} 
            label="Units" 
            onChange={(e) => onChange(e)}
            onBlur={(e) => validators.required(e)}
            error={errors.prepTimeUnits}
            options={TIME_UNITS}
            required/>
          </div>
        </div>
        <div className="flex-column" id="cook-time-amount">
          <div id="cook-time-amt-container">
              <Textfield 
              type="number" 
              inputMode="numeric"
              name="cookTimeAmount"
              value={values.cookTimeAmount} 
              label="Cook Time" 
              onChange={(e) => onChange(e)}
              onBlur={(e) => { validators.required(e); if (values.cookTimeAmount) validators.positiveInt(e)}}
              error={errors.cookTimeAmount}
              required/>
            </div>
            <div id="cook-time-unit-container" className="end-column">
              <Select
              type="text" 
              name="cookTimeUnits"
              value={values.cookTimeUnits} 
              label="Units" 
              onChange={(e) => onChange(e)}
              onBlur={(e) => validators.required(e)}
              error={errors.cookTimeUnits}
              options={TIME_UNITS}
              required/>
            </div>
          </div>
      </div>
    )
  }

  const renderServingsAndCalories = () => {
    return(
    <div className="flex-row">
      <div className="flex-column" id="servings-and-measurements">
        <div id="servings-amount">
          <div id="servings-container">
            <Textfield 
            type="number"
            inputMode="numeric" 
            name="servings"
            value={values.servings} 
            label="Servings" 
            onChange={(e) => onChange(e)}
            onBlur={(e) => { validators.required(e); if (values.servings) validators.positiveInt(e)}}
            error={errors.servings}
            required/>
          </div>
        </div>
      </div>
      <div className="flex-column" id="calories">
        <div id="servings-amount">
          <div id="servings-container">
            <Textfield 
            type="number"
            inputMode="numeric" 
            name="calories"
            value={values.calories} 
            label="Calories" 
            onChange={(e) => onChange(e)}
            onBlur={(e) => {if (values.calories) validators.positiveInt(e)}}
            error={errors.calories}/>
          </div>
        </div>
      </div>
        <div className="flex-column" id="spacer">
        </div>
      </div>
    )
  }
  const renderIngredientsList = () => {
    return ingredients.length ? 
      ingredients.map((_, index) => 
      <div key={index} className="flex-row">
        <div className="flex-column">
          <div className="ingredient-quantity">
          <Textfield 
          type="number"
          inputMode="numeric" 
          name={`ingredientQuantity_${index}`}
          value={ingredients[index].qty} 
          label="Quantity" 
          onChange={(e) => eventHandlers.editIngredient(e, index)}
          onBlur={(e) => {validators.required(e); if (ingredients[index].qty) validators.positiveInt(e)}}
          error={errors[`ingredientQuantity_${index}`]}
          required/>
          </div>
          <div className="ingredient-unit">
            <Textfield 
            type="text" 
            name={`ingredientUnits_${index}`}
            value={ingredients[index].units} 
            label="Units" 
            onChange={(e) => eventHandlers.editIngredient(e, index)}
            error={errors[`ingredientUnits_${index}`]}/>
          </div>
          <div className="ingredient-name">
            <Textfield 
            type="text" 
            name={`ingredientName_${index}`}
            value={ingredients[index].name} 
            label="Name" 
            onChange={(e) => eventHandlers.editIngredient(e, index)}
            onBlur={(e) => validators.required(e)}
            error={errors[`ingredientName_${index}`]}
            required/>
          </div>
          <div className="delete-icon">
          <IconContext.Provider value={{color: '#000000'}}> 
            <button className="close-button"
            onClick={(e) => eventHandlers.deleteIngredient(index)}>
              <FaIcons.FaTimes className="close-icon"
              />
            </button>
          </IconContext.Provider>
          </div>
        </div>
      </div>)
      : '';
  }

 const renderStepsList = () => {
  return steps.length
    ? steps.map((_, index) => 
        <div key={index} className="flex-row">
          <div className="flex-column">
            <div className="recipe-step">
              <Textarea name="step" 
              value={steps[index].text} 
              name={`step_${index}`}
              label={`Step #${index + 1}`} 
              onChange={(e) => eventHandlers.editStep(e, index)}
              onBlur={(e) => validators.required(e)}
              error={errors[`step_${index}`]}
              required/>
            </div>
            <div className="delete-icon">
          <IconContext.Provider value={{color: '#000000'}}> 
            <button 
            className="close-button"
            onClick={() => eventHandlers.deleteStep(index)}>
              <FaIcons.FaTimes className="close-icon" 
              />
            </button>
          </IconContext.Provider>
          </div>
          </div>
        </div>
      )
    : ''
  }

  /*
    <!--<div className="delete-icon" style={{margin: 0}}>
              <IconContext.Provider value={{color: '#000000'}}> 
                <button 
                className="close-button"
                onClick={() => eventHandlers.deleteImage(index)}>
                  <FaIcons.FaTimes className="close-icon" 
                  />
                </button>
              </IconContext.Provider>
            </div>-->
  */ 

  const renderImagesList = () => {
    return images.length ?
      images.map((_, index) => 
        <div className="flex-row">
          <div className="flex-column">
            <div className="image-upload-container">
              <input type="file" className="imageInput" onChange={()=>{eventHandlers.loadImage(index);}}/>
            </div>

            
          </div>
        </div>
    ) : ''
  }

  const renderVisImages = () => {
    return visualImages.length ?
    visualImages.map((item) => 
      <div>
        <img src={URL.createObjectURL(item["images"])}/>
      </div>
    ) : ""
  }

  const renderIngredientsSection = () => {
    return (
    <div className="ingredients-area">
      <div className="flex-row">
        <div className="flex-column sub-header">
          <h1 style={{marginLeft: 10}} className="sub-header">Ingredients</h1>
        </div>
      </div>

      <div className="flex-row">
        <div className="flex-column">
          <Button filled label="Add Ingredient" onClick={(e) => eventHandlers.addIngredient(e)}/>
        </div>
      </div>

      {renderIngredientsList()}
    </div>
    );
  }

  const renderStepsSection = () => {
    return(
    <div>
      <div className="flex-row">
        <div className="flex-column sub-header">
          <h1 style={{marginLeft: 10}} className="sub-header">Steps</h1>
        </div>
      </div>

      <div className="flex-row">
        <div className="flex-column">
          <Button filled label="Add Step" onClick={(e) => eventHandlers.addStep(e)}/>
        </div>
      </div>

    {renderStepsList()}
  </div>)
  }

  /*
  <div className="flex-row">
        <div className="flex-column">
          <div className="add-image-button-container" style={{marginTop: 10}}>
            <button className="add-image-button" onClick={eventHandlers.addImage}>+ Add More Images</button>
          </div>
        </div>
      </div> 
      ------------------
      Goes in imgDis
      ------------
      {renderVisImages()}  
    */
  const renderImagesUpload = () => {
    return (
      <div>
        <div className="flex-row">
          <div className="flex-column sub-header">
            <h1 style={{marginLeft: 10}} className="sub-header">Images</h1>
        </div>
      </div>

      {renderImagesList()}

      <div id="imgDis">

        

      </div>
    </div>
    )
  }

  return (
    <div className="recipe-form">
      <h1 className="popup-header-text">Create Recipe</h1>
      <div> 
        {renderTitle()}
        {renderPrepAndCookTime()}
        {renderServingsAndCalories()}
        {renderIngredientsSection()}
        {renderStepsSection()}
        {renderImagesUpload()}
      </div>
    </div>
   );
}
