/*
*	Class.js
*	Written by Alex Smith
*
*	  Creates a more classic-friendly Class object
* 	with a more natural Inheritence scheme
*
*	Examples below
*/


var Class;

(function(){

	var purge = function(arg)
	{
		return arg.replace("\n", "").replace("\t", "").replace("\r", "").replace(" ", "").replace('"', "");
	};
	var getType = function(func)
	{
		var str = func.toString();
		var typeString =  str.replace("function", "").replace("{", "").replace("}", "").replace("\"", "").replace("(", "").replace(")").replace(" ", "").replace("\n", "").replace("\r", "").split(";")[1].replace("undefined", "");
		return purge(typeString);
	};

	var CLASS = function(constructor)
	{
		var strict = true;
		var _Class; //variable to hold Class object

		//Decide if a constructor was provided:

		//if no constructor is provided, initialize _Class
		if (!constructor)
		{
			_Class = function(){};
			_Class.Type = "Class";
		}
		//if a constructor is provided, assign it to _Class and parse a Type for it
		else
		{
			_Class = constructor;
			_Class.Type = _Class.prototype.Type = getType(constructor);
		}

		//holds all the properites of _Class
		_Class.Static = _Class.prototype;

		//Base object to hold inherited classes
		_Class.Base = null;

		//unique property for all Class objects
		_Class.___CLASS___ = true;

		//Inherit function
		//gives class all the properties of another class
		_Class.Inherits = function(classToInheritFrom)
		{
			//check to make sure classToInheritFrom is a Class
			if (!classToInheritFrom.___CLASS___)
			{
				throw "Class Error: Inherits: invalid argument. argument is not a Class";
			}
			//get all the properties of classToInheritFrom and
			//get it's Type
			var pPrototype = Object.create(classToInheritFrom.Static);
			var pType = classToInheritFrom.Type;

			//chews through all classToInheritFrom's properties and assigns them to _Class
			for (var key in pPrototype)
			{
				this.Static[key] = pPrototype[key];
			}

			//build a Type tree
			this.Static.Type += "|" + purge(pType);

			if (!this.base)
			{
				this.Base = classToInheritFrom.Static;
				_Class.Static.Base = classToInheritFrom.Static;
			}
			else
			{
				extend(this.Base, classToInheritFrom.Static);
			}
		};

		//Blend function
		//Combines existing _Class function with a new one
		_Class.Blend = function(functionName, newFunction)
		{
			//check if _Class contains property 'functionName'
			if (!_Class.Static[functionName])
			{
				throw "Class Error: Blend: '" + functionName + "' is not a valid argument";
			}
			//make sure it is a function
			if (typeof _Class.Static[functionName] != "function")
			{
				throw "Class Error: Blend: '" + functionName + "' is not a function";
			}
			//get the original _Class function
			var originalFunction = this.Static[functionName];

			//put them together
			this.Static[functionName] = function()
			{
				originalFunction();
				newFunction();
			}
		};

		//Property function
		//Add properties to _Class
		_Class.Property = function(key, value)
		{
			if (strict && this.Static[key])
			{
				throw "Class Error: Property: property '" + key + "' already exists";
			}

			this.Static[key] = value;
		};
		//shorthands
		_Class.Prop = _Class.P = _Class.Property;

		//Properties function
		//Adds multiple properties to _Class
		_Class.Properties = function(propertyList)
		{
			for (var key in propertyList)
			{
				if (strict && this.Static[key])
				{
					throw "Class Error: Property: property '" + key + "' already exists";
				}
				this.Static[key] = propertyList[key];
			}
		}


		//Override function
		//Changes existing peoperty if strict is true
		_Class.Override = function(key, value)
		{
			if (!this.Static[key])
			{
				throw "Class Error: Override: property '" + key + "' does not exist";
			}

			this.Static[key] = value;
		}

		_Class.Body = function()
		{
			var args = arguments;
			console.log(args);
		};

		return _Class;

	};

	CLASS.Assure = function(assureType, assureObject)
	{
		if (assureObject.Type && assureObject.Type == assureType)
		{
			return true;
		}
		else
		{
			throw "Class Error: Assure: the type '" + assureType + "' is not valid";
		}
	};



	Class = CLASS;

})();


//a few hacks
Object.Clone = function(o)
{
	var _o = {};
	for (key in o)
	{
		_o[key] = o[key];
	}
	return _o;
}
